create table if not exists product_reviews (
  id text primary key,
  sku text not null,
  order_id text not null,
  email text not null,
  author text not null,
  rating smallint not null,
  longevity smallint not null,
  sillage smallint not null,
  season text not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  unique (order_id, sku),
  check (rating between 1 and 5),
  check (longevity between 1 and 5),
  check (sillage between 1 and 5),
  check (season in ('ilkbahar', 'yaz', 'sonbahar', 'kis'))
);

create index if not exists product_reviews_sku_idx on product_reviews (sku);
