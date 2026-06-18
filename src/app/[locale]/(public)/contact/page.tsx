'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { contactAction } from '@/app/actions/contact';
import { getCsrfToken } from '@/app/actions/csrf';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
};

export default function ContactPage() {
  const t = useTranslations('contact');
  const tv = useTranslations('validation');
  const locale = useLocale();

  const [formLoadedAt] = useState(Date.now());
  const [csrfToken, setCsrfToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      honeypot: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError('');

    const result = await contactAction(csrfToken, {
      ...values,
      locale,
      formLoadedAt,
    });

    if (result.success) {
      setSuccess(true);
      reset();
    } else if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof FormValues, { message: msg });
      });
    } else {
      const errorKey = result.error || 'genericError';
      try {
        setServerError(tv(errorKey));
      } catch {
        setServerError(result.error || tv('genericError'));
      }
    }

    setSubmitting(false);
  }

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl text-green mb-4 tracking-wide">
            {t('title')}
          </h1>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </div>

        {success ? (
          <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
            <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-heading text-2xl text-green mb-2">{t('success')}</h2>
            <p className="text-muted text-sm mb-6">{t('successMessage')}</p>
            <button
              onClick={() => {
                setSuccess(false);
                getCsrfToken().then(setCsrfToken);
              }}
              className="text-green text-sm font-medium hover:underline"
            >
              {t('sendAnother')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-sm border border-border p-6 sm:p-8 space-y-5"
          >
            {/* Honeypot */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', {
                  required: tv('nameRequired'),
                  pattern: {
                    value: /^[\p{L}\p{M}\s'.\-]+$/u,
                    message: tv('nameInvalid'),
                  },
                  minLength: { value: 2, message: tv('nameRequired') },
                  maxLength: { value: 100, message: tv('nameInvalid') },
                })}
                placeholder={t('namePlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: tv('emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: tv('emailInvalid'),
                  },
                })}
                placeholder={t('emailPlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('phone')}
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder={t('phonePlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('message')} <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('message', {
                  required: tv('messageRequired'),
                  maxLength: { value: 1000, message: tv('messageTooLong') },
                })}
                rows={5}
                placeholder={t('messagePlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green text-cream py-3 rounded-lg font-medium text-sm hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
