const MIN_FORM_TIME_MS = 2000;

export function isSpamSubmission(honeypot: string, formLoadedAt: number): boolean {
  if (honeypot !== '') return true;
  if (Date.now() - formLoadedAt < MIN_FORM_TIME_MS) return true;
  return false;
}
