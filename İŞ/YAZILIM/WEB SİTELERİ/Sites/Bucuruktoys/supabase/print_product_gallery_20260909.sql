-- 3D ürünlerinde birden fazla görsel desteği.
alter table public.print_products
  add column if not exists gallery jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.print_products'::regclass
      and conname = 'print_products_gallery_array_check'
  ) then
    alter table public.print_products
      add constraint print_products_gallery_array_check
      check (jsonb_typeof(gallery) = 'array');
  end if;
end
$$;
