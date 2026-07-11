import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { formatDate } from '@/lib/format-date';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
};

type Section = { title: string; text: string };

export default async function PrivacyPage() {
  const t = await getTranslations({ locale: 'tr', namespace: 'privacy' });
  const sections = t.raw('sections') as Record<string, Section>;

  return (
    <section className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green font-semibold tracking-wide mb-4">
            {t('title')}
          </h1>
          <p className="text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
          <p className="text-muted text-sm mt-2">{t('lastUpdated', { date: formatDate(new Date()) })}</p>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 border border-border space-y-8">
          <div>
            <h2 className="font-heading text-lg text-green font-semibold mb-2">
              {t('dataController')}
            </h2>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {t('dataControllerText')}
            </p>
          </div>

          {Object.values(sections).map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg text-green font-semibold mb-2">
                {section.title}
              </h2>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
