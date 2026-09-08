begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.admin_users
  add column if not exists display_name text,
  add column if not exists role text not null default 'editor',
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by text;

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check check (role in ('developer','owner','editor','viewer'));
alter table public.admin_users drop constraint if exists admin_users_developer_identity_check;
alter table public.admin_users add constraint admin_users_developer_identity_check check (role <> 'developer' or lower(email)=lower('slmnkrkmz1@gmail.com'));
create unique index if not exists admin_users_single_developer_idx on public.admin_users ((role)) where role='developer';

insert into public.admin_users (email, display_name, role, is_active)
values ('slmnkrkmz1@gmail.com', 'Selman Korkmaz', 'developer', true)
on conflict (email) do update set display_name=excluded.display_name, role='developer', is_active=true, updated_at=now();

create or replace function private.current_admin_role()
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select role from public.admin_users
  where lower(email)=lower(coalesce(auth.jwt()->>'email','')) and is_active=true
  limit 1
$$;
revoke all on function private.current_admin_role() from public, anon;
grant execute on function private.current_admin_role() to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$ select private.current_admin_role() is not null $$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create or replace function private.can_write()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$ select coalesce(private.current_admin_role() in ('developer','owner','editor'), false) $$;
revoke all on function private.can_write() from public, anon;
grant execute on function private.can_write() to authenticated;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$ select coalesce(private.current_admin_role() in ('developer','owner'), false) $$;
revoke all on function private.is_owner() from public, anon;
grant execute on function private.is_owner() to authenticated;

create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  guides jsonb not null default '[]'::jsonb check (jsonb_typeof(guides)='array'),
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories enable row level security;

insert into public.categories (id,slug,name,short_description,description,sort_order) values
('outdoor','dis-mekan','Dış Mekân Oyuncakları','Açık alanda hareket ve oyun için paketli ürünler.','Su tabancası, köpük, ok-yay ve benzeri hareketli ürünlerden oluşan toptan dış mekân oyuncakları.',1),
('fun','saka-eglence','Şaka ve Eğlence Oyuncakları','Hızlı ilgi gören eğlenceli tezgâh ürünleri.','Korna, büyüteç, kapsül ve şaka ürünleri gibi dikkat çeken toptan eğlence oyuncakları.',2),
('skill','zeka-beceri','Zekâ ve Beceri Oyuncakları','El becerisi ve problem çözme odaklı ürünler.','Kart setleri, labirentler ve şekillendirilebilir modellerden oluşan toptan zekâ ve beceri oyuncakları.',3),
('sensory','stres-duyusal','Stres ve Duyusal Oyuncaklar','Sıkma, bükme ve dokunma deneyimi sunan ürünler.','Stres topları, renkli yaylar ve sıkıştırılabilir modellerden oluşan toptan duyusal oyuncaklar.',4),
('stationery','kirtasiye-sticker','Kırtasiye ve Sticker Ürünleri','Oyuncak niteliği taşıyan küçük kırtasiye çeşitleri.','Defter, sticker, silgi ve çizim setlerinden oluşan paketli toptan kırtasiye ürünleri.',5),
('accessory','anahtarlik-aksesuar','Anahtarlık ve Oyuncak Aksesuarları','Kasa önü ve küçük hediye satışına uygun çeşitler.','Işıklı anahtarlık, bileklik, toka ve küçük aksesuar modellerinden oluşan toptan ürün grubu.',6),
('3d','3d-baski','3D Baskı','Özgün ve kişiselleştirilebilir üretim ürünleri.','BÜCÜRÜKTOYS 3D baskı ürün ve özel üretim koleksiyonu.',7)
on conflict (id) do nothing;

