import vinextHandler from "vinext/server/fetch-handler";

type VinextEnvironment = Parameters<typeof vinextHandler.fetch>[1];
type VinextExecutionContext = Parameters<typeof vinextHandler.fetch>[2];
type BucurukEnvironment = VinextEnvironment & {
  ASSETS: {
    fetch(_input: Request): Promise<Response>;
  };
};

const BUNDLE_PREFIX = "/app-assets/_next/static/";
const MEDIA_PREFIX = "/media/";

const IMAGE_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function assetExtension(pathname: string) {
  const match = pathname.toLocaleLowerCase("en-US").match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function withProductionHeaders(request: Request, response: Response) {
  const pathname = new URL(request.url).pathname;
  const extension = assetExtension(pathname);
  const isFingerprintedBundle = pathname.includes("/_next/static/");
  const isCatalogImage = Boolean(IMAGE_TYPES[extension]);

  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");

  if (response.ok && isFingerprintedBundle) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (response.ok && isCatalogImage) {
    headers.set("Content-Type", IMAGE_TYPES[extension]);
    headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function assetRequest(request: Request, _pathname: string) {
  const sourceUrl = new URL(request.url);
  sourceUrl.pathname = _pathname;
  sourceUrl.search = "";
  return new Request(sourceUrl, request);
}

function mediaSourcePath(pathname: string) {
  if (!pathname.startsWith(MEDIA_PREFIX) || pathname.includes("%")) return null;

  const sourcePath = pathname.slice("/media".length);
  const segments = sourcePath.split("/").filter(Boolean);
  if (segments.length < 2 || !["products", "assets"].includes(segments[0])) return null;
  if (segments.some((segment) => segment === "." || segment === ".." || !/^[A-Za-z0-9._-]+$/.test(segment))) return null;
  if (!IMAGE_TYPES[assetExtension(sourcePath)]) return null;

  return sourcePath;
}

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "GET, HEAD" },
  });
}

export default {
  async fetch(request: Request, env: BucurukEnvironment, ctx: VinextExecutionContext) {
    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith(BUNDLE_PREFIX)) {
      if (request.method !== "GET" && request.method !== "HEAD") return methodNotAllowed();
      const sourcePath = pathname.slice("/app-assets".length);
      const response = await env.ASSETS.fetch(assetRequest(request, sourcePath));
      return withProductionHeaders(request, response);
    }

    const mediaPath = mediaSourcePath(pathname);
    if (mediaPath) {
      if (request.method !== "GET" && request.method !== "HEAD") return methodNotAllowed();
      const response = await env.ASSETS.fetch(assetRequest(request, mediaPath));
      return withProductionHeaders(request, response);
    }

    const response = await vinextHandler.fetch(request, env, ctx);
    return withProductionHeaders(request, response);
  },
};
