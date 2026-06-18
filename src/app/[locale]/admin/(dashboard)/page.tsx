import { createServiceClient } from '@/lib/supabase/server';

export const revalidate = 30;

async function getStats() {
  const supabase = createServiceClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [subsToday, subsWeek, subsTotal, pendingPayments, contactsWeek, activeCodes] =
    await Promise.all([
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStart),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'pending'),
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStart),
      supabase
        .from('discount_codes')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
    ]);

  return {
    subsToday: subsToday.count ?? 0,
    subsWeek: subsWeek.count ?? 0,
    subsTotal: subsTotal.count ?? 0,
    pendingPayments: pendingPayments.count ?? 0,
    contactsWeek: contactsWeek.count ?? 0,
    activeCodes: activeCodes.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Subscriptions Today', value: stats.subsToday, color: 'text-green' },
    { label: 'Subscriptions This Week', value: stats.subsWeek, color: 'text-green' },
    { label: 'Total Subscriptions', value: stats.subsTotal, color: 'text-gray-900' },
    { label: 'Pending Payments', value: stats.pendingPayments, color: 'text-amber-600' },
    { label: 'Contacts This Week', value: stats.contactsWeek, color: 'text-blue-600' },
    { label: 'Active Discount Codes', value: stats.activeCodes, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className={`text-3xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
