'use server';

import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

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
  await requireAdmin();
  const parsed = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'paid', 'failed', 'cancelled']),
  }).safeParse({ id: subscriptionId, status });

  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('subscriptions')
    .update({
      payment_status: parsed.data.status,
      payment_provider: parsed.data.status === 'paid' ? 'manual' : undefined,
    })
    .eq('id', parsed.data.id);

  if (error) throw new Error('Failed to update status');
  revalidatePath('/admin/subscriptions');
}

export async function createDiscountCode(data: {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  maxUses: number | null;
  expiresAt: string | null;
}) {
  await requireAdmin();

  const parsed = z.object({
    code: z.string().trim().min(1).max(20),
    discountType: z.enum(['percentage', 'fixed']),
    value: z.number().positive(),
    maxUses: z.number().int().positive().nullable(),
    expiresAt: z.string().nullable(),
  }).safeParse(data);

  if (!parsed.success) throw new Error('Invalid input');

  const supabase = createServiceClient();
  const { error } = await supabase.from('discount_codes').insert({
    code: parsed.data.code.toUpperCase(),
    discount_type: parsed.data.discountType,
    value: parsed.data.value,
    max_uses: parsed.data.maxUses,
    expires_at: parsed.data.expiresAt || null,
  });

  if (error) throw new Error('Failed to create discount code: ' + error.message);
  revalidatePath('/admin/discounts');
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('discount_codes')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw new Error('Failed to update discount code');
  revalidatePath('/admin/discounts');
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Failed to delete discount code');
  revalidatePath('/admin/discounts');
}

export async function updateTier(
  tierId: string,
  data: {
    name: { en: string; ar: string };
    price: number;
    currency: string;
    features: Array<{ en: string; ar: string }>;
  }
) {
  await requireAdmin();
  z.string().uuid().parse(tierId);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('subscription_tiers')
    .update({
      name: data.name,
      price: data.price,
      currency: data.currency,
      features: data.features,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tierId);

  if (error) throw new Error('Failed to update tier');
  revalidatePricing();
}

export async function createTier(data: {
  nameEn: string;
  nameAr: string;
  price: number;
  currency: string;
}) {
  await requireAdmin();

  const supabase = createServiceClient();
  const slug = data.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { data: maxOrder } = await supabase
    .from('subscription_tiers')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from('subscription_tiers').insert({
    slug,
    name: { en: data.nameEn, ar: data.nameAr },
    price: data.price,
    currency: data.currency,
    features: [],
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) throw new Error('Failed to create tier: ' + error.message);
  revalidatePricing();
}

export async function deleteTier(id: string) {
  await requireAdmin();
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
  } else {
    const { error } = await supabase
      .from('subscription_tiers')
      .delete()
      .eq('id', id);
    if (error) throw new Error('Failed to delete tier');
  }

  revalidatePricing();
}

export async function setPopularTier(id: string) {
  await requireAdmin();
  z.string().uuid().parse(id);

  const supabase = createServiceClient();

  await supabase
    .from('subscription_tiers')
    .update({ is_popular: false })
    .neq('id', id);

  const { error } = await supabase
    .from('subscription_tiers')
    .update({ is_popular: true })
    .eq('id', id);

  if (error) throw new Error('Failed to set popular tier');
  revalidatePricing();
}

function revalidatePricing() {
  revalidatePath('/admin/pricing');
  revalidatePath('/en/services');
  revalidatePath('/ar/services');
  revalidatePath('/en');
  revalidatePath('/ar');
}
