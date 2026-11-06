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

-- Insert (only logged-in user can create their order, and only as 'pending'
-- so nobody can self-approve an order from the browser)
create policy "insert_own_order"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id and status = 'pending');

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

-- ============================================================
--  MIGRATION (2026-11): harden order inserts
--  Run this block once in the SQL Editor on the live project.
--  The browser builds the order, so without these checks a user
--  could insert an order as 'approved' or with any total.
-- ============================================================

-- 1. Only allow 'pending' orders from the client
drop policy if exists "insert_own_order" on public.orders;
create policy "insert_own_order"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id and status = 'pending');

-- 2. Recompute the total from the item sizes and reject tampered prices.
--    Keep these prices in sync with app/constants/posters.ts
--    (posterPriceMap + FRAMING_COST). The 5% member discount is allowed.
create or replace function public.validate_order_total()
returns trigger
language plpgsql
as $$
declare
  item      jsonb;
  unit      integer;
  qty       integer;
  subtotal  integer := 0;
begin
  if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) = 0 then
    raise exception 'Order has no items';
  end if;

  for item in select * from jsonb_array_elements(new.items) loop
    unit := case item->>'size'
      when 'A3'    then 99
      when 'A4'    then 89
      when '12x12' then 89
      when 'A6'    then 79
      when 'A7'    then 69
      else null
    end;
    if unit is null then
      raise exception 'Unknown size %', item->>'size';
    end if;
    if coalesce((item->>'framed')::boolean, false) then
      unit := unit + 79;
    end if;
    qty := coalesce((item->>'quantity')::integer, 1);
    if qty < 1 or qty > 50 then
      raise exception 'Invalid quantity';
    end if;
    subtotal := subtotal + unit * qty;
  end loop;

  if new.total not in (subtotal, subtotal - round(subtotal * 0.05)::integer) then
    raise exception 'Order total % does not match items (expected %)', new.total, subtotal;
  end if;

  new.status := 'pending';
  return new;
end;
$$;

drop trigger if exists orders_validate_total on public.orders;
create trigger orders_validate_total
before insert on public.orders
for each row execute function public.validate_order_total();
