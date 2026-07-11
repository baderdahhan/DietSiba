import { createServiceClient } from './supabase/server';
import { revalidatePath } from 'next/cache';

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
    revalidatePath('/en/admin/audit-log');
    revalidatePath('/ar/admin/audit-log');
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}
