create table if not exists admin_records (
  id uuid primary key,
  module text not null,
  title text not null,
  reference text,
  status text not null,
  data jsonb not null default '{}'::jsonb,
  owner_id uuid references admin_users(id) on delete set null,
  assigned_id uuid references admin_users(id) on delete set null,
  category text,
  warehouse text,
  brand text,
  customer_group text,
  sales_channel text,
  created_by uuid references admin_users(id) on delete set null,
  updated_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_records_module_status_idx
  on admin_records (module, status, updated_at desc);
create index if not exists admin_records_assigned_idx
  on admin_records (assigned_id, updated_at desc);
create unique index if not exists admin_records_reference_idx
  on admin_records (module, reference) where reference is not null;
