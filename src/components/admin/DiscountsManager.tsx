'use client';

import { useState } from 'react';
import { createDiscountCode, toggleDiscountCode, deleteDiscountCode } from '@/app/actions/admin';
import { formatDate } from '@/lib/format-date';

type DiscountCode = {
  id: string;
  code: string;
  discount_type: string;
  value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

export function DiscountsManager({ codes }: { codes: DiscountCode[] }) {
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!code.trim() || !value) return;
    setCreating(true);
    try {
      await createDiscountCode({
        code,
        discountType,
        value: parseFloat(value),
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt || null,
      });
      setShowForm(false);
      setCode('');
      setValue('');
      setMaxUses('');
      setExpiresAt('');
      window.location.reload();
    } catch {
      alert('Failed to create code');
    }
    setCreating(false);
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleDiscountCode(id, !current);
    window.location.reload();
  }

  async function handleDelete(id: string, codeName: string) {
    if (!confirm(`Delete discount code "${codeName}"? This cannot be undone.`)) return;
    await deleteDiscountCode(id);
    window.location.reload();
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 w-full sm:w-auto px-4 py-2.5 bg-green text-white text-sm rounded-lg hover:bg-green-dark transition-colors"
      >
        {showForm ? 'Cancel' : '+ Create New Code'}
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME20"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={discountType === 'percentage' ? '20' : '100'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses (empty = unlimited)</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Expires At (optional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full sm:w-auto px-4 py-2.5 bg-green text-white text-sm rounded-lg hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      )}

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-3">
        {codes.map((c) => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-semibold text-sm">{c.code}</span>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
              <div>
                <span className="block text-gray-400">Discount</span>
                {c.discount_type === 'percentage' ? `${c.value}%` : `${c.value} TRY`}
              </div>
              <div>
                <span className="block text-gray-400">Uses</span>
                {c.used_count}{c.max_uses !== null ? ` / ${c.max_uses}` : ' / ∞'}
              </div>
              {c.expires_at && (
                <div>
                  <span className="block text-gray-400">Expires</span>
                  {formatDate(c.expires_at)}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleToggle(c.id, c.is_active)}
                className="text-xs text-blue-600 font-medium"
              >
                {c.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(c.id, c.code)}
                className="text-xs text-red-500 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {codes.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
            No discount codes yet.
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Value</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Uses</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Expires</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3 capitalize">{c.discount_type}</td>
                  <td className="px-4 py-3">
                    {c.discount_type === 'percentage' ? `${c.value}%` : `${c.value} TRY`}
                  </td>
                  <td className="px-4 py-3">
                    {c.used_count}{c.max_uses !== null ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {c.expires_at ? formatDate(c.expires_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(c.id, c.is_active)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {c.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No discount codes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
