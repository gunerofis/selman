-- Veri sorumlusu kimligi tamamlanana kadar web uzerinden kisisel veri kaydini durdurur.
begin;

revoke all on function public.create_catalog_quote(text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.create_dealer_application(text,text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.create_print_request(text,text,text,text,text,integer,text,text,text,text,text,text,text,numeric,jsonb) from public, anon, authenticated;

drop policy if exists "Anonymous upload print request files" on storage.objects;

commit;
