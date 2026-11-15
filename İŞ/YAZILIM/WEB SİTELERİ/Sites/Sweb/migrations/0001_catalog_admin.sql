create table if not exists catalog_product_state (
  product_key text primary key,
  name_override text,
  price_override numeric(12, 2),
  status text not null default 'active',
  updated_by text not null,
  updated_at timestamptz not null default now(),
  constraint catalog_product_state_status_check check (status in ('active', 'inactive', 'archived')),
  constraint catalog_product_state_name_check check (name_override is null or char_length(name_override) between 2 and 120),
  constraint catalog_product_state_price_check check (price_override is null or price_override >= 0)
);

create index if not exists catalog_product_state_status_idx
  on catalog_product_state (status);

create table if not exists catalog_admin_audit (
  id bigserial primary key,
  product_key text not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  actor text not null,
  created_at timestamptz not null default now()
);

create index if not exists catalog_admin_audit_product_idx
  on catalog_admin_audit (product_key, created_at desc);
