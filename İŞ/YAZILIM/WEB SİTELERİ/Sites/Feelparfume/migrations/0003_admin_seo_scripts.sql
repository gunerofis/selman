alter table catalog_product_state add column if not exists seo_title_override text;
alter table catalog_product_state add column if not exists seo_description_override text;
alter table catalog_product_state add column if not exists image_alt_override text;

create table if not exists site_script_state (
  id uuid primary key,
  name text not null,
  placement text not null check (placement in ('head', 'body')),
  code text not null,
  active boolean not null default false,
  updated_by text not null,
  updated_at timestamptz not null default now()
);
