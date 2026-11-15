create table if not exists scent_results (
  id text primary key,
  email text,
  answers jsonb not null,
  skus text[] not null,
  created_at timestamptz not null default now()
);

create table if not exists scent_mail (
  id text primary key,
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'held',
  created_at timestamptz not null default now(),
  check (status in ('held', 'queued', 'sent', 'failed'))
);
