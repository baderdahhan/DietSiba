'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { checkRateLimit, recordRequest, hashIp } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/get-ip';

export type DiscountValidationResult = {
  valid: boolean;
  discountType?: 'percentage' | 'fixed';
  value?: number;
  error?: string;
};

export async function validateDiscountCode(
  code: string
): Promise<DiscountValidationResult> {
  if (!code.trim()) return { valid: false };

  const ipHash = hashIp(getClientIp());
  const { allowed } = await checkRateLimit(ipHash, 'discount_check');
  if (!allowed) {
    return { valid: false, error: 'rateLimited' };
  }
  await recordRequest(ipHash, 'discount_check');

  const supabase = createServiceClient();
  const normalizedCode = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, discount_type, value, max_uses, used_count, expires_at')
    .eq('code', normalizedCode)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, error: 'invalidCode' };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'invalidCode' };
  }

  if (data.max_uses !== null && data.used_count >= data.max_uses) {
    return { valid: false, error: 'invalidCode' };
  }

  return {
    valid: true,
    discountType: data.discount_type as 'percentage' | 'fixed',
    value: data.value,
  };
}
