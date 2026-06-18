import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_SECRET = process.env.CSRF_SECRET || '';
const COOKIE_NAME = '__csrf';
const TOKEN_EXPIRY = 60 * 60 * 1000;

if (!CSRF_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: CSRF_SECRET environment variable is not set in production!');
}

function sign(payload: string): string {
  return createHmac('sha256', CSRF_SECRET || 'dev-csrf-secret-change-me').update(payload).digest('hex');
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return timingSafeEqual(bufA, bufB);
}

export function generateCsrfToken(): string {
  const nonce = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const payload = `${nonce}.${timestamp}`;
  const signature = sign(payload);
  const token = `${payload}.${signature}`;

  try {
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
    });
  } catch {
    // cookies() can throw in some server component contexts
  }

  return token;
}

export function validateCsrfToken(token: string): boolean {
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!cookieToken || !constantTimeCompare(cookieToken, token)) {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [nonce, timestamp, signature] = parts;
    const expectedSig = sign(`${nonce}.${timestamp}`);

    if (!constantTimeCompare(signature, expectedSig)) return false;

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > TOKEN_EXPIRY) return false;

    return true;
  } catch {
    return false;
  }
}
