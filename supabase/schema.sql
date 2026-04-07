-- ============================================================
--  PINKASFLOYD — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Orders table
create table if not exists public.orders (
  id          bigint        generated always as identity primary key,

  order_id    text          not null unique,

  user_id     uuid          references auth.users(id) on delete set null,

  name        text          not null,
  email       text          not null,
  phone       text          not null,
  address     text          not null,

  items       jsonb         not null,   -- [{id, title, size, price, quantity, subtotal}]
  total       integer       not null,

  status      text          not null default 'pending', -- pending | approved | declined

  created_at  timestamptz   not null default now()
);

-- ── Indexes ────────────────────────────────────────────────
create index if not exists orders_user_id_idx   on public.orders (user_id);
create index if not exists orders_status_idx    on public.orders (status);
create index if not exists orders_created_idx   on public.orders (created_at desc);
-- ── Row Level Security ─────────────────────────────────────
alter table public.orders enable row level security;

-- Insert (only logged-in user can create their order)
create policy "insert_own_order"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

--2. Select (user sees only their orders)
create policy "select_own_orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);
-- 3. Update (blocked for users — you update manually/admin)
create policy "block_user_updates"
on public.orders
for update
to authenticated
using (false);

-- Wishlist table
create table if not exists public.wishlist (
  id          bigint        generated always as identity primary key,
  user_id     uuid          not null references auth.users(id) on delete cascade,
  poster_id   text          not null,
  created_at  timestamptz   not null default now(),
  unique (user_id, poster_id)
);

-- ── Wishlist Indexes ───────────────────────────────────────
create index if not exists wishlist_user_id_idx on public.wishlist (user_id);
create index if not exists wishlist_created_idx on public.wishlist (created_at desc);

-- ── Wishlist Row Level Security ────────────────────────────
alter table public.wishlist enable row level security;

create policy "insert_own_wishlist"
on public.wishlist
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "select_own_wishlist"
on public.wishlist
for select
to authenticated
using (auth.uid() = user_id);

create policy "delete_own_wishlist"
on public.wishlist
for delete
to authenticated
using (auth.uid() = user_id);
