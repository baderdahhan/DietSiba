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

## Local-only files (changed, but never pushed to GitHub)

- **`.env.local`** — holds the real Supabase project keys and email login used to run the site on this machine. It's intentionally excluded by `.gitignore` (the `.env*.local` rule), so it never goes to GitHub. Each person/machine running this project needs to create their own copy with their own real values.
