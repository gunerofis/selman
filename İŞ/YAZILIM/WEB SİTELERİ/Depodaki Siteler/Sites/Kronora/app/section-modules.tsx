import Link from "next/link";

export type ModuleCard = {
  number?: string;
  title: string;
  text: string;
  meta?: string;
};

export function EditorialHero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  panelTitle,
  panelText,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  panelTitle: string;
  panelText: string;
  stats?: Array<{ value: string; label: string }>;
}) {
  return (
    <section className="editorial-hero">
      <div className="editorial-hero-copy">
        <h1>{title}</h1>
        <p>{lead}</p>
        <div className="hero-actions">
          <Link className="button primary" href={primary.href}>{primary.label} →</Link>
          {secondary && <Link className="text-link" href={secondary.href}>{secondary.label}</Link>}
        </div>
      </div>
      <div className="editorial-hero-panel">
        <span className="panel-index">MONELUKS / {eyebrow}</span>
        <div className="panel-copy"><small>Bilgi</small><h2>{panelTitle}</h2><p>{panelText}</p></div>
      </div>
    </section>
  );
}

export function FeatureModule({ eyebrow, title, intro, cards }: { eyebrow: string; title: string; intro: string; cards: ModuleCard[] }) {
  return (
    <section className="module-section">
      <div className="module-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><p>{intro}</p></div>
      <div className="module-card-grid">{cards.map((card, index) => <article key={card.title}><span>{card.number || String(index + 1).padStart(2, "0")}</span><div><h3>{card.title}</h3><p>{card.text}</p>{card.meta && <small>{card.meta}</small>}</div></article>)}</div>
    </section>
  );
}

export function ProcessModule({ eyebrow, title, steps }: { eyebrow: string; title: string; steps: ModuleCard[] }) {
  return (
    <section className="process-module">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      <div className="process-list">{steps.map((step, index) => <article key={step.title}><b>{step.number || String(index + 1).padStart(2, "0")}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div>
    </section>
  );
}

export function QuoteModule({ quote, label }: { quote: string; label: string }) {
  return <section className="quote-module"><span>“</span><blockquote>{quote}</blockquote><p>{label}</p></section>;
}

export function FaqModule({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="faq-module">
      <div><p className="eyebrow">Merak edilenler</p><h2>Kısa cevaplar.</h2></div>
      <div>{items.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
    </section>
  );
}

export function PageCta({ eyebrow, title, text, href, label, secondary }: { eyebrow: string; title: string; text: string; href: string; label: string; secondary?: { href: string; label: string } }) {
  return (
    <section className="page-cta">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{text}</p></div>
      <div><Link className="button primary light-button" href={href}>{label} →</Link>{secondary && <Link className="text-link" href={secondary.href}>{secondary.label}</Link>}</div>
    </section>
  );
}
