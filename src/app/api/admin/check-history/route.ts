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

  const email = (request.nextUrl.searchParams.get('email') || '').slice(0, 254);
  const phone = (request.nextUrl.searchParams.get('phone') || '').slice(0, 20);

  if (!email && !phone) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createServiceClient();
  const emailNorm = normalizeEmail(email);
  const phoneNorm = normalizePhone(phone);

  const results: HistoryEntry[] = [];
  const seen = new Set<string>();

  const subBase = supabase
    .from('subscriptions')
    .select('id, created_at, subscription_tiers(name)')
    .order('created_at', { ascending: false });

  const contactBase = supabase
    .from('contact_messages')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  let subsResult;
  let contactsResult;

  if (emailNorm && phoneNorm) {
    const [subsByEmail, subsByPhone, contactsByEmail, contactsByPhone] = await Promise.all([
      supabase.from('subscriptions').select('id, created_at, subscription_tiers(name)').eq('email_normalized', emailNorm).order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('id, created_at, subscription_tiers(name)').eq('phone_normalized', phoneNorm).order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('id, created_at').eq('email_normalized', emailNorm).order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('id, created_at').eq('phone_normalized', phoneNorm).order('created_at', { ascending: false }),
    ]);
    subsResult = { data: [...(subsByEmail.data || []), ...(subsByPhone.data || [])] };
    contactsResult = { data: [...(contactsByEmail.data || []), ...(contactsByPhone.data || [])] };
  } else if (emailNorm) {
    [subsResult, contactsResult] = await Promise.all([
      subBase.eq('email_normalized', emailNorm),
      contactBase.eq('email_normalized', emailNorm),
    ]);
  } else {
    [subsResult, contactsResult] = await Promise.all([
      subBase.eq('phone_normalized', phoneNorm),
      contactBase.eq('phone_normalized', phoneNorm),
    ]);
  }

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
