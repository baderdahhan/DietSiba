'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';

const locales = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'عربي', short: 'عربي' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-green/30 text-green hover:bg-green hover:text-cream transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current.short}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full mt-1.5 end-0 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50"
        >
          {locales.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === locale}
                onClick={() => {
                  router.replace(pathname, { locale: l.code });
                  setOpen(false);
                }}
                className={`w-full text-start px-4 py-2 text-sm transition-colors hover:bg-cream ${
                  l.code === locale
                    ? 'text-green font-medium'
                    : 'text-foreground/70'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
