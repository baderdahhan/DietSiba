import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createServiceClient } from '@/lib/supabase/server';
import { TierCard } from '@/components/services/TierCard';
import type { Tier } from '@/lib/types';

type TierRow = Tier & { sort_order: number; is_popular: boolean };

async function getTiers(): Promise<TierRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data) return [];
  return data as TierRow[];
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const tiers = await getTiers();

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-heading text-4xl sm:text-5xl text-green mb-4 tracking-wide">
            {t('title')}
          </h1>
          <p className="text-muted max-w-xl mx-auto text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              locale={locale}
              isPopular={tier.is_popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
