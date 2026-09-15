-- ============================================================
-- Initial schema: makeup + crochet portfolio
-- Place at: supabase/migrations/<timestamp>_initial_schema.sql
-- ============================================================

-- ---------- extensions ----------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------- makeup_works ----------
create table makeup_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text,
  images text[] not null default '{}',
  description text,
  tags text[] not null default '{}',
  date date,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index makeup_works_tags_idx on makeup_works using gin (tags);
create index makeup_works_status_idx on makeup_works (status);

-- ---------- crochet_works ----------
create table crochet_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  images text[] not null default '{}',
  description text,
  materials text,
  size text,
  availability text check (availability in ('made_to_order', 'one_of_one', 'sold')),
  price_note text,
  tags text[] not null default '{}',
  date date,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crochet_works_tags_idx on crochet_works using gin (tags);
create index crochet_works_status_idx on crochet_works (status);

-- ---------- site_content ----------
create table site_content (
  section text primary key, -- 'about' | 'homepage_intro' | 'contact_info'
  heading text,
  body text,
  image text,
  updated_at timestamptz not null default now()
);

-- ---------- social_links ----------
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  display_order int not null default 0
);

-- ---------- contact_form_config ----------
create table contact_form_config (
  id int primary key default 1 check (id = 1), -- single row
  fields jsonb not null default '[]' -- [{key,label,type,required}, ...]
);

-- ---------- contact_submissions ----------
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  extra_fields jsonb not null default '{}',
  created_at timestamptz not null default now(),
  emailed_ok boolean not null default false
);

-- ============================================================
-- updated_at auto-touch triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger makeup_works_updated_at
  before update on makeup_works
  for each row execute function set_updated_at();

create trigger crochet_works_updated_at
  before update on crochet_works
  for each row execute function set_updated_at();

create trigger site_content_updated_at
  before update on site_content
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table makeup_works enable row level security;
alter table crochet_works enable row level security;
alter table site_content enable row level security;
alter table social_links enable row level security;
alter table contact_form_config enable row level security;
alter table contact_submissions enable row level security;

-- --- makeup_works ---
create policy "public read published makeup works"
  on makeup_works for select
  using (status = 'published');

create policy "admin full access makeup works"
  on makeup_works for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- --- crochet_works ---
create policy "public read published crochet works"
  on crochet_works for select
  using (status = 'published');

create policy "admin full access crochet works"
  on crochet_works for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- --- site_content ---
create policy "public read site content"
  on site_content for select
  using (true);

create policy "admin write site content"
  on site_content for insert
  with check (auth.uid() is not null);

create policy "admin update site content"
  on site_content for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- --- social_links ---
create policy "public read social links"
  on social_links for select
  using (true);

create policy "admin write social links"
  on social_links for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- --- contact_form_config ---
create policy "public read contact form config"
  on contact_form_config for select
  using (true);

create policy "admin write contact form config"
  on contact_form_config for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- --- contact_submissions ---
-- public can insert (via Edge Function using anon key), cannot read
create policy "public insert contact submissions"
  on contact_submissions for insert
  with check (true);

create policy "admin read contact submissions"
  on contact_submissions for select
  using (auth.uid() is not null);

-- ============================================================
-- seed defaults (optional, safe to run once)
-- ============================================================
insert into contact_form_config (id, fields) values (
  1,
  '[
    {"key": "name", "label": "Name", "type": "text", "required": true},
    {"key": "email", "label": "Email", "type": "email", "required": true},
    {"key": "message", "label": "Message", "type": "textarea", "required": true}
  ]'::jsonb
) on conflict (id) do nothing;
