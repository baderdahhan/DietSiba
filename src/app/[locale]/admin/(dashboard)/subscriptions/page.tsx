import { createServiceClient } from '@/lib/supabase/server';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';

async function getSubscriptions() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, subscription_tiers(name, slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
  return data || [];
}

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Subscriptions</h1>
      <SubscriptionsTable subscriptions={subscriptions} />
    </div>
  );
}
