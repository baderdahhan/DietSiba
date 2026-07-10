'use client';

import { useState } from 'react';
import { updatePaymentStatus } from '@/app/actions/admin';
import { resendSubscriptionEmail } from '@/app/actions/resend-email';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatDateTime } from '@/lib/format-date';
import { whatsappLinkForPhone } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

type Subscription = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  price_charged: number;
  payment_status: string;
  locale: string;
  created_at: string;
  email_sent: boolean;
  subscription_tiers: { name: { en: string; ar: string }; slug: string } | null;
  discount_codes: { code: string } | null;
};

export function SubscriptionsTable({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = subscriptions
    .filter((s) => filter === 'all' || s.payment_status === filter)
    .filter((s) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      );
    });

  const selected = subscriptions.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'paid', 'failed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize shrink-0 ${
                filter === f
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="sm:ml-auto sm:w-72 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-3">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            onClick={() => setSelectedId(sub.id)}
            className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm">{sub.name}</span>
                {!sub.email_sent && (
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                )}
              </div>
              <StatusBadge status={sub.payment_status} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{sub.subscription_tiers?.name?.en || '—'} &middot; {sub.price_charged} TRY</span>
              <span>{formatDate(sub.created_at)}</span>
            </div>
            {sub.discount_codes && (
              <div className="mt-1.5">
                <span className="inline-flex px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-mono rounded">
                  {sub.discount_codes.code}
                </span>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
            No subscriptions found.
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Tier</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {sub.name}
                      {!sub.email_sent && (
                        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" title="Email not sent" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      {sub.phone}
                      <a
                        href={whatsappLinkForPhone(sub.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Message on WhatsApp"
                        className="hover:opacity-80"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                      </a>
                    </span>
                  </td>
                  <td className="px-4 py-3">{sub.subscription_tiers?.name?.en || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {sub.price_charged} TRY
                      {sub.discount_codes && (
                        <span className="inline-flex px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-mono rounded" title={`Code: ${sub.discount_codes.code}`}>
                          {sub.discount_codes.code}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={sub.payment_status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {formatDate(sub.created_at)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <SubscriptionDetail
          subscription={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        colors[status] || 'bg-gray-100'
      }`}
    >
      {status}
    </span>
  );
}

function SubscriptionDetail({
  subscription,
  onClose,
}: {
  subscription: Subscription;
  onClose: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [checkingHistory, setCheckingHistory] = useState(false);
  const [history, setHistory] = useState<Array<{ type: string; tier: string | null; created_at: string }> | null>(null);

  async function handleStatusChange(status: string) {
    setUpdating(true);
    try {
      await updatePaymentStatus(subscription.id, status);
      window.location.reload();
    } catch {
      setUpdating(false);
    }
  }

  async function handleResendEmail() {
    setResending(true);
    try {
      await resendSubscriptionEmail(subscription.id);
      setResendSuccess(true);
    } catch {
      alert('Failed to send email');
    }
    setResending(false);
  }

  async function handleCheckHistory() {
    setCheckingHistory(true);
    try {
      const res = await fetch(
        `/api/admin/check-history?email=${encodeURIComponent(subscription.email)}&phone=${encodeURIComponent(subscription.phone)}`
      );
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setHistory(data.results || []);
    } catch {
      setHistory([]);
    }
    setCheckingHistory(false);
  }

  return (
    <Modal onClose={onClose} title="Subscription Detail">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{subscription.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {subscription.subscription_tiers?.name?.en || '—'} &middot; {formatDate(subscription.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-gray-700 break-all">{subscription.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-gray-700 flex items-center gap-2">
                {subscription.phone}
                <a
                  href={whatsappLinkForPhone(subscription.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium underline"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price</p>
              <p className="text-gray-700 font-medium">{subscription.price_charged} TRY</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={subscription.payment_status} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Language</p>
              <p className="text-gray-700 uppercase">{subscription.locale}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
              <p className="text-gray-700">{formatDateTime(subscription.created_at)}</p>
            </div>
          </div>

          {subscription.discount_codes && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Discount Code</p>
              <span className="inline-flex px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-mono rounded">
                {subscription.discount_codes.code}
              </span>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Status</p>
            <div className="flex items-center gap-2">
              {subscription.email_sent || resendSuccess ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sent
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-xs text-red-500">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Not sent
                  </span>
                  <button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </>
              )}
            </div>
          </div>

          {subscription.message && (
            <div className="mt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message</p>
              <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                {subscription.message}
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Payment Status</p>
            <div className="flex gap-2 flex-wrap">
              {['paid', 'pending', 'failed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || subscription.payment_status === status}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors disabled:opacity-30 ${
                    status === 'paid'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : status === 'failed'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : status === 'cancelled'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={handleCheckHistory}
              disabled={checkingHistory}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {checkingHistory ? 'Checking...' : 'Check submission history'}
            </button>
            {history && (
              <div className="mt-3 space-y-1.5">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-400">No prior submissions found.</p>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                      <span>
                        <span className="font-medium capitalize">{h.type}</span>
                        {h.tier && <span className="text-gray-400"> &middot; {h.tier}</span>}
                      </span>
                      <span className="text-gray-400">{formatDate(h.created_at)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
    </Modal>
  );
}
