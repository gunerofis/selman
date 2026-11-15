import {clearCookie} from '../../../server/admin-auth.mjs';
export const dynamic = 'force-dynamic';
export function GET() {
  return new Response(null, {status: 302, headers: {Location: '/yonetim/giris/', 'Set-Cookie': clearCookie, 'Cache-Control': 'no-store'}});
}
