import { assertSameSiteRequest } from "./auth/isolation.server";
import { getSql } from "./db";
import { getProduct } from "./products";

export async function saveScentResult(input: {
  id: string;
  email?: string;
  answers: Record<string, string | number>;
  skus: string[];
}) {
  assertSameSiteRequest();
  const sql = await getSql();
  const email = input.email?.trim().toLowerCase() ?? null;
  await sql`
    insert into scent_results (id, email, answers, skus)
    values (${input.id}, ${email}, ${JSON.stringify(input.answers)}::jsonb, ${input.skus})
    on conflict (id) do update
    set email = coalesce(excluded.email, scent_results.email),
        answers = excluded.answers,
        skus = excluded.skus
  `;
  if (!email) return { ok: true as const };
  const names = input.skus.map((sku) => getProduct(sku)?.name ?? sku);
  const subject = `Koku testi ${input.id}`;
  const body = `Koku testi ${input.id}. ${names.join(", ")}.`;
  await sql`
    insert into scent_mail (id, to_email, subject, body, status)
    values (${input.id}, ${email}, ${subject}, ${body}, 'held')
    on conflict (id) do update
    set to_email = excluded.to_email, subject = excluded.subject, body = excluded.body, status = 'held'
  `;
  return { ok: true as const };
}
