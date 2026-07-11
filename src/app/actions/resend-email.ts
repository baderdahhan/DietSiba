'use server';

import { z } from 'zod';
import { getAdminUser } from '@/lib/supabase/admin';
import { createServiceClient } from '@/lib/supabase/server';
import { sendSubscriptionEmails, sendContactEmails } from '@/lib/email/send';
import { logAudit } from '@/lib/audit';
import { localized, type LocalizedText } from '@/lib/types';

export async function resendSubscriptionEmail(subscriptionId: string) {
  const admin = await getAdminUser();
  if (!admin) throw new Error('Unauthorized');
  z.string().uuid().parse(subscriptionId);

  const supabase = createServiceClient();
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, name, email, phone, locale, tier_id, subscription_tiers(name)')
    .eq('id', subscriptionId)
    .single();

  if (!sub) throw new Error('Subscription not found');

  const tierData = sub.subscription_tiers as unknown as { name: LocalizedText } | null;
  const tierName = localized(tierData?.name, sub.locale) || 'Plan';

  const sent = await sendSubscriptionEmails({
    name: sub.name,
    email: sub.email,
    phone: sub.phone,
    tierName,
    locale: sub.locale,
  });

  if (!sent) throw new Error('Failed to send email');

  await supabase
    .from('subscriptions')
    .update({ email_sent: true })
    .eq('id', subscriptionId);

  await logAudit(admin.email!, 'resend_email', 'subscription', subscriptionId);
}

export async function resendContactEmail(contactId: string) {
  const admin = await getAdminUser();
  if (!admin) throw new Error('Unauthorized');
  z.string().uuid().parse(contactId);

  const supabase = createServiceClient();
  const { data: contact } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, message, locale')
    .eq('id', contactId)
    .single();

  if (!contact) throw new Error('Contact not found');

  const sent = await sendContactEmails({
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
    message: contact.message || '',
    locale: contact.locale,
  });

  if (!sent) throw new Error('Failed to send email');

  await supabase
    .from('contact_messages')
    .update({ email_sent: true })
    .eq('id', contactId);

  await logAudit(admin.email!, 'resend_email', 'contact_message', contactId);
}
