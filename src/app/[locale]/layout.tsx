import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  const messages = await getMessages();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";`,
        }}
      />
      <div
        dir={dir}
        lang={locale}
        className="bg-cream text-foreground flex flex-col min-h-screen"
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </div>
    </>
  );
}
