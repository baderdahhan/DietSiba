import { createServiceClient } from '@/lib/supabase/server';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { PaginationNav, parsePage } from '@/components/admin/PaginationNav';

const PAGE_SIZE = 50;

async function getSubscriptions(page: number) {
  const supabase = createServiceClient();
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from('subscriptions')
    .select(
      'id, name, email, phone, message, price_charged, payment_status, locale, created_at, email_sent, subscription_tiers(name, slug), discount_codes(code)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return { rows: [], total: 0 };
  }
  return {
    rows: (data || []) as unknown as Array<{
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
    }>,
    total: count ?? 0,
  };
}

export default async function SubscriptionsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const page = parsePage(searchParams.page);
  const { rows, total } = await getSubscriptions(page);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Subscriptions</h1>
      <SubscriptionsTable subscriptions={rows} />
      <PaginationNav
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath={`/${locale}/admin/subscriptions`}
      />
    </div>
  );
}
