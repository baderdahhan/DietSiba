import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/admin';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let user = null;
  try {
    user = await getAdminUser();
  } catch {
    redirect(`/${locale}/admin/login`);
  }

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen">
      <AdminNav email={user.email || ''} locale={locale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
