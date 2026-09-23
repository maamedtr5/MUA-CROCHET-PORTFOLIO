# Adorn — Portfolio site

MUA + Crochet portfolio, per the project SRS. React + Vite + TypeScript, Supabase (Postgres, Auth, Storage, one Edge Function), no standalone backend.

## 1. Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run the three migrations **in order** from `supabase/migrations/`:
   - `0001_initial_schema.sql` — tables, triggers, seed rows
   - `0002_rls_policies.sql` — row-level security
   - `0003_storage_buckets.sql` — `work-images` and `site-images` buckets
3. In **Authentication → Users**, manually create the single admin account (email + password) — there is no public sign-up flow anywhere in this app.
4. In **Project Settings → API**, copy the Project URL and `anon` public key.

## 2. Local setup

```bash
npm install
cp .env.example .env   # paste in your Supabase URL + anon key
npm run dev
```

The public site runs at `/`. The admin dashboard is at `/admin` — log in with the account you created in step 3 above. It is not linked anywhere in the public nav (see project notes on why).

## 3. Contact form email (Edge Function)

The contact form doesn't write to the database directly — it calls the `send-contact-email` Edge Function, which writes the row with the service role key and emails you via Resend.

```bash
supabase functions deploy send-contact-email
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set ADMIN_NOTIFY_EMAIL=you@youremail.com
```

Update the `from` address in `supabase/functions/send-contact-email/index.ts` once you've verified a sending domain in Resend — `onboarding@resend.dev` only works for testing.

## 4. Deploy

Works as-is on Vercel or Netlify (SPA rewrite configs are already in `vercel.json` and `public/_redirects` — without these, refreshing on `/admin` or any non-root path would 404). Set the two `VITE_SUPABASE_*` env vars in your hosting provider's dashboard.

## Where things live

- `src/pages/` — public site (Home, About, Portfolio, WorkDetail, Contact)
- `src/admin/` — admin dashboard, gated by `AdminRoute.tsx`
- `src/lib/queries/` — every Supabase read/write, typed, one file per table group
- `src/lib/supabase.ts` — the one shared client
- `supabase/migrations/` — schema, RLS, storage — run once, in order, in a new project
- `supabase/functions/send-contact-email/` — the only server-side logic in the whole app

## Still ahead (per the build order)

Visual/UI design pass is applied — see the approved preview links in the project thread. Still to do: connect real photography (currently texture-block placeholders), QA pass on RLS + image upload edge cases, pick a hosting provider + domain.
