-- The Hungry Fork database setup
-- Run this entire script once in Supabase SQL Editor.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  delivery_address text not null,
  items jsonb not null,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  status text not null default 'new' check (status in ('new','confirmed','preparing','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time text not null,
  guests integer not null check (guests between 1 and 10),
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Anyone can place an order" on public.orders;
create policy "Anyone can place an order"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Anyone can request a reservation" on public.reservations;
create policy "Anyone can request a reservation"
on public.reservations for insert
to anon, authenticated
with check (true);

-- No public SELECT policies are created. Orders and customer details
-- cannot be read through the public browser key.
