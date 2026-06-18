-- Subscription tiers (admin-editable pricing/content)
create table subscription_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name jsonb not null,
  price numeric(10,2) not null,
  currency text not null default 'TRY',
  features jsonb not null default '[]',
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- Discount codes
create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  value numeric(10,2) not null,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Subscriptions (leads who chose a plan)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text,
  tier_id uuid references subscription_tiers(id),
  price_charged numeric(10,2) not null,
  discount_code_id uuid references discount_codes(id),
  locale text not null default 'en',
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','cancelled')),
  payment_provider text,
  payment_reference text,
  email_normalized text not null,
  phone_normalized text not null,
  created_at timestamptz not null default now()
);
create index on subscriptions (email_normalized);
create index on subscriptions (phone_normalized);

-- Contact messages
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  locale text not null default 'en',
  email_normalized text not null,
  phone_normalized text not null default '',
  created_at timestamptz not null default now()
);
create index on contact_messages (email_normalized);
create index on contact_messages (phone_normalized);

-- Simple IP-based rate limiting
create table request_throttle (
  id bigserial primary key,
  ip_hash text not null,
  endpoint text not null,
  created_at timestamptz not null default now()
);
create index on request_throttle (ip_hash, endpoint, created_at);

-- Enable Row Level Security on every table
alter table subscription_tiers enable row level security;
alter table discount_codes enable row level security;
alter table subscriptions enable row level security;
alter table contact_messages enable row level security;
alter table request_throttle enable row level security;

-- No anon policies: all writes go through server actions using service role key.
-- Only the authenticated admin can read via admin dashboard server-side queries.

-- RLS policies for service role (bypasses RLS automatically) and authenticated admin
create policy "Admin can read subscription_tiers" on subscription_tiers
  for select to authenticated using (true);
create policy "Admin can manage subscription_tiers" on subscription_tiers
  for all to authenticated using (true) with check (true);

create policy "Admin can read discount_codes" on discount_codes
  for select to authenticated using (true);
create policy "Admin can manage discount_codes" on discount_codes
  for all to authenticated using (true) with check (true);

create policy "Admin can read subscriptions" on subscriptions
  for select to authenticated using (true);
create policy "Admin can manage subscriptions" on subscriptions
  for all to authenticated using (true) with check (true);

create policy "Admin can read contact_messages" on contact_messages
  for select to authenticated using (true);

create policy "Admin can read request_throttle" on request_throttle
  for select to authenticated using (true);

-- Atomic create_subscription function
-- Handles discount code validation + usage increment + subscription insert in one transaction
create or replace function create_subscription(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_tier_id uuid,
  p_discount_code text,
  p_locale text,
  p_email_normalized text,
  p_phone_normalized text
) returns uuid as $$
declare
  v_tier_price numeric(10,2);
  v_discount_id uuid;
  v_discount_type text;
  v_discount_value numeric(10,2);
  v_final_price numeric(10,2);
  v_sub_id uuid;
  v_discount_row discount_codes%rowtype;
begin
  -- Get the tier price
  select price into v_tier_price
  from subscription_tiers
  where id = p_tier_id and is_active = true;

  if v_tier_price is null then
    raise exception 'Invalid or inactive subscription tier';
  end if;

  v_final_price := v_tier_price;

  -- Handle discount code if provided
  if p_discount_code is not null and p_discount_code <> '' then
    select * into v_discount_row
    from discount_codes
    where code = upper(trim(p_discount_code))
      and is_active = true
    for update;

    if v_discount_row.id is null then
      raise exception 'Invalid discount code';
    end if;

    if v_discount_row.expires_at is not null and v_discount_row.expires_at < now() then
      raise exception 'Expired discount code';
    end if;

    if v_discount_row.max_uses is not null and v_discount_row.used_count >= v_discount_row.max_uses then
      raise exception 'Discount code usage limit reached';
    end if;

    v_discount_id := v_discount_row.id;
    v_discount_type := v_discount_row.discount_type;
    v_discount_value := v_discount_row.value;

    -- Calculate discounted price
    if v_discount_type = 'percentage' then
      v_final_price := greatest(0, v_tier_price * (1 - v_discount_value / 100));
    else
      v_final_price := greatest(0, v_tier_price - v_discount_value);
    end if;

    -- Increment usage count
    update discount_codes
    set used_count = used_count + 1
    where id = v_discount_id;
  end if;

  -- Insert the subscription
  insert into subscriptions (
    name, email, phone, message, tier_id,
    price_charged, discount_code_id, locale,
    email_normalized, phone_normalized
  ) values (
    p_name, p_email, p_phone, p_message, p_tier_id,
    v_final_price, v_discount_id, p_locale,
    p_email_normalized, p_phone_normalized
  ) returning id into v_sub_id;

  return v_sub_id;
end;
$$ language plpgsql security definer;

-- Seed subscription tiers
insert into subscription_tiers (slug, name, price, currency, features, sort_order) values
  ('silver', '{"en": "Silver", "ar": "الفضية"}', 500, 'TRY',
   '[{"en": "Personalized meal plan", "ar": "خطة وجبات مخصصة"}, {"en": "Weekly check-in", "ar": "متابعة أسبوعية"}, {"en": "Email support", "ar": "دعم عبر البريد الإلكتروني"}, {"en": "Basic nutrition guide", "ar": "دليل تغذية أساسي"}]',
   0),
  ('gold', '{"en": "Gold", "ar": "الذهبية"}', 800, 'TRY',
   '[{"en": "Personalized meal plan", "ar": "خطة وجبات مخصصة"}, {"en": "Bi-weekly check-ins", "ar": "متابعة نصف أسبوعية"}, {"en": "WhatsApp support", "ar": "دعم عبر واتساب"}, {"en": "Detailed nutrition guide", "ar": "دليل تغذية مفصل"}, {"en": "Recipe suggestions", "ar": "اقتراحات وصفات"}, {"en": "Progress tracking", "ar": "تتبع التقدم"}]',
   1),
  ('diamond', '{"en": "Diamond", "ar": "الماسية"}', 1200, 'TRY',
   '[{"en": "Fully customized meal plan", "ar": "خطة وجبات مخصصة بالكامل"}, {"en": "Daily check-ins", "ar": "متابعة يومية"}, {"en": "24/7 WhatsApp support", "ar": "دعم واتساب على مدار الساعة"}, {"en": "Complete nutrition guide", "ar": "دليل تغذية شامل"}, {"en": "Custom recipes", "ar": "وصفات مخصصة"}, {"en": "Supplement guidance", "ar": "إرشادات المكملات"}, {"en": "Monthly video consultation", "ar": "استشارة فيديو شهرية"}, {"en": "Priority support", "ar": "دعم ذو أولوية"}]',
   2);
