'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCsrfToken } from '@/app/actions/csrf';

/** Fetches a CSRF token on mount; `refresh` mints a new one (e.g. before re-submitting). */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState('');

  const refresh = useCallback(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { csrfToken, refresh };
}
