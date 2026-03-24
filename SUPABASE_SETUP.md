# Supabase Blog Setup

This repo is a static React/Vite site. "Write + Publish" works by saving posts to Supabase (DB + Storage) and using Supabase Auth for admin login.

## 1) Create a Supabase project

- Create a new project in Supabase.
- In the dashboard, copy:
  - Project URL
  - `anon` public API key

## 2) Add env vars

Create a `.env.local` in the project root:

```
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY"

# Optional but recommended: only this email can publish from the UI
VITE_ADMIN_EMAIL="you@example.com"
```

Restart dev server after changing env vars.

## 3) Create DB tables

Run this SQL in Supabase (SQL Editor):

```sql
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_md text not null,
  tags text[] not null default '{}',
  date date,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  label text not null,
  path text not null,
  kind text,
  created_at timestamptz not null default now()
);

create unique index if not exists blog_attachments_post_id_path_uniq
on public.blog_attachments(post_id, path);

create index if not exists blog_attachments_post_id_idx on public.blog_attachments(post_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();
```

## 4) Create storage bucket

- Storage -> Create bucket: `blog`
- Recommended: make it **public** (so attachments have a public URL).

Files are uploaded as: `blog/<slug>/<filename>`.

## 5) Enable Row Level Security + policies

Enable RLS on both tables.

Then create policies.

Public read (only published):

```sql
alter table public.blog_posts enable row level security;
alter table public.blog_attachments enable row level security;

drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts"
on public.blog_posts for select
using (published = true);

drop policy if exists "public read attachments for published posts" on public.blog_attachments;
create policy "public read attachments for published posts"
on public.blog_attachments for select
using (
  exists (
    select 1 from public.blog_posts p
    where p.id = blog_attachments.post_id
      and p.published = true
  )
);
```

Admin write (email-based):

Replace `YOU@example.com`.

```sql
drop policy if exists "admin write posts" on public.blog_posts;
create policy "admin write posts"
on public.blog_posts for all
to authenticated
using (auth.jwt() ->> 'email' = 'YOU@example.com')
with check (auth.jwt() ->> 'email' = 'YOU@example.com');

drop policy if exists "admin write attachments" on public.blog_attachments;
create policy "admin write attachments"
on public.blog_attachments for all
to authenticated
using (auth.jwt() ->> 'email' = 'YOU@example.com')
with check (auth.jwt() ->> 'email' = 'YOU@example.com');
```

Storage policies depend on whether the bucket is public.
If you keep it public, you mainly need insert/update permissions for authenticated admin.

For deleting posts from the UI (which also deletes attachments), ensure your admin can also delete objects in the `blog` bucket.

## 6) Create the admin user

Use Supabase Auth:
- Create a user with email+password (Auth -> Users).
- Use that same email in `VITE_ADMIN_EMAIL`.

## 7) Use it in the site

- Go to the Blog section.
- Click `admin login`.
- After login, click `escrever` -> write -> `publish`.

Visitors will see the new post immediately.
