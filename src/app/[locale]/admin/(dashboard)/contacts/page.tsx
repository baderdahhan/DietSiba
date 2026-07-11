import { createServiceClient } from '@/lib/supabase/server';
import { ContactsTable } from '@/components/admin/ContactsTable';
import { PaginationNav, parsePage } from '@/components/admin/PaginationNav';

const PAGE_SIZE = 50;

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  created_at: string;
  email_sent: boolean;
  admin_reply: string | null;
  replied_at: string | null;
};

async function getContacts(page: number): Promise<{ rows: ContactMessage[]; total: number }> {
  const supabase = createServiceClient();
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from('contact_messages')
    .select(
      'id, name, email, phone, message, locale, created_at, email_sent, admin_reply, replied_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return { rows: [], total: 0 };
  return { rows: data || [], total: count ?? 0 };
}

export default async function ContactsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const page = parsePage(searchParams.page);
  const { rows, total } = await getContacts(page);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
      <ContactsTable contacts={rows} />
      <PaginationNav
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath={`/${locale}/admin/contacts`}
      />
    </div>
  );
}
