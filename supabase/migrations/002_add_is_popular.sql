alter table subscription_tiers add column is_popular boolean not null default false;

-- Set Gold as default popular
update subscription_tiers set is_popular = true where slug = 'gold';
