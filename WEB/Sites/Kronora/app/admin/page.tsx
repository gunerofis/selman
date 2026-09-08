import Link from "next/link";
import { chatGPTSignOutPath } from "../chatgpt-auth";
import { getAdminContext } from "../lib/admin-auth";
import { getAdminSnapshot } from "../lib/admin-data";
import AdminPanel from "./admin-panel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yönetim Paneli", robots: { index: false, follow: false } };
export default async function AdminPage() { const admin = await getAdminContext("/admin"); if (!admin) return <main className="admin-access"><div><span>🔒</span><h1>Yönetim erişimi tanımlı değil.</h1><p>Bu ChatGPT hesabının e-posta adresi geliştirici veya genel yönetici listesine eklenmelidir.</p><Link className="button primary" href="/">Siteye dön</Link></div></main>; return <AdminPanel admin={admin} snapshot={await getAdminSnapshot()} signOutPath={chatGPTSignOutPath("/")}/>; }
