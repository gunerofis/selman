begin;

drop policy if exists "Owners insert admin users" on public.admin_users;
create policy "Owners insert admin users"
on public.admin_users for insert to authenticated
with check (
  private.current_admin_role() = 'developer'
  or (
    private.current_admin_role() = 'owner'
    and role in ('owner', 'editor', 'viewer')
  )
);

drop policy if exists "Owners update admin users" on public.admin_users;
create policy "Owners update admin users"
on public.admin_users for update to authenticated
using (
  private.current_admin_role() = 'developer'
  or (
    private.current_admin_role() = 'owner'
    and role <> 'developer'
  )
)
with check (
  private.current_admin_role() = 'developer'
  or (
    private.current_admin_role() = 'owner'
    and role in ('owner', 'editor', 'viewer')
  )
);

drop policy if exists "Owners delete admin users" on public.admin_users;
create policy "Owners delete admin users"
on public.admin_users for delete to authenticated
using (
  private.current_admin_role() = 'developer'
  or (
    private.current_admin_role() = 'owner'
    and role <> 'developer'
  )
);

update public.site_settings
set value = to_jsonb('Türkiye geneli teslimat'::text),
    updated_at = now()
where key = 'delivery_note';

commit;
