'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { subscribeAction } from '@/app/actions/subscribe';
import { validateDiscountCode } from '@/app/actions/discount';
import { getCsrfToken } from '@/app/actions/csrf';
import { Link } from '@/i18n/navigation';
import { Modal } from '@/components/ui/Modal';

type Tier = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  price: number;
  currency: string;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  discountCode: string;
  honeypot: string;
};

export function SubscribeModal({
  tier,
  locale,
  onClose,
}: {
  tier: Tier;
  locale: string;
  onClose: () => void;
}) {
  const tv = useTranslations('validation');
  const ts = useTranslations('subscribeForm');
  const tierName = tier.name[locale as 'en' | 'ar'] || tier.name.en;

  const [formLoadedAt] = useState(Date.now());
  const [csrfToken, setCsrfToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [discountResult, setDiscountResult] = useState<{
    valid: boolean;
    discountType?: 'percentage' | 'fixed';
    value?: number;
  } | null>(null);
  const [discountChecking, setDiscountChecking] = useState(false);

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      discountCode: '',
      honeypot: '',
    },
  });

  const discountCodeValue = watch('discountCode');

  const finalPrice = useCallback(() => {
    if (!discountResult?.valid) return tier.price;
    if (discountResult.discountType === 'percentage') {
      return Math.max(0, tier.price * (1 - (discountResult.value || 0) / 100));
    }
    return Math.max(0, tier.price - (discountResult.value || 0));
  }, [discountResult, tier.price]);

  async function handleApplyDiscount() {
    if (!discountCodeValue.trim()) return;
    setDiscountChecking(true);
    const result = await validateDiscountCode(discountCodeValue);
    setDiscountResult(result);
    setDiscountChecking(false);
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError('');

    try {
      const result = await subscribeAction(csrfToken, {
        ...values,
        tierId: tier.id,
        locale,
        formLoadedAt,
      });

      if (!result) {
        setServerError(tv('genericError'));
      } else if (result.success) {
        setSuccess(true);
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
    } catch {
      setServerError(tv('genericError'));
    }

    setSubmitting(false);
  }

  return (
    <Modal onClose={onClose} title={ts('title', { tier: tierName })}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-heading text-xl text-green">
            {ts('title', { tier: tierName })}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-green mb-2">{ts('success')}</h3>
              <p className="text-muted text-sm mb-6">{ts('successMessage')}</p>
              <Link
                href="/services"
                onClick={onClose}
                className="text-green text-sm font-medium hover:underline"
              >
                {ts('backToPlans')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot - hidden from humans */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" name="website" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {ts('name')} <span className="text-red-500">*</span>
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
                  placeholder={ts('namePlaceholder')}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {ts('email')} <span className="text-red-500">*</span>
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
                  placeholder={ts('emailPlaceholder')}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {ts('phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: tv('phoneInvalid'),
                  })}
                  placeholder={ts('phonePlaceholder')}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {ts('message')}
                </label>
                <textarea
                  {...register('message', {
                    maxLength: { value: 500, message: tv('messageTooLong') },
                  })}
                  rows={3}
                  placeholder={ts('messagePlaceholder')}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {ts('discountCode')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register('discountCode')}
                    placeholder={ts('discountCodePlaceholder')}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={discountChecking}
                    className="px-4 py-2.5 rounded-lg border border-green text-green text-sm font-medium hover:bg-green hover:text-cream transition-colors disabled:opacity-50"
                  >
                    {ts('apply')}
                  </button>
                </div>
                {discountResult && !discountResult.valid && (
                  <p className="text-red-500 text-xs mt-1">{ts('invalidCode')}</p>
                )}
                {discountResult?.valid && (
                  <p className="text-green text-xs mt-1">{ts('codeApplied')}</p>
                )}
              </div>

              <div className="bg-cream/80 rounded-lg p-4 space-y-1.5 text-sm">
                {discountResult?.valid && (
                  <>
                    <div className="flex justify-between text-muted">
                      <span>{ts('originalPrice')}</span>
                      <span>{tier.price} {tier.currency}</span>
                    </div>
                    <div className="flex justify-between text-gold-dark">
                      <span>{ts('discount')}</span>
                      <span>
                        {discountResult.discountType === 'percentage'
                          ? `-${discountResult.value}%`
                          : `-${discountResult.value} ${tier.currency}`}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-semibold text-green">
                  <span>{ts('finalPrice')}</span>
                  <span>{finalPrice()} {tier.currency}</span>
                </div>
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
                {submitting ? ts('submitting') : ts('submit')}
              </button>
            </form>
          )}
        </div>
    </Modal>
  );
}