create table if not exists public.site_settings (
  key text primary key,
  label text not null,
  group_name text not null default 'general',
  value jsonb not null default 'null'::jsonb,
  is_public boolean not null default false,
  updated_by text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

insert into public.site_settings (key,label,group_name,value,is_public) values
('brand_name','Marka adı','general','"BÜCÜRÜKTOYS"',true),
('phone','Telefon','contact','"0539 346 85 27"',true),
('whatsapp','WhatsApp numarası','contact','"905393468527"',true),
('email','E-posta','contact','""',true),
('address','Adres','contact','"İstanbul"',true),
('delivery_note','Teslimat notu','sales','"Türkiye geneli teslimat"',true),
('three_d_public','3D kataloğunu yayınla','features','false',true),
('maintenance_mode','Bakım modu','features','false',false)
on conflict (key) do nothing;

create table if not exists public.content_pages (
  slug text primary key,
  title text not null,
  kicker text not null default '',
  summary text not null default '',
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections)='array'),
  seo_title text,
  seo_description text,
  is_published boolean not null default true,
  updated_by text,
  updated_at timestamptz not null default now()
);
alter table public.content_pages enable row level security;

insert into public.content_pages (slug,title,kicker,summary,sections,seo_title,seo_description) values
('hakkimizda','BÜCÜRÜKTOYS hakkında','Marka ve çalışma biçimi','BÜCÜRÜKTOYS, mağaza ve işletmeler için paketli oyuncak ürünlerini kod, paket ve teklif düzeniyle sunar.','[{"title":"Ne sunuyoruz?","text":"Toptan alıcıların ürünleri kategori, stok kodu ve paket bilgisiyle karşılaştırmasını kolaylaştırıyoruz."},{"title":"Nasıl çalışıyoruz?","text":"Fiyat, stok, teslimat ve uygunluk bilgileri sipariş onayından önce ürün koduyla birlikte doğrulanır."}]','Hakkımızda','BÜCÜRÜKTOYS toptan oyuncak kataloğu ve çalışma biçimi.'),
('kurumsal-bilgiler','Kurumsal bilgiler','Şeffaf ticari bilgi','Firma, satış ve iletişim bilgileri bu alandan güncel tutulur.','[{"title":"Satış modeli","text":"BÜCÜRÜKTOYS yalnızca toptan teklif usulü çalışır; çevrim içi ödeme alınmaz."},{"title":"Sipariş teyidi","text":"Ürün, adet, fiyat, stok ve teslimat bilgileri satış birimiyle kesinleştirilir."}]','Kurumsal Bilgiler','BÜCÜRÜKTOYS kurumsal satış ve iletişim bilgileri.'),
('sikca-sorulan-sorular','Sıkça sorulan sorular','Toptan alım desteği','Sipariş, fiyat, stok ve teslimatla ilgili temel yanıtlar.','[{"title":"Fiyatları nasıl öğrenebilirim?","text":"Ürünleri teklif listenize ekleyip WhatsApp üzerinden güncel fiyat ve stok teyidi isteyebilirsiniz."},{"title":"Minimum sipariş nedir?","text":"Minimum sipariş miktarı ürüne ve paket düzenine göre değişir; ürün detayında veya teklif aşamasında belirtilir."},{"title":"Teslimat nasıl yapılır?","text":"Teslimat biçimi, adres ve sipariş hacmine göre satış birimiyle netleştirilir."}]','Sıkça Sorulan Sorular','BÜCÜRÜKTOYS toptan oyuncak siparişi hakkında sık sorulan sorular.'),
('toptan-oyuncak-rehberi','Toptan oyuncak alım rehberi','Satın alma rehberi','Ürün kodu, paket düzeni, güvenlik belgesi ve teslimat bilgisini doğru sırayla kontrol edin.','[{"title":"Ürün kodunu esas alın","text":"Benzer ürünleri karıştırmamak için her görüşmede BT biçimindeki stok kodunu kullanın."},{"title":"Paket ve koli bilgisini doğrulayın","text":"Paket adedi, koli içi dağılım ve minimum sipariş miktarını teklif öncesinde kesinleştirin."},{"title":"Belge ve teslimatı netleştirin","text":"Yaş grubu, uygunluk, menşe, stok ve teslimat bilgisini sipariş onayından önce yazılı olarak teyit edin."}]','Toptan Oyuncak Rehberi','Toptan oyuncak seçimi, teklif ve sipariş kontrol rehberi.'),
('toptan-satis','Toptan satış','Teklif ve sipariş süreci','Ürünleri seçin, adetleri belirleyin ve stok kodlu listenizi satış birimine gönderin.','[{"title":"Ürünleri seçin","text":"Katalogdan ihtiyacınız olan ürünleri ve paket adetlerini belirleyin."},{"title":"Teklif isteyin","text":"Hazır listenizi WhatsApp üzerinden göndererek güncel fiyat ve stok teyidi alın."},{"title":"Siparişi netleştirin","text":"Ödeme ve teslimat ayrıntılarını satış birimiyle kesinleştirin."}]','Toptan Satış','BÜCÜRÜKTOYS toptan teklif ve sipariş süreci.'),
('gizlilik','Gizlilik ve veri kullanımı','Veri kullanımı','Form ve katalog işlemlerinde paylaşılan bilgiler yalnızca talep ve hizmet süreçleri için kullanılır.','[{"title":"Toplanan bilgiler","text":"İletişim, firma, ürün ve talep bilgileri teklif veya başvuru sürecinin yürütülmesi için işlenir."},{"title":"Haklarınız","text":"Bilgilerinizin düzeltilmesini veya silinmesini iletişim kanallarımızdan talep edebilirsiniz."}]','Gizlilik','BÜCÜRÜKTOYS gizlilik ve veri kullanımı açıklaması.')
on conflict (slug) do nothing;

