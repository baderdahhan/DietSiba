import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-green text-cream/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              {t('nav.contact')}
            </h3>
            <p className="text-sm text-cream/70">
              Siba Osman
              <br />
              {t('footer.role')}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/20 text-center text-xs text-cream/50">
          &copy; {new Date().getFullYear()} Siba Osman. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
