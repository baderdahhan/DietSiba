// Validation patterns shared between the Zod schemas (server) and
// react-hook-form rules (client). Keep this file dependency-free so
// importing it doesn't pull zod into the client bundle.

export const NAME_PATTERN = /^[\p{L}\p{M}\s'.\-]+$/u;

export const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
