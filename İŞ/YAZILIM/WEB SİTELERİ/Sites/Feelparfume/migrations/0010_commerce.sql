alter table storefront_order_requests add column if not exists coupon_code text;
alter table storefront_order_requests add column if not exists discount_cents bigint not null default 0;
alter table storefront_order_requests add column if not exists gift_wrap boolean not null default false;
alter table storefront_order_requests add column if not exists gift_note text;
alter table storefront_order_requests add column if not exists hide_prices boolean not null default false;
alter table storefront_order_requests add column if not exists paytr_oid text;
alter table storefront_order_requests add column if not exists stock_applied boolean not null default false;
alter table storefront_order_requests add column if not exists stock_shortage jsonb;

alter table storefront_order_requests drop constraint if exists storefront_order_requests_discount_cents_check;
alter table storefront_order_requests
  add constraint storefront_order_requests_discount_cents_check
  check (discount_cents >= 0);

create unique index if not exists storefront_order_requests_paytr_oid_idx
  on storefront_order_requests (paytr_oid)
  where paytr_oid is not null;

create table if not exists coupons (
  code text primary key,
  kind text not null check (kind in ('percent', 'amount', 'shipping', 'first')),
  value integer not null,
  min_cents bigint not null default 0,
  active boolean not null default true,
  check (
    (kind in ('percent', 'first') and value between 1 and 100)
    or (kind = 'amount' and value > 0)
    or (kind = 'shipping')
  )
);

create table if not exists perfume_price_log (
  id bigserial primary key,
  sku text not null,
  ml numeric(8, 2) not null,
  price numeric(12, 2) not null,
  recorded_at timestamptz not null default now()
);

create index if not exists perfume_price_log_sku_idx
  on perfume_price_log (sku, ml, recorded_at desc);

insert into perfume_price_log (sku, ml, price)
select v.sku, v.ml, v.price
from perfume_variants v
where not exists (
  select 1 from perfume_price_log l where l.sku = v.sku and l.ml = v.ml
);

create table if not exists stock_alerts (
  id bigserial primary key,
  sku text not null,
  ml numeric(8, 2) not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (sku, ml, email)
);

create table if not exists order_mail (
  order_id text not null,
  event text not null,
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'held',
  created_at timestamptz not null default now(),
  primary key (order_id, event),
  check (event in ('alindi', 'hazirlaniyor', 'kargoda', 'teslim')),
  check (status in ('held', 'queued', 'sent', 'failed'))
);

create table if not exists paytr_rates (
  bank text not null,
  months integer not null,
  ratio_bps integer not null,
  fetched_at timestamptz not null default now(),
  primary key (bank, months)
);

create table if not exists paytr_rate_sync (
  id integer primary key,
  fetched_at timestamptz not null
);

create table if not exists paytr_refunds (
  order_id text not null,
  refunded_cents bigint not null,
  status text not null,
  primary key (order_id, refunded_cents),
  check (status in ('pending', 'done'))
);

create sequence if not exists storefront_invoice_seq;
