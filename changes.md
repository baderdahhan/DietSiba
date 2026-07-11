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

## 10. Fixed "Set as Popular" throwing an error

Clicking "Set as Popular" on a pricing tier in the admin panel failed with a generic "Failed to update" error. The underlying database function was trying to update every row in the pricing table at once, and the database blocks updates like that unless they're explicit about it. Adjusted the function so it explicitly confirms it means to touch every row.

**Files changed (pushed to GitHub):**
- `supabase/migrations/007_fix_set_popular_tier.sql` (new — needs to be run once in the Supabase SQL Editor, same as the others)

---

## 11. Activity log now updates immediately

Every admin action (changing a payment status, editing a price, deleting a discount code, etc.) writes an entry to the Activity page, but the page itself wasn't being told to refresh — so a new entry only showed up after a manual page reload. Fixed centrally, so every action that logs to Activity now refreshes that page automatically.

**Files changed (pushed to GitHub):**
- `src/lib/audit.ts`

*(Also changed the local dev server to run on port 80 instead of 3000, just for convenience — no effect on the live site.)*

---

## 12. Removed payment icons and the returns policy link from the footer

Removed the iyzico/Visa/Mastercard payment icons and the "Cancellation & Return Policy" link from the footer's Legal section. The `/returns` page itself still exists, it's just no longer linked from the footer.

**Files changed (pushed to GitHub):**
- `src/components/layout/Footer.tsx`

---

## 13. Filled in real content for the Privacy Policy and Terms pages

The Privacy Policy and Terms (Distance Selling Agreement) pages used to just show a placeholder ("content coming soon"). They now show the real legal text — Turkish KVKK-compliant privacy terms and a proper Distance Selling Agreement, always shown in Turkish regardless of which site language a visitor has selected (since that's the legally relevant one). Looked at adding a mandatory "I agree to the Terms" checkbox to the subscribe form as an extra safeguard, but decided to keep it simple for now — the Terms and Privacy Policy links stay in the footer, same as before.

**Files changed (pushed to GitHub):**
- `src/app/[locale]/(public)/privacy/page.tsx`
- `src/app/[locale]/(public)/terms/page.tsx`

---

## 14. Legal text updated to match the real payment method + real contact info added

Since payment isn't handled through iyzico/card processing anymore (it's arranged directly over WhatsApp), removed the now-inaccurate mentions of an automatic card payment gateway from both legal pages. Also filled in Siba's real phone number and city in the Terms page's seller details (email is still a placeholder, pending).

**Files changed (pushed to GitHub):**
- `messages/tr.json`

---

## 15. Added "Developed by Goldena" credit to the footer

**Files changed (pushed to GitHub):**
- `src/components/layout/Footer.tsx`

---

## Local-only files (changed, but never pushed to GitHub)

- **`.env.local`** — holds the real Supabase project keys and email login used to run the site on this machine. It's intentionally excluded by `.gitignore` (the `.env*.local` rule), so it never goes to GitHub. Each person/machine running this project needs to create their own copy with their own real values.
