import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
};

// Real revision date of the contract text (dd.mm.yyyy). Update when the
// content changes — do not compute from the current date.
const LAST_UPDATED = '12.07.2026';

type TextSection = { title: string; text: string };
type PartiesSection = {
  title: string;
  seller: string;
  sellerDetails: string;
  buyer: string;
  buyerDetails: string;
};
type Section = TextSection | PartiesSection;

function isPartiesSection(section: Section): section is PartiesSection {
  return 'seller' in section;
}

export default async function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale: 'tr', namespace: 'terms' });
  const sections = t.raw('sections') as Record<string, Section>;

  return (
    <section className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green font-semibold tracking-wide mb-4">
            {t('title')}
          </h1>
          <p className="text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
          <p className="text-muted text-sm mt-2">{t('lastUpdated', { date: LAST_UPDATED })}</p>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 border border-border space-y-8">
          {Object.values(sections).map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg text-green font-semibold mb-2">
                {section.title}
              </h2>
              {isPartiesSection(section) ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">{section.seller}</p>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {section.sellerDetails}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{section.buyer}</p>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {section.buyerDetails}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
