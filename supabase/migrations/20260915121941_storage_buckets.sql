insert into storage.buckets (id, name, public)
values
  ('makeup-images', 'makeup-images', true),
  ('crochet-images', 'crochet-images', true)
on conflict (id) do nothing;