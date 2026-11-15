// Mevcut müşteri hesabı ve dosya hizmeti aynı D1/KV üzerinde korunur.
export const dynamic = 'force-dynamic';
const backend = 'https://doku-9e5.pages.dev';

async function proxy(request: Request) {
  const source = new URL(request.url);
  if (!/^\/api\/(hesap|yonetim|dosya)\//.test(source.pathname)) {
    return Response.json({error: 'Bulunamadı.'}, {status: 404});
  }
  const target = new URL(source.pathname + source.search, backend);
  const headers = new Headers(request.headers);
  headers.delete('host');
  if (headers.get('origin') === source.origin) headers.set('origin', target.origin);
  const response = await fetch(new Request(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  }));
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Cache-Control', 'private, no-store');
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, {status: response.status, headers: responseHeaders});
}

export const GET = proxy;
export const POST = proxy;
