import type { Metadata } from "next";
import { ManagedPage } from "../managed-page";
import { getPublicManagedPage } from "../../../lib/site-content-server";
export async function generateMetadata():Promise<Metadata>{const page=await getPublicManagedPage("kurumsal-bilgiler");return {title:page?.seo_title||"Kurumsal Bilgiler",description:page?.seo_description||"BÜCÜRÜKTOYS kurumsal ve iletişim bilgileri.",alternates:{canonical:"/kurumsal-bilgiler"}};}
export default function Page(){return <ManagedPage slug="kurumsal-bilgiler"/>;}
