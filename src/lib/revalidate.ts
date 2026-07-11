import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

/**
 * Revalidate the given locale-relative paths for every supported locale.
 * Pass paths without a locale prefix, e.g. `revalidateForAllLocales('/services', '/')`.
 */
export function revalidateForAllLocales(...paths: string[]) {
  for (const locale of routing.locales) {
    for (const path of paths) {
      revalidatePath(path === '/' ? `/${locale}` : `/${locale}${path}`);
    }
  }
}
