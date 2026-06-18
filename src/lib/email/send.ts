import { createTransport, FROM_ADDRESS, ADMIN_EMAIL } from './transport';
import {
  subscriptionConfirmationEmail,
  subscriptionAdminNotification,
  contactConfirmationEmail,
  contactAdminNotification,
} from './templates';

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const transport = createTransport();
    await transport.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendSubscriptionEmails(data: {
  name: string;
  email: string;
  phone: string;
  tierName: string;
  locale: 'en' | 'ar';
}): Promise<boolean> {
  const lead = subscriptionConfirmationEmail(data.locale, {
    name: data.name,
    tierName: data.tierName,
  });

  const admin = subscriptionAdminNotification({
    name: data.name,
    email: data.email,
    phone: data.phone,
    tierName: data.tierName,
  });

  const results = await Promise.allSettled([
    sendEmail(data.email, lead.subject, lead.html),
    ADMIN_EMAIL
      ? sendEmail(ADMIN_EMAIL, admin.subject, admin.html)
      : Promise.resolve(true),
  ]);

  const leadSent = results[0].status === 'fulfilled' && results[0].value === true;
  return leadSent;
}

export async function sendContactEmails(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: 'en' | 'ar';
}): Promise<boolean> {
  const lead = contactConfirmationEmail(data.locale, { name: data.name });
  const admin = contactAdminNotification({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });

  const results = await Promise.allSettled([
    sendEmail(data.email, lead.subject, lead.html),
    ADMIN_EMAIL
      ? sendEmail(ADMIN_EMAIL, admin.subject, admin.html)
      : Promise.resolve(true),
  ]);

  const leadSent = results[0].status === 'fulfilled' && results[0].value === true;
  return leadSent;
}
