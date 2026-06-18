# DietSiba — withdietitiansiba

Marketing and lead-capture website for dietitian Siba Osman. Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- Bilingual (English / Arabic) with full RTL support
- Subscription tier system (admin-managed, unlimited tiers)
- Contact form with spam protection (honeypot + timing check + rate limiting)
- Admin panel with dashboard, subscription management, contact messages, discount codes, and pricing editor
- SMTP email notifications (lead confirmation + admin notification)
- CSRF protection on all public forms
- Atomic discount code redemption (no race conditions)
- Payment-provider-agnostic (manual "Mark as Paid" + webhook stub)

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, React Server Components)
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (admin only)
- **Email**: Nodemailer (SMTP)
- **Validation**: Zod + React Hook Form
- **Deploy**: Vercel

## Setup

### 1. Clone and install

```bash
git clone https://github.com/baderdahhan/DietSiba.git
cd DietSiba
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_add_is_popular.sql`
3. Go to **Authentication > Users > Add User** and create the admin account (email + password)
4. Go to **Settings > API** and copy your keys

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase (from Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SMTP (Gmail example — requires App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Siba Osman <your-email@gmail.com>"
ADMIN_NOTIFICATION_EMAIL=admin@example.com

# Security
CSRF_SECRET=generate-a-random-string-here

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Gmail SMTP setup:**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use the 16-character password as `SMTP_PASSWORD`

### 4. Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin (redirects to /en/admin/login)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel project settings
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/          # Home, Services, Contact (with header/footer)
│   │   └── admin/             # Admin panel (no header/footer)
│   │       ├── login/
│   │       └── (dashboard)/   # Protected by auth
│   ├── actions/               # Server actions (subscribe, contact, admin, csrf)
│   └── api/                   # API routes (check-history, payment webhook)
├── components/
│   ├── admin/                 # Admin UI components
│   ├── layout/                # Header, Footer, LanguageSwitcher
│   └── services/              # TierCard, SubscribeModal
├── i18n/                      # next-intl config
└── lib/
    ├── email/                 # SMTP transport, templates, escaping
    ├── supabase/              # Client configs (browser, server, admin)
    ├── csrf.ts                # CSRF token generation/validation
    ├── rate-limit.ts          # DB-backed rate limiting
    ├── spam.ts                # Honeypot + timing check
    └── validation.ts          # Zod schemas
messages/
├── en.json                    # English translations
└── ar.json                    # Arabic translations
supabase/
└── migrations/                # SQL migration files
```

## Admin Panel

Access via `/admin`. The admin can:

- **Dashboard**: View subscription/contact/discount stats
- **Subscriptions**: View all leads, filter by status, mark as paid/failed, check submission history
- **Contacts**: View all contact messages with full detail view
- **Discounts**: Create, activate/deactivate, and delete discount codes
- **Pricing**: Add/edit/delete tiers, manage features, set "Most Popular" badge

## Open Items Before Go-Live

- [ ] Final SMTP mailbox (custom domain recommended over Gmail for deliverability)
- [ ] Payment provider approval (iyzico "Get Paid by Link" or similar)
- [ ] Final tier names, pricing, and feature copy from Siba
- [ ] Logo file: place the transparent PNG at `public/logo1.png`
- [ ] Generate a strong `CSRF_SECRET` for production
