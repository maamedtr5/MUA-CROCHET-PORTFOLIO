-- ============================================================
-- Fixes:
--  1. site-images bucket (About photo + site background) + policies
--  2. seed site_content rows so About / Homepage / Contact / Background
--     always exist (saves no longer depend on a row being there)
--  3. contact_submissions.email_error so a failed email shows WHY
-- Safe to run more than once.
-- ============================================================

-- 1. site-images bucket ---------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site images" on storage.objects;
drop policy if exists "admin write site images" on storage.objects;
drop policy if exists "admin update site images" on storage.objects;
drop policy if exists "admin delete site images" on storage.objects;

create policy "public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "admin write site images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.uid() is not null);

create policy "admin update site images"
  on storage.objects for update
  using (bucket_id = 'site-images' and auth.uid() is not null)
  with check (bucket_id = 'site-images' and auth.uid() is not null);

create policy "admin delete site images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.uid() is not null);

-- 2. seed site_content ----------------------------------------
insert into site_content (section, heading, body) values
  ('homepage_intro', null, null),
  ('about', null, null),
  ('contact_info', null, null),
  ('background', null, null)
on conflict (section) do nothing;

-- 3. email failure reason -------------------------------------
alter table contact_submissions
  add column if not exists email_error text;
