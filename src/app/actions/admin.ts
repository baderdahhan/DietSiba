'use server';

import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/supabase/admin';
import { revalidateForAllLocales } from '@/lib/revalidate';
import { logAudit } from '@/lib/audit';
import { sendContactReplyEmail } from '@/lib/email/send';

async function requireAdmin() {
  let user = null;
  try {
    user = await getAdminUser();
  } catch {
    throw new Error('Unauthorized');
  }
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function updatePaymentStatus(subscriptionId: string, status: string) {
  const admin = await requireAdmin();
  const parsed = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'paid', 'failed', 'cancelled']),
  }).safeParse({ id: subscriptionId, status });

  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const updateData: Record<string, string> = { payment_status: parsed.data.status };
  if (parsed.data.status === 'paid') {
    updateData.payment_provider = 'manual';
  }

  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', parsed.data.id);

  if (error) throw new Error('Failed to update status');
  await logAudit(admin.email!, 'update_payment_status', 'subscription', parsed.data.id, { status: parsed.data.status });
  revalidateForAllLocales('/admin/subscriptions', '/admin');
}

export async function createDiscountCode(data: {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  maxUses: number | null;
  expiresAt: string | null;
}) {
  const admin = await requireAdmin();

  const parsed = z.object({
    code: z.string().trim().min(1).max(20),
    discountType: z.enum(['percentage', 'fixed']),
    value: z.number().positive(),
    maxUses: z.number().int().positive().nullable(),
    expiresAt: z.string().nullable(),
  }).refine(
    (d) => d.discountType !== 'percentage' || d.value <= 100,
    { message: 'Percentage discount cannot exceed 100%', path: ['value'] }
  ).safeParse(data);

  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const { error } = await supabase.from('discount_codes').insert({
    code: parsed.data.code.toUpperCase(),
    discount_type: parsed.data.discountType,
    value: parsed.data.value,
    max_uses: parsed.data.maxUses,
    expires_at: parsed.data.expiresAt || null,
  });

  if (error) {
    console.error('Failed to create discount code:', error.message);
    throw new Error('Failed to create discount code');
  }
  await logAudit(admin.email!, 'create_discount', 'discount_code', undefined, { code: parsed.data.code.toUpperCase() });
  revalidateForAllLocales('/admin/discounts');
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  const admin = await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('discount_codes')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw new Error('Failed to update discount code');
  await logAudit(admin.email!, isActive ? 'activate_discount' : 'deactivate_discount', 'discount_code', id);
  revalidateForAllLocales('/admin/discounts');
}

export async function deleteDiscountCode(id: string) {
  const admin = await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Failed to delete discount code');
  await logAudit(admin.email!, 'delete_discount', 'discount_code', id);
  revalidateForAllLocales('/admin/discounts');
}

const tierUpdateSchema = z.object({
  name: z.object({ en: z.string().min(1).max(100), ar: z.string().min(1).max(100) }),
  price: z.number().positive(),
  currency: z.string().min(1).max(10),
  features: z.array(z.object({ en: z.string().max(200), ar: z.string().max(200) })),
});

export async function updateTier(
  tierId: string,
  data: {
    name: { en: string; ar: string };
    price: number;
    currency: string;
    features: Array<{ en: string; ar: string }>;
  }
) {
  const admin = await requireAdmin();
  z.string().uuid().parse(tierId);
  const parsed = tierUpdateSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('subscription_tiers')
    .update({
      name: parsed.data.name,
      price: parsed.data.price,
      currency: parsed.data.currency,
      features: parsed.data.features,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tierId);

  if (error) throw new Error('Failed to update tier');
  await logAudit(admin.email!, 'update_tier', 'subscription_tier', tierId, { name: data.name.en, price: data.price });
  revalidatePricing();
}

const createTierSchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameAr: z.string().trim().min(1).max(100),
  price: z.number().positive(),
  currency: z.string().trim().min(1).max(10),
});

export async function createTier(data: {
  nameEn: string;
  nameAr: string;
  price: number;
  currency: string;
}) {
  const admin = await requireAdmin();

  const parsed = createTierSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const slug = parsed.data.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { data: maxOrder } = await supabase
    .from('subscription_tiers')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from('subscription_tiers').insert({
    slug,
    name: { en: parsed.data.nameEn, ar: parsed.data.nameAr },
    price: parsed.data.price,
    currency: parsed.data.currency,
    features: [],
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) {
    console.error('Failed to create tier:', error.message);
    throw new Error('Failed to create tier');
  }
  await logAudit(admin.email!, 'create_tier', 'subscription_tier', undefined, { name: parsed.data.nameEn, price: parsed.data.price });
  revalidatePricing();
}

export async function deleteTier(id: string) {
  const admin = await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();

  const { count } = await supabase
    .from('subscriptions')
    .select('id', { count: 'exact', head: true })
    .eq('tier_id', id);

  if (count && count > 0) {
    const { error } = await supabase
      .from('subscription_tiers')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw new Error('Failed to deactivate tier');
    await logAudit(admin.email!, 'deactivate_tier', 'subscription_tier', id);
  } else {
    const { error } = await supabase
      .from('subscription_tiers')
      .delete()
      .eq('id', id);
    if (error) throw new Error('Failed to delete tier');
    await logAudit(admin.email!, 'delete_tier', 'subscription_tier', id);
  }

  revalidatePricing();
}

export async function setPopularTier(id: string) {
  const admin = await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();

  const { error } = await supabase.rpc('set_popular_tier', { p_tier_id: id });

  if (error) throw new Error('Failed to set popular tier');

  await logAudit(admin.email!, 'set_popular', 'subscription_tier', id);
  revalidatePricing();
}

export async function replyToContact(contactId: string, message: string) {
  const admin = await requireAdmin();
  const parsed = z.object({
    id: z.string().uuid(),
    message: z.string().trim().min(1).max(2000),
  }).safeParse({ id: contactId, message });

  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const { data: contact } = await supabase
    .from('contact_messages')
    .select('name, email, locale')
    .eq('id', parsed.data.id)
    .single();

  if (!contact) throw new Error('Contact not found');

  const sent = await sendContactReplyEmail({
    name: contact.name,
    email: contact.email,
    locale: contact.locale,
    replyMessage: parsed.data.message,
  });

  if (!sent) throw new Error('Failed to send reply email');

  const { error } = await supabase
    .from('contact_messages')
    .update({ admin_reply: parsed.data.message, replied_at: new Date().toISOString() })
    .eq('id', parsed.data.id);

  if (error) throw new Error('Failed to save reply');

  await logAudit(admin.email!, 'reply_contact', 'contact_message', parsed.data.id);
  revalidateForAllLocales('/admin/contacts');
}

function revalidatePricing() {
  revalidateForAllLocales('/admin/pricing', '/services', '/');
}
