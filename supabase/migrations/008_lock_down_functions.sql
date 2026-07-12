-- Security fix: Supabase grants EXECUTE on public functions to anon and
-- authenticated by default. create_subscription is SECURITY DEFINER, so
-- anyone holding the public anon key could call it directly through
-- PostgREST — inserting subscriptions and burning discount-code uses while
-- bypassing the app's CSRF, rate-limit, and spam checks.
--
-- These functions are only ever called server-side with the service role
-- key, so revoke everything else and grant service_role explicitly.

revoke execute on function create_subscription(text, text, text, text, uuid, text, text, text, text) from public, anon, authenticated;
revoke execute on function cleanup_request_throttle() from public, anon, authenticated;
revoke execute on function set_popular_tier(uuid) from public, anon, authenticated;

grant execute on function create_subscription(text, text, text, text, uuid, text, text, text, text) to service_role;
grant execute on function cleanup_request_throttle() to service_role;
grant execute on function set_popular_tier(uuid) to service_role;

-- Make sure future functions in this schema don't get the default
-- PUBLIC execute grant either.
alter default privileges in schema public revoke execute on functions from public;
