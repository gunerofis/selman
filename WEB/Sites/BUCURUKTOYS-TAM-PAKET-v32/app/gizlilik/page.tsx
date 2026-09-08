import type { Metadata } from "next";
import { ManagedPage } from "../(bilgi)/managed-page";
import { getPublicManagedPage } from "../../lib/site-content-server";
export async function generateMetadata():Promise<Metadata>{const page=await getPublicManagedPage("gizlilik");return {title:page?.seo_title||"Gizlilik ve Veri Kullanımı",description:page?.seo_description||"BÜCÜRÜKTOYS gizlilik ve veri kullanımı bilgilendirmesi.",alternates:{canonical:"/gizlilik"}};}
export default function Page(){return <ManagedPage slug="gizlilik"/>;}
