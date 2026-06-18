'use client';

import { useState } from 'react';
import { updateTier } from '@/app/actions/admin';

type Tier = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  price: number;
  currency: string;
  features: Array<{ en: string; ar: string }>;
};

export function PricingEditor({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="space-y-6">
      {tiers.map((tier) => (
        <TierEditCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
}

function TierEditCard({ tier }: { tier: Tier }) {
  const [nameEn, setNameEn] = useState(tier.name.en);
  const [nameAr, setNameAr] = useState(tier.name.ar);
  const [price, setPrice] = useState(tier.price.toString());
  const [currency, setCurrency] = useState(tier.currency);
  const [features, setFeatures] = useState(tier.features);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addFeature() {
    setFeatures([...features, { en: '', ar: '' }]);
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index));
  }

  function updateFeature(index: number, lang: 'en' | 'ar', value: string) {
    const updated = [...features];
    updated[index] = { ...updated[index], [lang]: value };
    setFeatures(updated);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateTier(tier.id, {
        name: { en: nameEn, ar: nameAr },
        price: parseFloat(price),
        currency,
        features: features.filter((f) => f.en.trim() || f.ar.trim()),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg capitalize">{tier.slug}</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-green text-white text-sm rounded hover:bg-green-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (AR)</label>
          <input
            type="text"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Features</label>
          <button
            onClick={addFeature}
            className="text-xs text-blue-600 hover:underline"
          >
            + Add Feature
          </button>
        </div>
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={feature.en}
                onChange={(e) => updateFeature(i, 'en', e.target.value)}
                placeholder="English"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={feature.ar}
                onChange={(e) => updateFeature(i, 'ar', e.target.value)}
                placeholder="العربية"
                dir="rtl"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeFeature(i)}
                className="text-red-400 hover:text-red-600 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
