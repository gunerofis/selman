alter table storefront_order_requests
  add column if not exists payment_status text not null default 'pending';
alter table storefront_order_requests
  add column if not exists shipping_status text not null default 'pending';
alter table storefront_order_requests add column if not exists carrier text;
alter table storefront_order_requests add column if not exists tracking_code text;
alter table storefront_order_requests add column if not exists invoice_number text;
alter table storefront_order_requests
  add column if not exists refunded_cents bigint not null default 0;

alter table storefront_order_requests
  drop constraint if exists storefront_order_requests_payment_status_check;
alter table storefront_order_requests
  add constraint storefront_order_requests_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'partially_refunded', 'refunded'));

alter table storefront_order_requests
  drop constraint if exists storefront_order_requests_shipping_status_check;
alter table storefront_order_requests
  add constraint storefront_order_requests_shipping_status_check
  check (shipping_status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled'));

alter table storefront_order_requests
  drop constraint if exists storefront_order_requests_refunded_cents_check;
alter table storefront_order_requests
  add constraint storefront_order_requests_refunded_cents_check
  check (refunded_cents >= 0 and refunded_cents <= total_cents);
