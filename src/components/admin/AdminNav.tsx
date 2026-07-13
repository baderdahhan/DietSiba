'use client';

import { useState } from 'react';
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
    { href: `/${locale}/admin/audit-log`, label: 'Activity' },
  ];
}

export function AdminNav({ email, locale }: { email: string; locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(locale);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <Link href={`/${locale}/admin`} prefetch={false} className="font-semibold text-green text-sm">
              Siba Admin
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
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
              className="text-xs text-gray-600 hover:text-red-600 transition-colors hidden sm:block"
            >
              Logout
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-green text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="px-3 py-1 text-xs text-gray-400">{email}</p>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
