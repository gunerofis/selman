import { NextResponse } from "next/server";
import { isRateLimited } from "../../../../lib/rate-limit";
import { logAdminAction, requireAdmin } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request:Request){
  if(isRateLimited(request,"admin-reset-password",5,30*60_000))return NextResponse.json({error:"Çok fazla deneme yapıldı."},{status:429});
  const auth=await requireAdmin(request);if(!auth.ok)return NextResponse.json({error:auth.message},{status:auth.status});
  const body=await request.json().catch(()=>null) as {password?:unknown}|null;
  const password=typeof body?.password==="string"?body.password:"";
  if(password.length<10||!/[a-z]/i.test(password)||!/[0-9]/.test(password))return NextResponse.json({error:"Şifre en az 10 karakter, bir harf ve bir rakam içermelidir."},{status:400});
  const response=await fetch(`${auth.config.url}/auth/v1/user`,{method:"PUT",headers:{apikey:auth.config.anonKey,Authorization:`Bearer ${auth.accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({password}),cache:"no-store"});
  if(!response.ok)return NextResponse.json({error:"Şifre güncellenemedi. Yeni bir kurtarma bağlantısı isteyin."},{status:400});
  await logAdminAction(auth.config,auth.accessToken,auth.user.email,"password_reset","admin_user",auth.user.email,"Yönetici şifresi yenilendi");
  return NextResponse.json({ok:true,message:"Şifreniz oluşturuldu. Yeni şifrenizle giriş yapabilirsiniz."});
}