create table if not exists public.admin_audit_logs (
  id bigint generated by default as identity primary key,
  actor_email text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_created_idx on public.admin_audit_logs(created_at desc);
alter table public.admin_audit_logs enable row level security;

alter table public.quotes add column if not exists internal_note text;
alter table public.dealer_applications add column if not exists internal_note text;
alter table public.print_requests add column if not exists internal_note text;

drop policy if exists "Admins manage admin users" on public.admin_users;
create policy "Admins read admin users" on public.admin_users for select to authenticated using (private.is_admin());
create policy "Owners insert admin users" on public.admin_users for insert to authenticated with check (private.is_owner());
create policy "Owners update admin users" on public.admin_users for update to authenticated using (private.is_owner()) with check (private.is_owner());
create policy "Owners delete admin users" on public.admin_users for delete to authenticated using (private.is_owner());

create policy "Public reads categories" on public.categories for select to anon using (is_visible=true);
create policy "Admins read categories" on public.categories for select to authenticated using (private.is_admin());
create policy "Editors insert categories" on public.categories for insert to authenticated with check (private.can_write());
create policy "Editors update categories" on public.categories for update to authenticated using (private.can_write()) with check (private.can_write());
create policy "Editors delete categories" on public.categories for delete to authenticated using (private.can_write());

create policy "Public reads site settings" on public.site_settings for select to anon using (is_public=true);
create policy "Admins read site settings" on public.site_settings for select to authenticated using (private.is_admin());
create policy "Editors insert site settings" on public.site_settings for insert to authenticated with check (private.can_write());
create policy "Editors update site settings" on public.site_settings for update to authenticated using (private.can_write()) with check (private.can_write());
create policy "Editors delete site settings" on public.site_settings for delete to authenticated using (private.can_write());

create policy "Public reads content pages" on public.content_pages for select to anon using (is_published=true);
create policy "Admins read content pages" on public.content_pages for select to authenticated using (private.is_admin());
create policy "Editors insert content pages" on public.content_pages for insert to authenticated with check (private.can_write());
create policy "Editors update content pages" on public.content_pages for update to authenticated using (private.can_write()) with check (private.can_write());
create policy "Editors delete content pages" on public.content_pages for delete to authenticated using (private.can_write());

create policy "Admins read audit logs" on public.admin_audit_logs for select to authenticated using (private.is_admin());
create policy "Editors write audit logs" on public.admin_audit_logs for insert to authenticated with check (private.can_write());

grant select on public.categories, public.site_settings, public.content_pages to anon;
grant select, insert, update, delete on public.categories, public.site_settings, public.content_pages, public.admin_users to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;
grant usage, select on sequence public.admin_audit_logs_id_seq to authenticated;

revoke all on function public.adjust_product_stock(bigint, integer, text, text) from public, anon;
grant execute on function public.adjust_product_stock(bigint, integer, text, text) to authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;

commit;
