import { encode } from 'he';

export function escapeHtml(text: string): string {
  return encode(text, { useNamedReferences: true });
}
