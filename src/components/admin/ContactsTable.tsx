'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { resendContactEmail } from '@/app/actions/resend-email';
import { replyToContact } from '@/app/actions/admin';
import { formatDate, formatDateTime } from '@/lib/format-date';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  created_at: string;
  email_sent: boolean;
  admin_reply: string | null;
  replied_at: string | null;
};

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  const selected = contacts.find((c) => c.id === selectedId);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="sm:w-72 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-3">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedId(contact.id)}
            className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm">{contact.name}</span>
                {!contact.email_sent && (
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                )}
                {contact.replied_at && (
                  <span className="text-[10px] font-medium text-green-700 bg-green-100 rounded-full px-1.5 py-0.5">Replied</span>
                )}
              </div>
              <span className="text-xs text-gray-400">{formatDate(contact.created_at)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{contact.email}</p>
            <p className="text-xs text-gray-400 italic">
              {(() => { const words = contact.message.split(/\s+/); return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : words.join(' '); })()}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
            {contacts.length === 0 ? 'No contact messages yet.' : 'No messages match your search.'}
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase">Message</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedId(contact.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {contact.name}
                      {!contact.email_sent && (
                        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" title="Email not sent" />
                      )}
                      {contact.replied_at && (
                        <span className="text-[10px] font-medium text-green-700 bg-green-100 rounded-full px-1.5 py-0.5">Replied</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs italic">
                    {(() => { const words = contact.message.split(/\s+/); return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : words.join(' '); })()}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap hidden lg:table-cell">
                    {formatDate(contact.created_at)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    {contacts.length === 0 ? 'No contact messages yet.' : 'No messages match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ContactDetail
          contact={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function ContactDetail({
  contact,
  onClose,
}: {
  contact: Contact;
  onClose: () => void;
}) {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [lastReply, setLastReply] = useState<{ message: string; repliedAt: string } | null>(
    contact.admin_reply && contact.replied_at
      ? { message: contact.admin_reply, repliedAt: contact.replied_at }
      : null
  );

  async function handleResendEmail() {
    setResending(true);
    try {
      await resendContactEmail(contact.id);
      setResendSuccess(true);
    } catch {
      alert('Failed to send email');
    }
    setResending(false);
  }

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    try {
      await replyToContact(contact.id, replyText.trim());
      setLastReply({ message: replyText.trim(), repliedAt: new Date().toISOString() });
      setReplyText('');
    } catch {
      setReplyError('Failed to send reply. Please try again.');
    }
    setSendingReply(false);
  }

  return (
    <Modal onClose={onClose} title="Contact Detail">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{contact.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDateTime(contact.created_at)}
          </p>
        </div>
        <button
          onClick={onClose}
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
            <p className="text-gray-700 break-all">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-gray-700">{contact.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Language</p>
            <p className="text-gray-700 uppercase">{contact.locale}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
            <p className="text-gray-700">{formatDateTime(contact.created_at)}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Status</p>
          <div className="flex items-center gap-2">
            {contact.email_sent || resendSuccess ? (
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

        <div className="mt-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed break-all">
            {contact.message}
          </div>
        </div>

        {lastReply && (
          <div className="mt-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Your Reply &middot; {formatDateTime(lastReply.repliedAt)}
            </p>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {lastReply.message}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            {lastReply ? 'Send Another Reply' : 'Reply'}
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
            placeholder={`Write a reply to ${contact.name}...`}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              Sent to {contact.email}, from Siba Osman&apos;s email.
            </span>
            <button
              onClick={handleSendReply}
              disabled={sendingReply || !replyText.trim()}
              className="text-sm bg-green text-white px-4 py-1.5 rounded-lg font-medium disabled:opacity-50 hover:bg-green-dark transition-colors"
            >
              {sendingReply ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
          {replyError && <p className="text-xs text-red-500 mt-2">{replyError}</p>}
        </div>
      </div>
    </Modal>
  );
}
