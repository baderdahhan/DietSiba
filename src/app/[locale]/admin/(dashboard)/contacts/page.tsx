import { createServiceClient } from '@/lib/supabase/server';
import { ContactsTable } from '@/components/admin/ContactsTable';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  created_at: string;
  email_sent: boolean;
};

async function getContacts(): Promise<ContactMessage[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, message, locale, created_at, email_sent')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
      <ContactsTable contacts={contacts} />
    </div>
  );
}
