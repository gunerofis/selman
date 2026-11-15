create table if not exists perfume_brands (
  slug text primary key,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists perfume_products (
  sku text primary key,
  slug text not null unique,
  name text not null,
  brand_slug text references perfume_brands (slug) on update cascade,
  category text not null,
  gender text,
  concentration text,
  families text[] not null default '{}',
  notes_top text[] not null default '{}',
  notes_heart text[] not null default '{}',
  notes_base text[] not null default '{}',
  longevity smallint,
  sillage smallint,
  seasons text[] not null default '{}',
  year integer,
  perfumer text,
  origin text,
  ingredients text,
  tagline text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  image text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'active',
  is_sample boolean not null default false,
  sort integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint perfume_products_status_check check (status in ('active', 'draft', 'archived')),
  constraint perfume_products_longevity_check check (longevity is null or longevity between 1 and 5),
  constraint perfume_products_sillage_check check (sillage is null or sillage between 1 and 5)
);

create index if not exists perfume_products_status_idx on perfume_products (status);
create index if not exists perfume_products_category_idx on perfume_products (category);
create index if not exists perfume_products_brand_idx on perfume_products (brand_slug);

create table if not exists perfume_variants (
  id bigserial primary key,
  sku text not null references perfume_products (sku) on delete cascade on update cascade,
  ml numeric(8, 2) not null,
  price numeric(12, 2) not null,
  stock integer not null default 0,
  gtin text,
  batch text,
  expiry text,
  is_sample boolean not null default false,
  sort integer not null default 0,
  constraint perfume_variants_price_check check (price >= 0),
  constraint perfume_variants_ml_check check (ml > 0),
  constraint perfume_variants_unique unique (sku, ml)
);

create index if not exists perfume_variants_sku_idx on perfume_variants (sku);
