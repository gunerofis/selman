create table if not exists site_config (
  id text primary key,
  value jsonb not null,
  updated_by text not null,
  updated_at timestamptz not null default now()
);

alter table storefront_order_requests drop constraint if exists storefront_order_requests_status_check;
alter table storefront_order_requests
  add constraint storefront_order_requests_status_check
  check (status in ('new', 'reviewed', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled', 'archived'));

alter table storefront_order_requests add column if not exists admin_note text;
alter table storefront_order_requests add column if not exists updated_at timestamptz not null default now();
