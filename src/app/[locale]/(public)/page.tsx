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

function ServicesSection() {
  const t = useTranslations('howItWorks');

  const icons = [
    <svg key="0" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /><circle cx="18" cy="17.25" r="3" /></svg>,
    <svg key="1" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
    <svg key="2" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.5 4.5h-11L5 14.5m14 0H5" /></svg>,
    <svg key="3" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    <svg key="4" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    <svg key="5" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green tracking-wide italic">
            {t('title')}
          </h2>
        </div>

        {/* Mobile: horizontal scroll | Tablet+: grid */}
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="group snap-start shrink-0 w-[280px] bg-cream/60 rounded-2xl p-6 border border-transparent hover:border-border"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-green/10 text-green flex items-center justify-center">
                  {icons[i]}
                </div>
                <div>
                  <h3 className="font-heading text-base text-green font-semibold mb-1">
                    {t(`services.${i}.title`)}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {t(`services.${i}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet and up: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="group relative bg-cream/60 rounded-2xl p-7 transition-all duration-300 hover:bg-cream hover:shadow-md border border-transparent hover:border-border"
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-green/10 text-green flex items-center justify-center group-hover:bg-green group-hover:text-cream transition-colors">
                  {icons[i]}
                </div>
                <div>
                  <h3 className="font-heading text-lg text-green font-semibold mb-1.5">
                    {t(`services.${i}.title`)}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {t(`services.${i}.description`)}
                  </p>
                </div>
              </div>
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
      <ServicesSection />
      <PlansTeaser />
      <CTASection />
    </>
  );
}
