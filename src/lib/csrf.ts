import { createHmac, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_SECRET = process.env.CSRF_SECRET || 'dev-csrf-secret-change-me';
const COOKIE_NAME = '__csrf';
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

function sign(payload: string): string {
  return createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');
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

    if (!cookieToken || cookieToken !== token) {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [nonce, timestamp, signature] = parts;
    const expectedSig = sign(`${nonce}.${timestamp}`);

    if (signature !== expectedSig) return false;

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > TOKEN_EXPIRY) return false;

    return true;
  } catch {
    return false;
  }
}
