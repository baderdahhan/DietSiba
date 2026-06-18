import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gold font-heading text-lg sm:text-xl mb-3 tracking-widest uppercase">
            {t('greeting')}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-green font-semibold leading-tight mb-6 tracking-wide">
            {t('title')}
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
          <Link
            href="/services"
            className="inline-block bg-green text-cream font-medium px-8 py-3.5 rounded-lg hover:bg-green-dark transition-colors tracking-wide text-sm uppercase"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}

function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  const icons = [
    <svg key="plan" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    <svg key="support" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    <svg key="expert" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    <svg key="results" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl text-green text-center mb-14 tracking-wide">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="text-center p-6 rounded-lg bg-cream/50 hover:bg-cream transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green/10 text-green mb-5">
                {icons[i]}
              </div>
              <h3 className="font-heading text-xl text-green mb-3">
                {t(`steps.${i}.title`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t(`steps.${i}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlansTeaser() {
  const t = useTranslations('plans');

  const tiers = [
    { name: 'Silver', nameAr: 'فضي', price: '500' },
    { name: 'Gold', nameAr: 'ذهبي', price: '800' },
    { name: 'Diamond', nameAr: 'ماسي', price: '1200' },
  ];

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl text-green mb-4 tracking-wide">
            {t('title')}
          </h2>
          <p className="text-muted max-w-lg mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-lg p-6 shadow-sm border transition-shadow hover:shadow-md ${
                i === 1
                  ? 'border-gold ring-2 ring-gold/20'
                  : 'border-border'
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-medium px-3 py-1 rounded-full">
                  {t('mostPopular')}
                </span>
              )}
              <h3 className="font-heading text-xl text-green text-center mb-2">
                {tier.name}
              </h3>
              <p className="text-center text-3xl font-heading text-green font-semibold mb-1">
                {tier.price} <span className="text-sm text-muted font-body">TRY</span>
              </p>
              <p className="text-center text-xs text-muted mb-6">
                {t('perMonth')}
              </p>
              <Link
                href="/services"
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  i === 1
                    ? 'bg-green text-cream hover:bg-green-dark'
                    : 'border border-green text-green hover:bg-green hover:text-cream'
                }`}
              >
                {t('subscribe')}
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="text-green font-medium text-sm hover:text-green-dark transition-colors underline underline-offset-4 decoration-gold"
          >
            {t('cta')} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations('ctaSection');

  return (
    <section className="bg-green py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl text-cream mb-4 tracking-wide">
          {t('title')}
        </h2>
        <p className="text-cream/70 mb-10 max-w-lg mx-auto">{t('subtitle')}</p>
        <Link
          href="/contact"
          className="inline-block bg-gold text-white font-medium px-8 py-3.5 rounded-lg hover:bg-gold-dark transition-colors tracking-wide text-sm uppercase"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <PlansTeaser />
      <CTASection />
    </>
  );
}
