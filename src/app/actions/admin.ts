'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function updatePaymentStatus(subscriptionId: string, status: string) {
  await requireAdmin();
  const validStatuses = ['pending', 'paid', 'failed', 'cancelled'];
  if (!validStatuses.includes(status)) throw new Error('Invalid status');

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('subscriptions')
    .update({
      payment_status: status,
      payment_provider: status === 'paid' ? 'manual' : undefined,
    })
    .eq('id', subscriptionId);

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

  const supabase = createServiceClient();
  const { error } = await supabase.from('discount_codes').insert({
    code: data.code.trim().toUpperCase(),
    discount_type: data.discountType,
    value: data.value,
    max_uses: data.maxUses,
    expires_at: data.expiresAt || null,
  });

  if (error) throw new Error('Failed to create discount code: ' + error.message);
  revalidatePath('/admin/discounts');
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  await requireAdmin();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('discount_codes')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw new Error('Failed to update discount code');
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
  revalidatePath('/admin/pricing');
  revalidatePath('/en/services');
  revalidatePath('/ar/services');
}
