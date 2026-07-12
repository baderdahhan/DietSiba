import { escapeHtml } from './escape';

export type EmailLocale = 'en' | 'ar' | 'tr';

const COLORS = {
  green: '#4A5D3A',
  gold: '#C2A14D',
  cream: '#F7F4ED',
  text: '#2D2D2D',
  muted: '#6B6B6B',
};

const SIGNATURES: Record<EmailLocale, string> = {
  en: 'Best regards,<br>Siba Osman<br>Nutrition Specialist',
  ar: 'مع أطيب التحيات،<br>صبا عثمان<br>أخصائية تغذية',
  tr: 'Saygılarımızla,<br>Siba Osman<br>Beslenme Uzmanı',
};

function dirFor(locale: EmailLocale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

function normalizeLocale(locale: string): EmailLocale {
  return locale === 'ar' || locale === 'tr' ? locale : 'en';
}

function baseTemplate(content: string, locale: EmailLocale = 'en') {
  const dir = dirFor(locale);
  return `<!DOCTYPE html>
<html dir="${dir}" lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:${COLORS.cream};font-family:Arial,sans-serif;color:${COLORS.text};direction:${dir};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
<tr><td style="background:${COLORS.green};padding:24px;text-align:center;">
<span style="color:${COLORS.gold};font-size:24px;font-weight:bold;letter-spacing:2px;">SIBA OSMAN</span>
</td></tr>
<tr><td style="padding:32px 24px;">${content}</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;color:${COLORS.muted};font-size:12px;">
&copy; ${new Date().getFullYear()} Siba Osman
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function signedBody(locale: EmailLocale, heading: string, body: string) {
  return `<h2 style="color:${COLORS.green};margin:0 0 16px;">${heading}</h2>
${body}
<p style="color:${COLORS.muted};font-size:14px;">${SIGNATURES[locale]}</p>`;
}

export function subscriptionConfirmationEmail(
  rawLocale: string,
  data: { name: string; tierName: string }
) {
  const locale = normalizeLocale(rawLocale);
  const safeName = escapeHtml(data.name);
  const safeTier = escapeHtml(data.tierName);

  const copy: Record<EmailLocale, { subject: string; heading: string; body: string }> = {
    en: {
      subject: `Thank you for subscribing to ${data.tierName}`,
      heading: 'Thank You for Subscribing!',
      body: `<p>Hi ${safeName},</p>
<p>Thank you for subscribing to the <strong>${safeTier}</strong> plan. We'll contact you shortly to get started on your health journey.</p>`,
    },
    ar: {
      subject: `شكراً لاشتراكك في خطة ${data.tierName}`,
      heading: 'شكراً لاشتراكك!',
      body: `<p>مرحباً ${safeName}،</p>
<p>شكراً لاشتراكك في خطة <strong>${safeTier}</strong>. سنتواصل معك قريباً للبدء في رحلتك الصحية.</p>`,
    },
    tr: {
      subject: `${data.tierName} planına aboneliğiniz için teşekkürler`,
      heading: 'Aboneliğiniz İçin Teşekkürler!',
      body: `<p>Merhaba ${safeName},</p>
<p><strong>${safeTier}</strong> planına abone olduğunuz için teşekkür ederiz. Sağlıklı yaşam yolculuğunuza başlamak için kısa süre içinde sizinle iletişime geçeceğiz.</p>`,
    },
  };

  const c = copy[locale];
  return {
    subject: c.subject,
    html: baseTemplate(signedBody(locale, c.heading, c.body), locale),
  };
}

