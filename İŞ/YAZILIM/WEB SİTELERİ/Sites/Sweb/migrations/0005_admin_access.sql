create table if not exists admin_roles (
  id uuid primary key,
  role_key text not null unique,
  name text not null,
  description text not null default '',
  is_system boolean not null default false,
  rules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key,
  username text not null unique,
  display_name text not null,
  password_salt text not null,
  password_hash text not null,
  active boolean not null default true,
  locked boolean not null default false,
  two_factor_required boolean not null default false,
  two_factor_secret text,
  role_id uuid not null references admin_roles(id) on delete restrict,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  id uuid primary key,
  token_hash text not null unique,
  user_id uuid references admin_users(id) on delete cascade,
  actor_name text not null,
  role_key text not null,
  ip text not null,
  user_agent text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists admin_sessions_user_idx on admin_sessions(user_id, expires_at desc);

create table if not exists admin_login_events (
  id bigserial primary key,
  user_id uuid references admin_users(id) on delete set null,
  username text not null,
  success boolean not null,
  ip text not null,
  user_agent text not null,
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists admin_login_events_created_idx on admin_login_events(created_at desc);

create table if not exists admin_activity_log (
  id bigserial primary key,
  actor_id uuid references admin_users(id) on delete set null,
  actor_name text not null,
  permission_key text not null,
  action text not null,
  resource_type text not null,
  resource_id text,
  before_state jsonb,
  after_state jsonb,
  ip text not null,
  user_agent text not null,
  created_at timestamptz not null default now()
);
create index if not exists admin_activity_created_idx on admin_activity_log(created_at desc);

create table if not exists admin_approval_requests (
  id uuid primary key,
  requested_by uuid references admin_users(id) on delete set null,
  requester_name text not null,
  permission_key text not null,
  resource_type text not null,
  resource_id text,
  payload jsonb,
  payload_hash text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references admin_users(id) on delete set null,
  reviewer_name text,
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  consumed_at timestamptz
);
create index if not exists admin_approval_status_idx on admin_approval_requests(status, created_at desc);

-- Logs are append-only from the application role. There is deliberately no
-- delete endpoint or cascading delete path for either audit table.
