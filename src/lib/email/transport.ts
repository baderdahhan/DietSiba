import nodemailer from 'nodemailer';

export function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export const FROM_ADDRESS = process.env.SMTP_FROM || 'Siba Osman <noreply@example.com>';
export const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || '';