export function subscriptionAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  tierName: string;
}) {
  const content = `<h2 style="color:${COLORS.green};margin:0 0 16px;">New Subscription</h2>
<table style="width:100%;font-size:14px;">
<tr><td style="padding:6px 0;color:${COLORS.muted};width:100px;"><strong>Name:</strong></td><td>${escapeHtml(data.name)}</td></tr>
<tr><td style="padding:6px 0;color:${COLORS.muted};"><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
<tr><td style="padding:6px 0;color:${COLORS.muted};"><strong>Phone:</strong></td><td>${escapeHtml(data.phone)}</td></tr>
<tr><td style="padding:6px 0;color:${COLORS.muted};"><strong>Plan:</strong></td><td>${escapeHtml(data.tierName)}</td></tr>
</table>`;

  return {
    subject: `New subscription: ${data.tierName} – ${data.name}`,
    html: baseTemplate(content),
  };
}

export function contactConfirmationEmail(rawLocale: string, data: { name: string }) {
  const locale = normalizeLocale(rawLocale);
  const safeName = escapeHtml(data.name);

  const copy: Record<EmailLocale, { subject: string; heading: string; body: string }> = {
    en: {
      subject: 'Thank you for reaching out — Siba Osman',
      heading: 'Thank You for Reaching Out!',
      body: `<p>Hi ${safeName},</p>
<p>We've received your message and will get back to you as soon as possible.</p>`,
    },
    ar: {
      subject: 'شكراً لتواصلك — صبا عثمان',
      heading: 'شكراً لتواصلك!',
      body: `<p>مرحباً ${safeName}،</p>
<p>لقد تلقينا رسالتك وسنعود إليك في أقرب وقت ممكن.</p>`,
    },
    tr: {
      subject: 'Bize ulaştığınız için teşekkürler — Siba Osman',
      heading: 'Bize Ulaştığınız İçin Teşekkürler!',
      body: `<p>Merhaba ${safeName},</p>
<p>Mesajınızı aldık ve en kısa sürede size geri döneceğiz.</p>`,
    },
  };

  const c = copy[locale];
  return {
    subject: c.subject,
    html: baseTemplate(signedBody(locale, c.heading, c.body), locale),
  };
}

export function contactReplyEmail(
  rawLocale: string,
  data: { name: string; replyMessage: string }
) {
  const locale = normalizeLocale(rawLocale);
  const safeName = escapeHtml(data.name);
  const safeReply = escapeHtml(data.replyMessage).replace(/\n/g, '<br>');
  const replyBox = `<div style="margin:16px 0;padding:12px;background:${COLORS.cream};border-radius:6px;font-size:14px;">${safeReply}</div>`;

  const copy: Record<EmailLocale, { subject: string; heading: string; greeting: string }> = {
    en: {
      subject: 'Reply from Siba Osman',
      heading: 'Reply to Your Message',
      greeting: `<p>Hi ${safeName},</p>`,
    },
    ar: {
      subject: 'رد من صبا عثمان على رسالتك',
      heading: 'رد على رسالتك',
      greeting: `<p>مرحباً ${safeName}،</p>`,
    },
    tr: {
      subject: 'Siba Osman’dan mesajınıza yanıt',
      heading: 'Mesajınıza Yanıt',
      greeting: `<p>Merhaba ${safeName},</p>`,
    },
  };

  const c = copy[locale];
  return {
    subject: c.subject,
    html: baseTemplate(signedBody(locale, c.heading, `${c.greeting}${replyBox}`), locale),
  };
}

export function contactAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const content = `<h2 style="color:${COLORS.green};margin:0 0 16px;">New Contact Message</h2>
<table style="width:100%;font-size:14px;">
<tr><td style="padding:6px 0;color:${COLORS.muted};width:100px;"><strong>Name:</strong></td><td>${escapeHtml(data.name)}</td></tr>
<tr><td style="padding:6px 0;color:${COLORS.muted};"><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
<tr><td style="padding:6px 0;color:${COLORS.muted};"><strong>Phone:</strong></td><td>${escapeHtml(data.phone || '—')}</td></tr>
</table>
${data.message ? `<div style="margin-top:16px;padding:12px;background:${COLORS.cream};border-radius:6px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</div>` : ''}`;

  return {
    subject: `New contact: ${data.name}`,
    html: baseTemplate(content),
  };
}
