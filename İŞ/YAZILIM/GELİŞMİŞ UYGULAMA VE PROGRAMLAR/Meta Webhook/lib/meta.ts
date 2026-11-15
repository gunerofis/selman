import { env } from "cloudflare:workers";
export const config = () => env as unknown as Record<string, string> & { DB: D1Database };
export const allowed = new Set(["1370971856100820", "102837915272185", "17841407381659710", "17841404017792506", "2212216523042694", "1087473738739635", "990223030071354", "1624172661037741", "1461115522271205", "451814642741117", "1826818168629371", "464903674718973"]);
export async function digest(text: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))), b => b.toString(16).padStart(2, "0")).join("");
}
export async function equal(a: string, b: string) {
  const ah = await digest(a), bh = await digest(b);
  let diff = 0;
  for (let i = 0; i < ah.length; i++) diff |= ah.charCodeAt(i) ^ bh.charCodeAt(i);
  return diff === 0;
}
export function reply(text: string, status = 200) {
  return new Response(text, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
