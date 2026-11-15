create table if not exists shipping_settings (
  id integer primary key,
  fee_cents bigint not null default 14900,
  free_from_cents bigint not null default 150000,
  check (fee_cents >= 0),
  check (free_from_cents >= 0)
);

insert into shipping_settings (id) values (1) on conflict (id) do nothing;

alter table storefront_order_requests add column if not exists cargo_key text;
alter table storefront_order_requests add column if not exists cargo_job_id text;

create unique index if not exists storefront_order_requests_cargo_key_idx
  on storefront_order_requests (cargo_key)
  where cargo_key is not null;
