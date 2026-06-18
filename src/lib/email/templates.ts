import { escapeHtml } from './escape';

const COLORS = {
  green: '#4A5D3A',
  gold: '#C2A14D',
  cream: '#F7F4ED',
  text: '#2D2D2D',
  muted: '#6B6B6B',
};

function baseTemplate(content: string, dir: 'ltr' | 'rtl' = 'ltr') {
  return `<!DOCTYPE html>
<html dir="${dir}" lang="${dir === 'rtl' ? 'ar' : 'en'}">
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

export function subscriptionConfirmationEmail(
  locale: 'en' | 'ar',
  data: { name: string; tierName: string }
) {
  const safeName = escapeHtml(data.name);
  const safeTier = escapeHtml(data.tierName);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const content =
    locale === 'ar'
      ? `<h2 style="color:${COLORS.green};margin:0 0 16px;">شكراً لاشتراكك!</h2>
<p>مرحباً ${safeName}،</p>
<p>شكراً لاشتراكك في خطة <strong>${safeTier}</strong>. سنتواصل معك قريباً للبدء في رحلتك الصحية.</p>
<p style="color:${COLORS.muted};font-size:14px;">مع أطيب التحيات،<br>سيبا عثمان<br>أخصائية تغذية</p>`
      : `<h2 style="color:${COLORS.green};margin:0 0 16px;">Thank You for Subscribing!</h2>
<p>Hi ${safeName},</p>
<p>Thank you for subscribing to the <strong>${safeTier}</strong> plan. We'll contact you shortly to get started on your health journey.</p>
<p style="color:${COLORS.muted};font-size:14px;">Best regards,<br>Siba Osman<br>Nutrition Specialist</p>`;

  return {
    subject:
      locale === 'ar'
        ? `شكراً لاشتراكك في خطة ${data.tierName}`
        : `Thank you for subscribing to ${data.tierName}`,
    html: baseTemplate(content, dir),
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

export function contactConfirmationEmail(
  locale: 'en' | 'ar',
  data: { name: string }
) {
  const safeName = escapeHtml(data.name);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const content =
    locale === 'ar'
      ? `<h2 style="color:${COLORS.green};margin:0 0 16px;">شكراً لتواصلك!</h2>
<p>مرحباً ${safeName}،</p>
<p>لقد تلقينا رسالتك وسنعود إليك في أقرب وقت ممكن.</p>
<p style="color:${COLORS.muted};font-size:14px;">مع أطيب التحيات،<br>سيبا عثمان<br>أخصائية تغذية</p>`
      : `<h2 style="color:${COLORS.green};margin:0 0 16px;">Thank You for Reaching Out!</h2>
<p>Hi ${safeName},</p>
<p>We've received your message and will get back to you as soon as possible.</p>
<p style="color:${COLORS.muted};font-size:14px;">Best regards,<br>Siba Osman<br>Nutrition Specialist</p>`;

  return {
    subject:
      locale === 'ar'
        ? 'شكراً لتواصلك — سيبا عثمان'
        : 'Thank you for reaching out — Siba Osman',
    html: baseTemplate(content, dir),
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
