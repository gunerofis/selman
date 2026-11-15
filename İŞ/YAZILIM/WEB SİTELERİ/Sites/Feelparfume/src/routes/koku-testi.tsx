import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, productsByNote, slugify } from "@/lib/products";
import { CatalogImg } from "@/components/catalog-img";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rankScents, SCENT_QUESTIONS, scentAnswer, type ScentAnswers } from "@/lib/scent-quiz";
import { saveScentResult } from "@/lib/scent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/koku-testi")({
  head: () =>
    pageHead({
      title: "Koku testi",
      description: "Koku testi.",
      path: "/koku-testi",
    }),
  component: Quiz,
});

const STORAGE_KEY = "sweb-scent";

type Saved = { id: string; answers: ScentAnswers; step: number };

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (!parsed?.id || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

function optionShot(key: string, value: string) {
  if (key === "kim" && value !== "hepsi") return PRODUCTS.find((product) => product.gender === value);
  if (key === "his") return PRODUCTS.find((product) => product.families?.includes(value as never));
  if (key === "mevsim") return PRODUCTS.find((product) => product.seasons?.includes(value as never));
  if (key === "nota") return productsByNote(slugify(value))[0];
  return undefined;
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ScentAnswers>({});
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [ready, setReady] = useState(false);
  const done = step >= SCENT_QUESTIONS.length;
  const results = useMemo(() => (done ? rankScents(PRODUCTS, answers) : []), [answers, done]);

  useEffect(() => {
    const saved = readSaved();
    if (saved) {
      setId(saved.id);
      setAnswers(saved.answers);
      setStep(saved.step);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !done || !id) return;
    const payload = { id, answers, step };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* the server row is the record */
    }
    void saveScentResult({
      data: { id, answers: answers as Required<ScentAnswers>, skus: results.map((product) => product.sku) },
    }).catch(() => undefined);
  }, [answers, done, id, ready, results]);

  const question = SCENT_QUESTIONS[step];
  const optionShots = question
    ? question.options.map(([value]) => optionShot(question.key, value))
    : [];
  const pictured = optionShots.some(Boolean);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
        Koku testi {done ? "" : `· ${step + 1}/${SCENT_QUESTIONS.length}`}
      </p>
      <div className="mt-4 flex gap-1" aria-hidden="true">
        {SCENT_QUESTIONS.map((item, index) => (
          <span key={item.key} className={cn("h-1 flex-1 rounded-full", index <= step ? "bg-fg" : "bg-border")} />
        ))}
      </div>
      {!done && question ? (
        <>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl">{question.title}</h1>
          <div className={cn("mt-8 grid gap-3", pictured ? "grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
            {question.options.map(([value, label], index) => {
              const shot = optionShots[index];
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const next = { ...answers, [question.key]: scentAnswer(question.key, value) };
                    setAnswers(next);
                    if (step + 1 >= SCENT_QUESTIONS.length && !id) setId(`SQ-${crypto.randomUUID()}`);
                    setStep((current) => current + 1);
                  }}
                  className={cn(
                    "overflow-hidden rounded-xl border text-left",
                    "border-border-strong bg-bg-elevated hover:border-fg",
                    pictured ? "" : "min-h-16 px-4 py-3 text-base",
                  )}
                >
                  {pictured ? (
                    shot ? (
                      <CatalogImg src={shot.image} alt="" className="aspect-[4/3] w-full bg-bg-wash object-contain p-3" />
                    ) : (
                      <span className="grid aspect-[4/3] place-items-center bg-bg-wash px-3 font-display text-2xl">{label}</span>
                    )
                  ) : null}
                  {pictured && shot ? <span className="block px-4 py-3 text-base">{label}</span> : null}
                  {pictured ? null : label}
                </button>
              );
            })}
          </div>
          {step > 0 ? (
            <button type="button" className="mt-6 text-sm text-fg-muted hover:text-fg" onClick={() => setStep((n) => n - 1)}>
              ← Geri
            </button>
          ) : null}
        </>
      ) : (
        <>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Size önerilerimiz</h1>
          {results.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-fg-muted">Ürün yok.</p>
          )}
          <form
            className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!id || sent) return;
              void saveScentResult({
                data: {
                  id,
                  email,
                  answers: answers as Required<ScentAnswers>,
                  skus: results.map((product) => product.sku),
                },
              })
                .then(() => {
                  setSent(true);
                  toast.success("Kaydedildi");
                })
                .catch(() => toast.error("Kayıt açılamadı."));
            }}
          >
            <label className="block flex-1 text-sm">
              E-posta
              <Input
                className="mt-2"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <Button type="submit" className="sm:self-end" disabled={sent}>
              Gönder
            </Button>
          </form>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/koleksiyon"
              search={{
                aile: answers.his,
                cinsiyet: answers.kim && answers.kim !== "hepsi" ? answers.kim : undefined,
              }}
            >
              <Button>Benzerlerini gör</Button>
            </Link>
            <Link to="/kesif-seti">
              <Button variant="outline">Keşif seti</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setStep(0);
                setId("");
                setEmail("");
                setSent(false);
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {
                  /* ignore */
                }
              }}
            >
              Testi yenile
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
