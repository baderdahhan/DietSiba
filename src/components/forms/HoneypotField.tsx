'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

/** Visually hidden spam-trap input. Real users never see or fill it. */
export function HoneypotField({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div
      style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <input type="text" {...registration} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
