const siteUrl = "https://www.bucuruktoys.com";

function getIndexNowKey() {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  return key !== "DOLDURULACAK" && /^[A-Za-z0-9-]{8,128}$/.test(key) ? key : "";
}

export function indexNowKey() {
  return getIndexNowKey();
}

export async function notifyIndexNow(paths: string[]) {
  const key = getIndexNowKey();
  if (!key) return false;
  const urlList = [...new Set(paths.map((path) => path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`))].slice(0, 10_000);
  if (!urlList.length) return false;
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key,
        keyLocation: `${siteUrl}/indexnow-key.txt`,
        urlList,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
