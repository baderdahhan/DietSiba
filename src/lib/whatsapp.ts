export const WHATSAPP_NUMBER = '905523066066';

export function whatsappLink(message?: string): string {
  return whatsappLinkForPhone(WHATSAPP_NUMBER, message);
}

export function whatsappLinkForPhone(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
