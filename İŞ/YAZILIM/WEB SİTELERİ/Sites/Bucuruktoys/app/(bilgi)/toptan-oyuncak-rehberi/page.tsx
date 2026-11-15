import type { Metadata } from "next";
import { ManagedPage } from "../managed-page";
import { getPublicManagedPage } from "../../../lib/site-content-server";
export async function generateMetadata():Promise<Metadata>{const page=await getPublicManagedPage("toptan-oyuncak-rehberi");return {title:page?.seo_title||"Toptan Oyuncak Sipariş Rehberi",description:page?.seo_description||"Toptan oyuncak seçimi ve teklif süreci.",alternates:{canonical:"/toptan-oyuncak-rehberi"}};}
export default function Page(){return <ManagedPage slug="toptan-oyuncak-rehberi"/>;}
