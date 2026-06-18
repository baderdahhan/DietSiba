-- Auto-cleanup old rate limit entries (older than 1 hour)
create or replace function cleanup_request_throttle()
returns void as $$
begin
  delete from request_throttle
  where created_at < now() - interval '1 hour';
end;
$$ language plpgsql security definer;

-- Add email status tracking to subscriptions and contacts
alter table subscriptions add column email_sent boolean not null default false;
alter table contact_messages add column email_sent boolean not null default false;
