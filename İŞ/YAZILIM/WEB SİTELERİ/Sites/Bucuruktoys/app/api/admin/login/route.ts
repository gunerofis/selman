import { NextResponse } from "next/server";
import { getDataConfig } from "../../../../lib/data-server";
import { cookie, loginWithKey, sameOrigin } from "../../../../lib/admin-auth";
import { isRateLimited } from "../../../../lib/rate-limit";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
  if(!sameOrigin(request))return NextResponse.json({error:"Geçersiz istek kaynağı."},{status:403});
  if(await isRateLimited(request,"login",8,15*60_000))return NextResponse.json({error:"Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin."},{status:429});
  const body=await request.json().catch(()=>null) as {email?:unknown;password?:unknown}|null;
  const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
  const key=typeof body?.password==="string"?body.password:"";
  const config=getDataConfig();if(!config)return NextResponse.json({error:"Yönetim veritabanına ulaşılamadı."},{status:503});
  const token=await loginWithKey(config,email,key);
  if(!token)return NextResponse.json({error:"E-posta veya giriş anahtarı hatalı."},{status:401});
  return NextResponse.json({accessToken:"session"},{headers:{"Set-Cookie":cookie(token),"Cache-Control":"no-store"}});
}
