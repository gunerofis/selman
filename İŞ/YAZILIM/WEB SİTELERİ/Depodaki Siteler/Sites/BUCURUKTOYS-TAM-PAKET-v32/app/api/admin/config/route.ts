import { NextResponse } from "next/server";
import { getSupabaseConfig, getSupabaseSetupStatus } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSupabaseConfig();
  return NextResponse.json(
    config
      ? { configured: true }
      : { configured: false, setupFields: getSupabaseSetupStatus() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
