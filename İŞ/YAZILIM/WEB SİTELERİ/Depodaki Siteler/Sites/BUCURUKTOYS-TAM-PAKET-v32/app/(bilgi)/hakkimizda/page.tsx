import type { Metadata } from "next";
import { ManagedPage } from "../managed-page";
import { getPublicManagedPage } from "../../../lib/site-content-server";
export async function generateMetadata():Promise<Metadata>{const page=await getPublicManagedPage("hakkimizda");return {title:page?.seo_title||"BÜCÜRÜKTOYS Hakkında",description:page?.seo_description||"BÜCÜRÜKTOYS marka ve toptan oyuncak tedarik bilgileri.",alternates:{canonical:"/hakkimizda"}};}
export default function Page(){return <ManagedPage slug="hakkimizda"/>;}
