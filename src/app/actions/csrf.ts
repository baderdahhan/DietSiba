'use server';

import { generateCsrfToken } from '@/lib/csrf';

export async function getCsrfToken(): Promise<string> {
  return generateCsrfToken();
}
