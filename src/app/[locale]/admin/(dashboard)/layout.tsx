import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/admin';
import { AdminNav } from '@/components/admin/AdminNav';

// The auth check below reads cookies inside a try/catch, which would swallow
// Next's dynamic-rendering bailout and freeze these routes as static
// redirects at build time. Force every admin page to render per-request.
export const dynamic = 'force-dynamic';

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </div>
    </div>
  );
}
