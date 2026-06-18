'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = locale === 'en' ? 'ar' : 'en';
  const label = locale === 'en' ? 'عربي' : 'EN';

  return (
    <button
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className="text-sm font-medium px-3 py-1.5 rounded-full border border-green/30 text-green hover:bg-green hover:text-cream transition-colors"
    >
      {label}
    </button>
  );
}
