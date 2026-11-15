import type { Metadata } from "next";
import { ManagedPage } from "../managed-page";
import { getPublicManagedPage } from "../../../lib/site-content-server";
export async function generateMetadata():Promise<Metadata>{const page=await getPublicManagedPage("sikca-sorulan-sorular");return {title:page?.seo_title||"Toptan Oyuncak Sık Sorulan Sorular",description:page?.seo_description||"Teklif, stok, paket ve teslimat sorularının yanıtları.",alternates:{canonical:"/sikca-sorulan-sorular"}};}
export default function Page(){return <ManagedPage slug="sikca-sorulan-sorular"/>;}
