alter table public.admin_users
  add column if not exists session_valid_after timestamptz not null default '1970-01-01 00:00:00+00';

create or replace function private.current_admin_role()
returns text
language sql
stable
security definer
set search_path='public','auth'
as $$
  select role
  from public.admin_users
  where lower(email)=lower(coalesce(auth.jwt()->>'email',''))
    and is_active=true
    and coalesce(to_timestamp((auth.jwt()->>'iat')::double precision) >= session_valid_after,false)
  limit 1
$$;

-- Bir yönetici jetonu açığa çıkarsa ilgili hesap için bunu çalıştırın:
-- update public.admin_users set session_valid_after=now(),updated_at=now() where lower(email)=lower('admin@example.com');
