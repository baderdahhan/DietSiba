'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SubscribeModal } from './SubscribeModal';
import { localized, type Tier } from '@/lib/types';

export function TierCard({
  tier,
  locale,
  isPopular,
}: {
  tier: Tier;
  locale: string;
  isPopular: boolean;
}) {
  const t = useTranslations();
  const [showModal, setShowModal] = useState(false);
  const tierName = localized(tier.name, locale);
  const features = tier.features.map((f) => localized(f, locale));

  return (
    <>
      <div
        className={`relative bg-white rounded-lg p-8 shadow-sm border transition-all hover:shadow-md flex flex-col ${
          isPopular
            ? 'border-gold ring-2 ring-gold/20 scale-[1.02]'
            : 'border-border'
        }`}
      >
        {isPopular && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap">
            {t('plans.mostPopular')}
          </span>
        )}

        <h3 className="font-heading text-2xl text-green text-center mb-2 tracking-wide">
          {tierName}
        </h3>
        <div className="text-center mb-6">
          {tier.price === 0 ? (
            <span className="text-4xl font-heading text-green font-semibold">
              {t('plans.free')}
            </span>
          ) : (
            <>
              <span className="text-4xl font-heading text-green font-semibold">
                {tier.price}
              </span>
              <span className="text-sm text-muted ms-1">{tier.currency}</span>
              <p className="text-xs text-muted mt-1">{t('plans.perMonth')}</p>
            </>
          )}
        </div>

        <div className="flex-1 mb-6">
          <h4 className="text-xs uppercase tracking-wider text-muted mb-3 font-medium">
            {t('services.features')}
          </h4>
          <ul className="space-y-2.5">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <svg
                  className="w-4 h-4 text-green shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            isPopular
              ? 'bg-green text-cream hover:bg-green-dark'
              : 'border border-green text-green hover:bg-green hover:text-cream'
          }`}
        >
          {t('services.subscribe')}
        </button>
      </div>

      {showModal && (
        <SubscribeModal
          tier={tier}
          locale={locale}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
