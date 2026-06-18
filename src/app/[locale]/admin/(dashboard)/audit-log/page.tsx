import { createServiceClient } from '@/lib/supabase/server';

type AuditEntry = {
  id: number;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

async function getAuditLog(): Promise<AuditEntry[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('audit_log')
    .select('id, admin_email, action, target_type, target_id, details, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return [];
  return (data || []) as AuditEntry[];
}

const ACTION_LABELS: Record<string, string> = {
  update_payment_status: 'Updated payment status',
  create_discount: 'Created discount code',
  activate_discount: 'Activated discount code',
  deactivate_discount: 'Deactivated discount code',
  delete_discount: 'Deleted discount code',
  update_tier: 'Updated pricing tier',
  create_tier: 'Created pricing tier',
  delete_tier: 'Deleted pricing tier',
  deactivate_tier: 'Deactivated pricing tier',
  set_popular: 'Set tier as most popular',
};

const TARGET_LABELS: Record<string, string> = {
  subscription: 'Subscription',
  subscription_tier: 'Pricing Tier',
  discount_code: 'Discount Code',
};

function formatAction(action: string): string {
  return ACTION_LABELS[action] || action.replace(/_/g, ' ');
}

function formatTarget(type: string): string {
  return TARGET_LABELS[type] || type.replace(/_/g, ' ');
}

function formatDetails(details: Record<string, unknown> | null): string {
  if (!details) return '';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined) {
      parts.push(`${key}: ${value}`);
    }
  }
  return parts.join(' · ');
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default async function AuditLogPage() {
  const entries = await getAuditLog();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <p className="text-xs text-gray-400">Last 100 actions</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          No activity recorded yet. Actions will appear here as you manage the site.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {entries.map((entry) => (
            <div key={entry.id} className="px-5 py-4 flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <ActionIcon action={entry.action} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{formatAction(entry.action)}</span>
                  <span className="text-gray-400 mx-1.5">&middot;</span>
                  <span className="text-gray-500">{formatTarget(entry.target_type)}</span>
                </p>
                {entry.details && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {formatDetails(entry.details)}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {entry.admin_email}
                </p>
              </div>
              <div className="shrink-0 text-xs text-gray-400 whitespace-nowrap">
                {timeAgo(entry.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const isCreate = action.startsWith('create');
  const isDelete = action.startsWith('delete') || action.startsWith('deactivate');
  const isUpdate = action.startsWith('update') || action.startsWith('set');

  const color = isDelete
    ? 'bg-red-100 text-red-600'
    : isCreate
    ? 'bg-green-100 text-green-600'
    : isUpdate
    ? 'bg-blue-100 text-blue-600'
    : 'bg-gray-100 text-gray-600';

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
      {isDelete ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ) : isCreate ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )}
    </div>
  );
}
