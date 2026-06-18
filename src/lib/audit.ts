import { createServiceClient } from './supabase/server';

export async function logAudit(
  adminEmail: string,
  action: string,
  targetType: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = createServiceClient();
    await supabase.from('audit_log').insert({
      admin_email: adminEmail,
      action,
      target_type: targetType,
      target_id: targetId || null,
      details: details || null,
    });
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}
