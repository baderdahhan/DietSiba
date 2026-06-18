import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin';
import { createServiceClient } from '@/lib/supabase/server';
import { normalizeEmail, normalizePhone } from '@/lib/validation';

type HistoryEntry = {
  type: string;
  tier: string | null;
  created_at: string;
};

type SubRow = { id: string; created_at: string; subscription_tiers: { name: { en: string } } | null };
type ContactRow = { id: string; created_at: string };

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get('email') || '';
  const phone = request.nextUrl.searchParams.get('phone') || '';

  if (!email && !phone) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createServiceClient();
  const emailNorm = normalizeEmail(email);
  const phoneNorm = normalizePhone(phone);

  const results: HistoryEntry[] = [];
  const seen = new Set<string>();

  const subQuery = supabase
    .from('subscriptions')
    .select('id, created_at, subscription_tiers(name)')
    .order('created_at', { ascending: false });

  const contactQuery = supabase
    .from('contact_messages')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  if (emailNorm && phoneNorm) {
    subQuery.or('email_normalized.eq."' + emailNorm.replace(/"/g, '') + '",phone_normalized.eq."' + phoneNorm.replace(/"/g, '') + '"');
    contactQuery.or('email_normalized.eq."' + emailNorm.replace(/"/g, '') + '",phone_normalized.eq."' + phoneNorm.replace(/"/g, '') + '"');
  } else if (emailNorm) {
    subQuery.eq('email_normalized', emailNorm);
    contactQuery.eq('email_normalized', emailNorm);
  } else {
    subQuery.eq('phone_normalized', phoneNorm);
    contactQuery.eq('phone_normalized', phoneNorm);
  }

  const [subsResult, contactsResult] = await Promise.all([subQuery, contactQuery]);

  if (subsResult.data) {
    for (const s of subsResult.data as unknown as SubRow[]) {
      const key = `sub-${s.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          type: 'subscription',
          tier: s.subscription_tiers?.name?.en || null,
          created_at: s.created_at,
        });
      }
    }
  }

  if (contactsResult.data) {
    for (const c of contactsResult.data as unknown as ContactRow[]) {
      const key = `contact-${c.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ type: 'contact', tier: null, created_at: c.created_at });
      }
    }
  }

  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ results });
}
