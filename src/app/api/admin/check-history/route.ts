import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin';
import { createServiceClient } from '@/lib/supabase/server';
import { normalizeEmail, normalizePhone } from '@/lib/validation';

type HistoryEntry = {
  type: string;
  tier: string | null;
  created_at: string;
};

type SubRow = {
  id: string;
  created_at: string;
  subscription_tiers: { name: { en: string } } | null;
};

type ContactRow = {
  id: string;
  created_at: string;
};

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

  if (emailNorm) {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('id, created_at, subscription_tiers(name)')
      .eq('email_normalized', emailNorm)
      .order('created_at', { ascending: false });

    (subs as unknown as SubRow[])?.forEach((s) => {
      results.push({
        type: 'subscription',
        tier: s.subscription_tiers?.name?.en || null,
        created_at: s.created_at,
      });
    });

    const { data: contacts } = await supabase
      .from('contact_messages')
      .select('id, created_at')
      .eq('email_normalized', emailNorm)
      .order('created_at', { ascending: false });

    (contacts as unknown as ContactRow[])?.forEach((c) => {
      results.push({
        type: 'contact',
        tier: null,
        created_at: c.created_at,
      });
    });
  }

  if (phoneNorm) {
    const { data: phoneSubs } = await supabase
      .from('subscriptions')
      .select('id, created_at, subscription_tiers(name)')
      .eq('phone_normalized', phoneNorm)
      .order('created_at', { ascending: false });

    (phoneSubs as unknown as SubRow[])?.forEach((s) => {
      if (!results.find((r) => r.type === 'subscription' && r.created_at === s.created_at)) {
        results.push({
          type: 'subscription',
          tier: s.subscription_tiers?.name?.en || null,
          created_at: s.created_at,
        });
      }
    });
  }

  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ results });
}
