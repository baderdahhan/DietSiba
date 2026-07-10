-- Store the admin's reply text + when it was sent, so the admin panel
-- can show reply history and whether a message has already been answered.
alter table contact_messages add column admin_reply text;
alter table contact_messages add column replied_at timestamptz;
