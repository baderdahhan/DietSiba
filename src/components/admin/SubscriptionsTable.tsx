'use client';

import { useState } from 'react';
import { updatePaymentStatus } from '@/app/actions/admin';

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
  subscription_tiers: { name: { en: string; ar: string }; slug: string } | null;
};

export function SubscriptionsTable({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all'
      ? subscriptions
      : subscriptions.filter((s) => s.payment_status === filter);

  const selected = subscriptions.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'paid', 'failed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">{sub.name}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.phone}</td>
                  <td className="px-4 py-3">
                    {sub.subscription_tiers?.name?.en || '—'}
                  </td>
                  <td className="px-4 py-3">{sub.price_charged} TRY</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(sub.created_at).toLocaleDateString()}
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
  const [checkingHistory, setCheckingHistory] = useState(false);
  const [history, setHistory] = useState<Array<{ type: string; tier: string | null; created_at: string }> | null>(null);

  async function handleStatusChange(status: string) {
    setUpdating(true);
    await updatePaymentStatus(subscription.id, status);
    setUpdating(false);
    window.location.reload();
  }

  async function handleCheckHistory() {
    setCheckingHistory(true);
    const res = await fetch(
      `/api/admin/check-history?email=${encodeURIComponent(subscription.email)}&phone=${encodeURIComponent(subscription.phone)}`
    );
    const data = await res.json();
    setHistory(data.results || []);
    setCheckingHistory(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30">
      <div className="bg-white h-full w-full max-w-md shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Subscription Detail</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <dl className="space-y-3 text-sm">
            <div><dt className="text-gray-500">Name</dt><dd className="font-medium">{subscription.name}</dd></div>
            <div><dt className="text-gray-500">Email</dt><dd>{subscription.email}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd>{subscription.phone}</dd></div>
            <div><dt className="text-gray-500">Tier</dt><dd>{subscription.subscription_tiers?.name?.en}</dd></div>
            <div><dt className="text-gray-500">Price</dt><dd>{subscription.price_charged} TRY</dd></div>
            <div><dt className="text-gray-500">Status</dt><dd><StatusBadge status={subscription.payment_status} /></dd></div>
            {subscription.message && (
              <div><dt className="text-gray-500">Message</dt><dd className="text-gray-700">{subscription.message}</dd></div>
            )}
            <div><dt className="text-gray-500">Language</dt><dd className="uppercase">{subscription.locale}</dd></div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd>{new Date(subscription.created_at).toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Update Payment Status</p>
            <div className="flex gap-2 flex-wrap">
              {['paid', 'failed', 'cancelled', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || subscription.payment_status === status}
                  className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors disabled:opacity-40 ${
                    status === 'paid'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleCheckHistory}
              disabled={checkingHistory}
              className="text-xs text-blue-600 hover:underline disabled:opacity-50"
            >
              {checkingHistory ? 'Checking...' : 'Check History'}
            </button>
            {history && (
              <div className="mt-3 space-y-2">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-400">No prior submissions found.</p>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="text-xs bg-gray-50 rounded p-2">
                      <span className="font-medium">{h.type}</span> —{' '}
                      {h.tier || 'contact'} — {new Date(h.created_at).toLocaleDateString()}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
