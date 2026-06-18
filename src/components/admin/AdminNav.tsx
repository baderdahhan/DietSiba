'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function getNavItems(locale: string) {
  return [
    { href: `/${locale}/admin`, label: 'Dashboard' },
    { href: `/${locale}/admin/subscriptions`, label: 'Subscriptions' },
    { href: `/${locale}/admin/contacts`, label: 'Contacts' },
    { href: `/${locale}/admin/discounts`, label: 'Discounts' },
    { href: `/${locale}/admin/pricing`, label: 'Pricing' },
  ];
}

export function AdminNav({ email, locale }: { email: string; locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(locale);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/admin`} className="font-semibold text-green text-sm">
              Siba Admin
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-green text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
