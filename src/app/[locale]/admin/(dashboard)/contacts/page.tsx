import { createServiceClient } from '@/lib/supabase/server';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  created_at: string;
};

async function getContacts(): Promise<ContactMessage[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, message, locale, created_at')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Lang</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{contact.message}</td>
                  <td className="px-4 py-3 text-gray-500 uppercase text-xs">{contact.locale}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No contact messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
