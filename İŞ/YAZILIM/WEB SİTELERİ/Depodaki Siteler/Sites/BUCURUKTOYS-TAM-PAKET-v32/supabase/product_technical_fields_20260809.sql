-- Toptan urun teknik ve uygunluk alanlari — veri kaybi olmadan tekrar calistirilabilir.
-- Mevcut satirlari ve erisim yetkilerini degistirmez.
begin;

alter table public.products add column if not exists age_group text;
alter table public.products add column if not exists conformity_declaration text;
alter table public.products add column if not exists product_dimensions text;
alter table public.products add column if not exists carton_dimensions text;
alter table public.products add column if not exists carton_desi numeric(10,2) check (carton_desi is null or carton_desi >= 0);
alter table public.products add column if not exists carton_weight_kg numeric(10,3) check (carton_weight_kg is null or carton_weight_kg >= 0);
alter table public.products add column if not exists origin_country text;
alter table public.products add column if not exists safety_note text;
alter table public.products add column if not exists license_note text;

comment on column public.products.age_group is 'Uretici veya ithalatci tarafindan dogrulanmis yas grubu';
comment on column public.products.conformity_declaration is 'Urun sinifina uygulanabilir uygunluk ve CE beyan bilgisi';
comment on column public.products.product_dimensions is 'Urun olcusu';
comment on column public.products.carton_dimensions is 'Koli en x boy x yukseklik';
comment on column public.products.carton_desi is 'Kargo desi degeri';
comment on column public.products.carton_weight_kg is 'Brut koli agirligi, kilogram';
comment on column public.products.origin_country is 'Mense ulke';
comment on column public.products.safety_note is 'Dogrulanmis guvenlik ve kullanim uyarisi';
comment on column public.products.license_note is 'Marka, karakter ve gorsel lisans durumu';

notify pgrst, 'reload schema';
commit;
