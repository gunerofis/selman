import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./bayi.css";
import "./bayi-extra.css";
export const metadata: Metadata = { title:"Bayilik ve Kurumsal Alım", description:"BÜCÜRÜKTOYS toptan oyuncak bayilik ve kurumsal müşteri başvurusu.", alternates:{canonical:"/bayi"} };
export default function Layout({children}:{children:ReactNode}){return children;}
