import { NextResponse } from "next/server";
import { getDataConfig } from "../../../../lib/data-server";
import { logoutSession,sameOrigin } from "../../../../lib/admin-auth";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
  if(!sameOrigin(request))return NextResponse.json({error:"Geçersiz istek kaynağı."},{status:403});
  const config=getDataConfig();
  return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store",...(config?{"Set-Cookie":await logoutSession(config,request)}:{})}});
}
