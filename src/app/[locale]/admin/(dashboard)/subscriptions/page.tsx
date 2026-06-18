import { createServiceClient } from '@/lib/supabase/server';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';

async function getSubscriptions() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, name, email, phone, message, price_charged, payment_status, locale, created_at, email_sent, subscription_tiers(name, slug), discount_codes(code)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
  return (data || []) as unknown as Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string | null;
    price_charged: number;
    payment_status: string;
    locale: string;
    created_at: string;
    email_sent: boolean;
    subscription_tiers: { name: { en: string; ar: string }; slug: string } | null;
    discount_codes: { code: string } | null;
  }>;
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
