begin;

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users
  add constraint admin_users_role_check
  check (role in ('developer','owner','editor','viewer'));

alter table public.admin_users drop constraint if exists admin_users_developer_identity_check;
alter table public.admin_users
  add constraint admin_users_developer_identity_check
  check (role <> 'developer' or lower(email)=lower('slmnkrkmz1@gmail.com'));

create unique index if not exists admin_users_single_developer_idx
  on public.admin_users ((role))
  where role='developer';

insert into public.admin_users (email, display_name, role, is_active)
values ('slmnkrkmz1@gmail.com', 'Selman Korkmaz', 'developer', true)
on conflict (email) do update
set display_name='Selman Korkmaz', role='developer', is_active=true, updated_at=now();

create or replace function private.can_write()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$ select coalesce(private.current_admin_role() in ('developer','owner','editor'), false) $$;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$ select coalesce(private.current_admin_role() in ('developer','owner'), false) $$;

revoke all on function private.can_write() from public, anon;
grant execute on function private.can_write() to authenticated;
revoke all on function private.is_owner() from public, anon;
grant execute on function private.is_owner() to authenticated;

-- The analytics policy was the only remaining caller of the deprecated public
-- helper. Route it through the private admin predicate so viewer access stays
-- read-only and the public helper can remain unavailable to client roles.
drop policy if exists "Admins read analytics" on public.analytics_events;
create policy "Admins read analytics"
on public.analytics_events for select to authenticated
using (private.is_admin());

revoke all on function public.is_admin() from public, anon, authenticated;

commit;
