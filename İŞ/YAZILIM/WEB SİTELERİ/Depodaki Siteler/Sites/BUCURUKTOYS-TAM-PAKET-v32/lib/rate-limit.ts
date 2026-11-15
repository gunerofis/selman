const requests = new Map<string, number[]>();

export function isRateLimited(request: Request, scope: string, limit = 8, windowMs = 60_000) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${scope}:${forwarded}`;
  const now = Date.now();
  const recent = (requests.get(key) ?? []).filter((time) => now - time < windowMs);
  recent.push(now);
  requests.set(key, recent);
  return recent.length > limit;
}
