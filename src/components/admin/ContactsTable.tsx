'use client';

import { useState } from 'react';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  created_at: string;
};

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = contacts.find((c) => c.id === selectedId);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Lang</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedId(contact.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs italic">
                    {contact.message.split(/\s+/).slice(0, 3).join(' ')}...
                  </td>
                  <td className="px-4 py-3 text-gray-500 uppercase text-xs hidden sm:table-cell">{contact.locale}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap hidden md:table-cell">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No contact messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-gray-700 break-all">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-gray-700">{selected.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Language</p>
                  <p className="text-gray-700 uppercase">{selected.locale}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-gray-700">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed break-all">
                  {selected.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
