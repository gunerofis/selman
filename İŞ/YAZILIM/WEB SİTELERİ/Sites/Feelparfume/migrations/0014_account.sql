create table if not exists customers (
  id text primary key,
  email text not null,
  password_hash text not null,
  name text not null default '',
  birth_month smallint,
  birth_day smallint,
  consent_stock boolean not null default false,
  consent_price boolean not null default false,
  consent_bottle boolean not null default false,
  created_at timestamptz not null default now(),
  check (birth_month is null or birth_month between 1 and 12),
  check (birth_day is null or birth_day between 1 and 31)
);

create unique index if not exists customers_email_idx on customers (lower(email));

create table if not exists customer_sessions (
  token_hash text primary key,
  customer_id text not null references customers (id) on delete cascade,
  expires_at timestamptz not null
);

create index if not exists customer_sessions_customer_idx on customer_sessions (customer_id);

create table if not exists customer_addresses (
  id text primary key,
  customer_id text not null references customers (id) on delete cascade,
  name text not null,
  phone text not null,
  city text not null,
  district text not null,
  postal text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create index if not exists customer_addresses_customer_idx on customer_addresses (customer_id, created_at);

create table if not exists customer_wishes (
  customer_id text not null references customers (id) on delete cascade,
  sku text not null,
  price_cents bigint not null check (price_cents >= 0),
  primary key (customer_id, sku)
);

create table if not exists customer_mail (
  id text primary key,
  to_email text not null,
  kind text not null check (kind in ('stok', 'fiyat', 'sise')),
  subject text not null,
  body text not null,
  status text not null default 'held' check (status in ('held', 'queued', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table coupons add column if not exists owner_email text;
alter table coupons add column if not exists expires_on date;
