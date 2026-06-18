import { headers } from 'next/headers';

export function getClientIp(): string {
  const h = headers();
  // Vercel sets this reliably and it can't be spoofed
  return (
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
