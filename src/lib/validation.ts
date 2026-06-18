import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'nameRequired')
  .max(100, 'nameInvalid')
  .regex(/^[\p{L}\p{M}\s'.\-]+$/u, 'nameInvalid');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'emailRequired')
  .email('emailInvalid')
  .max(254, 'emailInvalid');

export const phoneSchema = z
  .string()
  .trim()
  .refine((val) => isValidPhoneNumber(val, 'TR'), 'phoneInvalid');

export const phoneOptionalSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || isValidPhoneNumber(val, 'TR'),
    'phoneInvalid'
  );

export const messageSchema = z
  .string()
  .trim()
  .max(500, 'messageTooLong')
  .optional()
  .default('');

export const messageRequiredSchema = z
  .string()
  .trim()
  .min(1, 'messageRequired')
  .max(500, 'messageTooLong');

export const discountCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .transform((val) => val === '' ? '' : val)
  .refine((val) => val === '' || /^[A-Z0-9_\-]{3,20}$/.test(val), 'Invalid discount code');

export const subscribeFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: messageSchema,
  tierId: z.string().uuid(),
  discountCode: discountCodeSchema,
  locale: z.enum(['en', 'ar']),
  honeypot: z.string(),
  formLoadedAt: z.number(),
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneOptionalSchema,
  message: messageRequiredSchema,
  locale: z.enum(['en', 'ar']),
  honeypot: z.string(),
  formLoadedAt: z.number(),
});

export type SubscribeFormData = z.infer<typeof subscribeFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
