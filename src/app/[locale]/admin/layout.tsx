import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Siba Osman',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {children}
    </div>
  );
}
