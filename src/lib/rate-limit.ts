import { createServiceClient } from './supabase/server';
import { createHash } from 'crypto';

const MAX_REQUESTS = 5;
const WINDOW_MINUTES = 10;

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

export async function checkRateLimit(
  ipHash: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createServiceClient();
  const windowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { count, error } = await supabase
    .from('request_throttle')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart);

  if (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: MAX_REQUESTS };
  }

  const used = count ?? 0;
  return {
    allowed: used < MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - used),
  };
}

export async function recordRequest(
  ipHash: string,
  endpoint: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from('request_throttle').insert({
    ip_hash: ipHash,
    endpoint,
  });
}
