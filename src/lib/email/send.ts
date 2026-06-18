import { createTransport, FROM_ADDRESS, ADMIN_EMAIL } from './transport';
import {
  subscriptionConfirmationEmail,
  subscriptionAdminNotification,
  contactConfirmationEmail,
  contactAdminNotification,
} from './templates';

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transport = createTransport();
    await transport.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendSubscriptionEmails(data: {
  name: string;
  email: string;
  phone: string;
  tierName: string;
  locale: 'en' | 'ar';
}) {
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

  await Promise.allSettled([
    sendEmail(data.email, lead.subject, lead.html),
    ADMIN_EMAIL
      ? sendEmail(ADMIN_EMAIL, admin.subject, admin.html)
      : Promise.resolve(),
  ]);
}

export async function sendContactEmails(data: {
  name: string;
  email: string;
  phone: string;
  locale: 'en' | 'ar';
}) {
  const lead = contactConfirmationEmail(data.locale, { name: data.name });
  const admin = contactAdminNotification({
    name: data.name,
    email: data.email,
    phone: data.phone,
  });

  await Promise.allSettled([
    sendEmail(data.email, lead.subject, lead.html),
    ADMIN_EMAIL
      ? sendEmail(ADMIN_EMAIL, admin.subject, admin.html)
      : Promise.resolve(),
  ]);
}
