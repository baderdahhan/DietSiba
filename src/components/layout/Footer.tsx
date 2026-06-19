import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-green text-cream/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src="/logo1.png"
              alt="Siba Osman"
              className="h-12 w-auto brightness-0 invert mb-4"
            />
            <p className="text-cream/70 text-sm">{t('footer.tagline')}</p>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-gold">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-gold">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-gold">
              {t('nav.contact')}
            </h3>
            <p className="text-sm text-cream/70">
              Siba Osman
              <br />
              {t('footer.role')}
            </p>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <img
                  src="/payment/iyzico.svg"
                  alt="iyzico"
                  className="h-6 w-auto"
                />
                <img
                  src="/payment/visa.svg"
                  alt="Visa"
                  className="h-6 w-auto"
                />
                <img
                  src="/payment/mastercard.svg"
                  alt="Mastercard"
                  className="h-6 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/20 text-center text-xs text-cream/50">
          &copy; {new Date().getFullYear()} Siba Osman. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
