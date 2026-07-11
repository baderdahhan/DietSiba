# Changes Log

Plain-language list of what was changed or added to this project, and which files were touched for each one. New entries get added here every time something new is changed, so anyone on the team can follow along without needing to read the code.

---

## 1. Fixed wrong/inconsistent dates in the admin panel

Dates in the admin panel (Subscriptions, Contacts, Discounts, Activity Log) were showing in different formats depending on the visitor's browser settings (sometimes day/month, sometimes month/day), which also caused a page error (hydration error). Dates now always show the same way for everyone: day.month.year, Turkey time.

**Files changed (pushed to GitHub):**
- `src/lib/format-date.ts` (new file)
- `src/app/[locale]/admin/(dashboard)/audit-log/page.tsx`
- `src/components/admin/ContactsTable.tsx`
- `src/components/admin/DiscountsManager.tsx`
- `src/components/admin/SubscriptionsTable.tsx`

---

## 2. Unified dashboard stat colors

All the numbers on the admin Dashboard page (Subscriptions Today, Pending Payments, Active Discount Codes, etc.) used to show in different colors (green, orange, blue, purple). They're now all the same brand green.

**Files changed (pushed to GitHub):**
- `src/app/[locale]/admin/(dashboard)/page.tsx`

---

## 3. Added the ability to reply to contact messages from the admin panel

The admin can now write a reply directly inside a contact message's detail view and send it by email to that person, without leaving the admin panel. The reply is saved and shown the next time that message is opened, and a "Replied" badge shows up next to the message in the list.

**Files changed (pushed to GitHub):**
- `supabase/migrations/006_contact_reply.sql` (new — adds the `admin_reply` / `replied_at` columns; needs to be run once in the Supabase SQL Editor)
- `src/lib/email/templates.ts`
- `src/lib/email/send.ts`
- `src/app/actions/admin.ts`
- `src/app/[locale]/admin/(dashboard)/contacts/page.tsx`
- `src/components/admin/ContactsTable.tsx`

---

## 4. Admin notification emails now reply straight to the customer

When Siba gets an email notifying her of a new subscription or a new contact message, hitting "Reply" in her own email app (Gmail, Outlook, etc.) now goes straight to that customer's email address — not back to the site's own email. This works from her regular inbox, no need to open the admin panel.

**Files changed (pushed to GitHub):**
- `src/lib/email/send.ts`

---

## 5. Search box in Subscriptions and Contacts

Added a search box to both the Subscriptions and Contacts pages in the admin panel. Typing a name, email, or phone number now filters the list instantly. On Subscriptions, it works together with the existing status filter (all/pending/paid/failed/cancelled).

**Files changed (pushed to GitHub):**
- `src/components/admin/SubscriptionsTable.tsx`
- `src/components/admin/ContactsTable.tsx`

---

## 6. New / Replied filter on Contact Messages

Added filter tabs (All / New / Replied) to the Contacts page in the admin panel, next to the search box, so it's easy to see at a glance which messages still need a reply and none get missed.

**Files changed (pushed to GitHub):**
- `src/components/admin/ContactsTable.tsx`

---

## 7. Fixed the Arabic spelling of Siba's name

The Arabic text was spelling the name "سيبا" (a common but incorrect spelling), fixed to the correct "صبا" everywhere it appears: the Arabic site text (title, greeting, services blurb) and the Arabic email templates (signature, reply subject line).

**Files changed (pushed to GitHub):**
- `messages/ar.json`
- `src/lib/email/templates.ts`

---

## 8. Added WhatsApp contact in four places

Added a way to reach Siba directly on WhatsApp (not a floating button, just text/icon links) in:
- The footer, next to her name
- The Contact page, as a quick alternative above the form
- The "thank you" screen right after subscribing to a plan
- The admin panel, next to each customer's phone number in Subscriptions and Contacts, so whoever manages the site can message that specific lead directly

Every link uses the real WhatsApp logo (`src/components/ui/WhatsAppIcon.tsx`) and a shared helper (`src/lib/whatsapp.ts`) to build the `wa.me` links, so the number only needs to be set in one place.

**Files changed (pushed to GitHub):**
- `src/lib/whatsapp.ts` (new)
- `src/components/ui/WhatsAppIcon.tsx` (new)
- `src/components/layout/Footer.tsx`
- `src/app/[locale]/(public)/contact/page.tsx`
- `src/components/services/SubscribeModal.tsx`
- `src/components/admin/SubscriptionsTable.tsx`
- `src/components/admin/ContactsTable.tsx`
- `messages/en.json`, `messages/ar.json`, `messages/tr.json`

---

## 9. Mobile-tested the WhatsApp feature and fixed a copy issue

Actually tested the WhatsApp links (footer, contact page, subscribe success screen) on a real mobile screen size. Everything displayed correctly with no layout issues, but the Contact page banner read redundantly ("Message us directly on WhatsApp. Message on WhatsApp") — shortened the prompt text so it doesn't repeat itself, in all three languages.

**Files changed (pushed to GitHub):**
- `messages/en.json`
- `messages/ar.json`
- `messages/tr.json`

*(Also added `playwright` as a dev-only testing tool to check this — it doesn't affect the live site.)*

---

## Local-only files (changed, but never pushed to GitHub)

- **`.env.local`** — holds the real Supabase project keys and email login used to run the site on this machine. It's intentionally excluded by `.gitignore` (the `.env*.local` rule), so it never goes to GitHub. Each person/machine running this project needs to create their own copy with their own real values.
