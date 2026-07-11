-- Fix: the database rejects UPDATE statements without an explicit WHERE
-- clause, even ones intended to touch every row. Add "where true" to
-- keep the original behavior (exactly one tier ends up popular).
create or replace function set_popular_tier(p_tier_id uuid)
returns void as $$
begin
  update subscription_tiers set is_popular = (id = p_tier_id) where true;
end;
$$ language plpgsql;
