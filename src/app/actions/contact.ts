'use server';

import { contactFormSchema, normalizeEmail, normalizePhone } from '@/lib/validation';
import { validateCsrfToken } from '@/lib/csrf';
import { checkRateLimit, recordRequest, hashIp } from '@/lib/rate-limit';
import { isSpamSubmission } from '@/lib/spam';
import { createServiceClient } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/get-ip';
import { sendContactEmails } from '@/lib/email/send';

export type ContactResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function contactAction(
  csrfToken: string,
  formData: unknown
): Promise<ContactResult> {
  try {
    if (!validateCsrfToken(csrfToken)) {
      return { success: false, error: 'Invalid request. Please refresh and try again.' };
    }

    const parsed = contactFormSchema.safeParse(formData);
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

    const { allowed } = await checkRateLimit(ipHash, 'contact');
    if (!allowed) {
      return { success: false, error: 'rateLimited' };
    }

    await recordRequest(ipHash, 'contact');

    const supabase = createServiceClient();

    const { data: inserted, error } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      locale: data.locale,
      email_normalized: normalizeEmail(data.email),
      phone_normalized: normalizePhone(data.phone || ''),
    }).select('id').single();

    if (error) {
      console.error('Contact insert error:', error);
      return { success: false, error: 'genericError' };
    }

    const emailSent = await sendContactEmails({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: data.message,
      locale: data.locale,
    });

    if (inserted?.id) {
      await supabase
        .from('contact_messages')
        .update({ email_sent: emailSent })
        .eq('id', inserted.id);
    }

    return { success: true };
  } catch (e) {
    console.error('Contact action crashed:', e);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
