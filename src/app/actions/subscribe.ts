'use server';

import { subscribeFormSchema, normalizeEmail, normalizePhone } from '@/lib/validation';
import { validateCsrfToken } from '@/lib/csrf';
import { checkRateLimit, recordRequest, hashIp } from '@/lib/rate-limit';
import { isSpamSubmission } from '@/lib/spam';
import { createServiceClient } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/get-ip';
import { sendSubscriptionEmails } from '@/lib/email/send';

export type SubscribeResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function subscribeAction(
  csrfToken: string,
  formData: unknown
): Promise<SubscribeResult> {
  try {
    if (!validateCsrfToken(csrfToken)) {
      return { success: false, error: 'Invalid request. Please refresh and try again.' };
    }

    const parsed = subscribeFormSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]?.toString();
        if (field) fieldErrors[field] = issue.message;
      }
      return { success: false, fieldErrors };
    }

    const data = parsed.data;

    if (isSpamSubmission(data.honeypot, data.formLoadedAt)) {
      return { success: true };
    }

    const ipHash = hashIp(getClientIp());

    const { allowed } = await checkRateLimit(ipHash, 'subscribe');
    if (!allowed) {
      return { success: false, error: 'rateLimited' };
    }

    await recordRequest(ipHash, 'subscribe');

    const supabase = createServiceClient();

    const { data: subId, error } = await supabase.rpc('create_subscription', {
      p_name: data.name,
      p_email: data.email,
      p_phone: data.phone,
      p_message: data.message || null,
      p_tier_id: data.tierId,
      p_discount_code: data.discountCode || null,
      p_locale: data.locale,
      p_email_normalized: normalizeEmail(data.email),
      p_phone_normalized: normalizePhone(data.phone),
    });

    if (error) {
      console.error('Subscription error:', error);
      if (error.message?.includes('discount')) {
        return { success: false, error: 'invalidCode' };
      }
      return { success: false, error: 'genericError' };
    }

    const { data: tier } = await supabase
      .from('subscription_tiers')
      .select('name')
      .eq('id', data.tierId)
      .single();

    const tierName =
      tier?.name?.[data.locale as keyof typeof tier.name] || 'Plan';

    let emailSent = false;
    try {
      await sendSubscriptionEmails({
        name: data.name,
        email: data.email,
        phone: data.phone,
        tierName,
        locale: data.locale,
      });
      emailSent = true;
    } catch (e) {
      console.error('Email send failed (non-blocking):', e);
    }

    if (subId) {
      await supabase
        .from('subscriptions')
        .update({ email_sent: emailSent })
        .eq('id', subId);
    }

    return { success: true };
  } catch (e) {
    console.error('Subscribe action crashed:', e);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
