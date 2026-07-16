-- Add a free consultation tier, shown first (before Silver)
insert into subscription_tiers (slug, name, price, currency, features, sort_order) values
  ('consultation', '{"en": "Free Consultation", "ar": "استشارة مجانية"}', 0, 'TRY',
   '[{"en": "One-on-one consultation to understand your goals", "ar": "استشارة فردية لفهم أهدافك"}, {"en": "Assessment of your health & nutrition needs", "ar": "تقييم احتياجاتك الصحية والغذائية"}, {"en": "Personalized plan recommendation", "ar": "توصية بالخطة المناسبة إلك"}, {"en": "No commitment required", "ar": "بدون أي التزام"}]',
   -1);
