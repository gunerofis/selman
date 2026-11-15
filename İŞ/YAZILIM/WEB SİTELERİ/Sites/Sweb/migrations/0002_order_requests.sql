create table if not exists storefront_order_requests (
  id text primary key,
  request_hash text not null,
  customer jsonb not null,
  items jsonb not null,
  total_cents bigint not null check (total_cents > 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  status text not null default 'new' check (status in ('new', 'reviewed')),
  created_at timestamptz not null default now()
);
