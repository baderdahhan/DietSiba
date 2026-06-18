create table audit_log (
  id bigserial primary key,
  admin_email text not null,
  action text not null,
  target_type text not null,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
create index on audit_log (created_at);
create index on audit_log (target_type, target_id);

alter table audit_log enable row level security;

create policy "Admin can read audit_log" on audit_log
  for select to authenticated using (true);
