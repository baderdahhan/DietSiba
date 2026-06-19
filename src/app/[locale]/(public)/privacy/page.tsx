import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
};

export default function PrivacyPage() {
  return (
    <section className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green font-semibold tracking-wide mb-4">
            Gizlilik Politikası
          </h1>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-border">
          <p className="text-muted text-center">İçerik yakında eklenecektir.</p>
        </div>
      </div>
    </section>
  );
}
