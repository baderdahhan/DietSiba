type Translator = (key: string) => string;

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Translate a validation message key, falling back to the raw key (or a fallback string) when no translation exists. */
export function safeTranslate(t: Translator, key: string, fallback?: string): string {
  try {
    return t(key);
  } catch {
    return fallback ?? key;
  }
}

/**
 * Shared handling for subscribe/contact server-action results:
 * routes field errors to the form, other errors to a banner, and
 * translates message keys with a raw-text fallback.
 */
export function handleActionResult(
  result: ActionResult | null | undefined,
  opts: {
    t: Translator;
    onSuccess: () => void;
    onFieldError: (field: string, message: string) => void;
    onServerError: (message: string) => void;
  }
) {
  const { t, onSuccess, onFieldError, onServerError } = opts;

  if (!result) {
    onServerError(safeTranslate(t, 'genericError'));
    return;
  }
  if (result.success) {
    onSuccess();
    return;
  }
  if (result.fieldErrors) {
    for (const [field, msg] of Object.entries(result.fieldErrors)) {
      onFieldError(field, safeTranslate(t, msg));
    }
    return;
  }
  const errorKey = result.error || 'genericError';
  onServerError(safeTranslate(t, errorKey, result.error || safeTranslate(t, 'genericError')));
}
