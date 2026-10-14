# Adorn — Portfolio site

MUA + Crochet portfolio, per the project SRS. React + Vite + TypeScript, Supabase (Postgres, Auth, Storage, one Edge Function), no standalone backend.

## 1. Set up Supabase

1. Create a project at supabase.com.
2. Apply every file in `supabase/migrations/` in filename order (`supabase db push`, or paste them into the SQL editor). The newest one, `20261012000000_fix_images_content_email.sql`, adds the `site-images` bucket, seeds the About/Homepage/Contact/Background rows and adds the `email_error` column. Buckets used: `makeup-images`, `crochet-images`, `site-images`.
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

The contact form doesn't write to the database directly — it calls the `send-contact-email` Edge Function, which writes the row with the service role key and emails her via Brevo.

```bash
supabase secrets set BREVO_API_KEY=your_brevo_api_key
supabase secrets set CONTACT_TO_EMAIL=artist@herinbox.com
supabase secrets set CONTACT_FROM_EMAIL=artist@herinbox.com   # must be a sender verified in Brevo
supabase functions deploy send-contact-email
```

In Brevo: create an account, go to **Senders, Domains & Dedicated IPs → Senders → Add a sender** and confirm the link Brevo emails her; then **SMTP & API → API Keys → Generate**. Messages arrive in the `CONTACT_TO_EMAIL` inbox with the visitor's address as Reply-To. If an email fails, the reason is shown under "Failed" on the admin Submissions page.

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
