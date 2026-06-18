-- Atomic function to set a single tier as "most popular"
create or replace function set_popular_tier(p_tier_id uuid)
returns void as $$
begin
  update subscription_tiers set is_popular = (id = p_tier_id);
end;
$$ language plpgsql security definer;
