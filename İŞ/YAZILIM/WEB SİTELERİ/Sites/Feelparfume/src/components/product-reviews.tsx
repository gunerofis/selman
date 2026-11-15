import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { SEASONS } from "@/lib/perfume";
import { reviewInput } from "@/lib/reviews-input";
import { ratingSummary, type PublicReview } from "@/lib/reviews";
import { submitProductReview } from "@/lib/reviews-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Score({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm">{label}</legend>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${label} ${n}`}
            className={cn(
              "size-11 border font-mono text-sm",
              value === n ? "border-fg bg-fg text-bg-elevated" : "border-border-strong",
            )}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductReviews({ sku, reviews }: { sku: string; reviews: PublicReview[] }) {
  const router = useRouter();
  const summary = ratingSummary(reviews.map((review) => review.rating));
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [longevity, setLongevity] = useState(0);
  const [sillage, setSillage] = useState(0);
  const [season, setSeason] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl">Yorum</h2>
        {summary ? (
          <p className="font-mono text-sm tabular-nums" aria-label={`${summary.rating} / 5, ${summary.count}`}>
            {summary.rating.toLocaleString("tr-TR")} · {summary.count}
          </p>
        ) : null}
      </div>
      {reviews.length ? (
        <ul className="mt-6 divide-y divide-solid divide-border border-y border-solid border-border">
          {reviews.map((review) => (
            <li key={review.id} className="py-4">
              <p className="font-mono text-xs text-fg-muted">
                {review.author} · {review.rating}/5 · Kalıcılık {review.longevity} · Yayılım {review.sillage} ·{" "}
                {SEASONS.find((item) => item.id === review.season)?.name}
              </p>
              {review.body ? <p className="mt-2 text-sm">{review.body}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {done ? (
        <p className="mt-6 text-sm">Kaydedildi</p>
      ) : (
        <form
          className="mt-6 grid max-w-xl gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = reviewInput.safeParse({
              orderId,
              email,
              sku,
              rating,
              longevity,
              sillage,
              season,
              body,
            });
            if (!parsed.success) {
              setError(parsed.error.issues[0]?.message ?? "Sipariş no geçersiz");
              return;
            }
            setError("");
            void submitProductReview({ data: parsed.data })
              .then(async () => {
                setDone(true);
                await router.invalidate();
              })
              .catch((reason: unknown) => {
                setError(reason instanceof Error ? reason.message : "Kayıt açılamadı.");
              });
          }}
        >
          <label className="text-sm">
            Sipariş no
            <Input className="mt-2" value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
          </label>
          <label className="text-sm">
            E-posta
            <Input
              className="mt-2"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <Score label="Puan" value={rating} onChange={setRating} />
          <Score label="Kalıcılık" value={longevity} onChange={setLongevity} />
          <Score label="Yayılım" value={sillage} onChange={setSillage} />
          <label className="text-sm">
            Mevsim
            <select
              className="mt-2 h-11 w-full border border-border-strong bg-bg px-3"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              required
            >
              <option value="">Seçin</option>
              {SEASONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Yorum
            <textarea
              className="mt-2 min-h-24 w-full border border-border-strong bg-bg-elevated px-3 py-2 text-sm"
              maxLength={280}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit">Gönder</Button>
        </form>
      )}
    </section>
  );
}
