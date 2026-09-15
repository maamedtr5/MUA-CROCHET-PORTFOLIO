-- ============================================================
-- Storage buckets: makeup + crochet images
-- Place at: supabase/migrations/<timestamp>_storage_buckets.sql
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('makeup-images', 'makeup-images', true),
  ('crochet-images', 'crochet-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Storage RLS policies
-- Public can read (view) images in both buckets.
-- Only authenticated (admin) can upload/update/delete.
-- ============================================================

create policy "public read makeup images"
  on storage.objects for select
  using (bucket_id = 'makeup-images');

create policy "admin write makeup images"
  on storage.objects for insert
  with check (bucket_id = 'makeup-images' and auth.uid() is not null);

create policy "admin update makeup images"
  on storage.objects for update
  using (bucket_id = 'makeup-images' and auth.uid() is not null)
  with check (bucket_id = 'makeup-images' and auth.uid() is not null);

create policy "admin delete makeup images"
  on storage.objects for delete
  using (bucket_id = 'makeup-images' and auth.uid() is not null);

create policy "public read crochet images"
  on storage.objects for select
  using (bucket_id = 'crochet-images');

create policy "admin write crochet images"
  on storage.objects for insert
  with check (bucket_id = 'crochet-images' and auth.uid() is not null);

create policy "admin update crochet images"
  on storage.objects for update
  using (bucket_id = 'crochet-images' and auth.uid() is not null)
  with check (bucket_id = 'crochet-images' and auth.uid() is not null);

create policy "admin delete crochet images"
  on storage.objects for delete
  using (bucket_id = 'crochet-images' and auth.uid() is not null);