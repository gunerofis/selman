import { NextResponse } from "next/server";
import { getDataConfig } from "../../../../lib/data-server";
import { authenticate } from "../../../../lib/admin-auth";
export const dynamic="force-dynamic";
export async function GET(request:Request) {
  const config=getDataConfig();
  const user=config?await authenticate(config,request):null;
  return NextResponse.json({configured:Boolean(config),authenticated:Boolean(user)},{headers:{"Cache-Control":"no-store"}});
}
