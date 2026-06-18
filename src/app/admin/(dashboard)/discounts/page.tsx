import { createServiceClient } from '@/lib/supabase/server';
import { DiscountsManager } from '@/components/admin/DiscountsManager';

async function getDiscountCodes() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function DiscountsPage() {
  const codes = await getDiscountCodes();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Discount Codes</h1>
      <DiscountsManager codes={codes} />
    </div>
  );
}
