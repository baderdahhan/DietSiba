import { createServiceClient } from '@/lib/supabase/server';
import { PricingEditor } from '@/components/admin/PricingEditor';

async function getTiers() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .order('sort_order');

  if (error) return [];
  return data || [];
}

export default async function PricingPage() {
  const tiers = await getTiers();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Pricing Management</h1>
      <PricingEditor tiers={tiers} />
    </div>
  );
}
