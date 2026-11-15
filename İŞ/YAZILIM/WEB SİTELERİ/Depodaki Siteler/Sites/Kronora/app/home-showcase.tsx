"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_MAPS_URL, GOOGLE_REVIEWS } from "./lib/site-content";

export type HeroSlide = {
  title: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  action: string;
  secondaryHref: string;
  secondaryAction: string;
};

export type FamilySlide = {
  href: string;
  label: string;
  note: string;
  image: string;
};

export type ProductMatch = {
  choice: string;
  title: string;
  description: string;
  action: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type DetailSlide = {
  name: string;
  model: string;
  color: string;
  href: string;
  image: string;
};

function useAutoplay(length: number, delay: number) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % length), delay);
    return () => window.clearInterval(timer);
  }, [delay, length, paused]);

  const previous = useCallback(() => setActive((value) => (value - 1 + length) % length), [length]);
  const next = useCallback(() => setActive((value) => (value + 1) % length), [length]);
  return { active, setActive, setPaused, previous, next };
}

export function HomeHeroSlider({ slides }: { slides: HeroSlide[] }) {
  const carousel = useAutoplay(slides.length, 7000);
  const slide = slides[carousel.active];
  if (!slide) return null;

  return (
    <section
      className="showcase-slider"
      aria-roledescription="carousel"
      aria-label="Moneluks vitrin"
      onMouseEnter={() => carousel.setPaused(true)}
      onMouseLeave={() => carousel.setPaused(false)}
      onFocusCapture={() => carousel.setPaused(true)}
      onBlurCapture={() => carousel.setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") carousel.previous();
        if (event.key === "ArrowRight") carousel.next();
      }}
    >
      <article className="showcase-slide" key={carousel.active} aria-live="polite">
        <div className="showcase-copy">
          <h1>{slide.title}<em>{slide.accent}</em></h1>
          <p>{slide.description}</p>
          <div className="showcase-actions">
            <Link className="button primary" href={slide.href}>{slide.action}<span aria-hidden="true">→</span></Link>
            <Link className="text-link" href={slide.secondaryHref}>{slide.secondaryAction}<span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="showcase-media">
          {slide.image && <img src={slide.image} alt={slide.imageAlt} fetchPriority={carousel.active === 0 ? "high" : "auto"} />}
        </div>
      </article>
      <div className="showcase-controls">
        <span>0{carousel.active + 1}</span>
        <div className="showcase-progress" aria-label="Slayt seçimi">
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === carousel.active ? "active" : ""}
              aria-label={`${index + 1}. slayta git`}
              aria-current={index === carousel.active ? "true" : undefined}
              onClick={() => carousel.setActive(index)}
            ><i></i></button>
          ))}
        </div>
        <span>0{slides.length}</span>
      </div>
      <div className="showcase-arrows">
        <button type="button" onClick={carousel.previous} aria-label="Önceki slayt">←</button>
        <button type="button" onClick={carousel.next} aria-label="Sonraki slayt">→</button>
      </div>
    </section>
  );
}

export function FamilyCarousel({ items }: { items: FamilySlide[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(430, window.innerWidth * 0.72), behavior: "smooth" });
  };

  return (
    <section className="collection-carousel" aria-labelledby="family-carousel-title">
      <div className="carousel-heading">
        <h2 id="family-carousel-title">Koleksiyonu Keşfet</h2>
        <div className="rail-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Kategorileri sola kaydır">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Kategorileri sağa kaydır">→</button>
        </div>
      </div>
      <div className="family-rail" ref={railRef} tabIndex={0} aria-label="Ürün aileleri">
        {items.map((item) => (
          <Link className="family-slide-card" href={item.href} key={item.href}>
            <div className="family-slide-image">{item.image && <img src={item.image} alt="" loading="lazy" />}</div>
            <div><h3>{item.label}</h3><p>{item.note}</p><b aria-hidden="true">→</b></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProductMatchFinder({ items }: { items: ProductMatch[] }) {
  const [active, setActive] = useState(0);
  const match = items[active];
  if (!match) return null;

  return (
    <section className="product-match" aria-labelledby="product-match-title">
      <div className="product-match-intro">
        <h2 id="product-match-title">Size uyan düzeni bulun.</h2>
        <p>Ne saklamak istediğinizi seçin; doğru ürün ailesini ve kullanım biçimini birlikte eşleştirelim.</p>
        <div className="product-match-options" role="tablist" aria-label="Düzenleme ihtiyacı">
          {items.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === index}
              className={active === index ? "active" : ""}
              key={item.choice}
              onClick={() => setActive(index)}
            ><span>{String(index + 1).padStart(2, "0")}</span>{item.choice}</button>
          ))}
        </div>
      </div>
      <article className="product-match-result" role="tabpanel" key={match.choice}>
        <div className="product-match-media">{match.image ? <img src={match.image} alt={match.imageAlt} /> : null}</div>
        <div className="product-match-copy">
          <small>Önerimiz</small>
          <h3>{match.title}</h3>
          <p>{match.description}</p>
          <Link className="text-link" href={match.href}>{match.action}<span aria-hidden="true">→</span></Link>
        </div>
      </article>
    </section>
  );
}

export function ProductDetailSlider({ items }: { items: DetailSlide[] }) {
  const carousel = useAutoplay(items.length, 6200);
  const slide = items[carousel.active];
  if (!slide) return null;

  return (
    <section
      className="detail-slider"
      aria-labelledby="detail-slider-title"
      onMouseEnter={() => carousel.setPaused(true)}
      onMouseLeave={() => carousel.setPaused(false)}
      onFocusCapture={() => carousel.setPaused(true)}
      onBlurCapture={() => carousel.setPaused(false)}
    >
      <div className="detail-slider-heading">
        <div><h2 id="detail-slider-title">Detaylarda Moneluks.</h2><p>Kaplama, iç yüzey ve bölme düzenini farklı açılardan keşfedin.</p></div>
        <div className="detail-slider-arrows">
          <button type="button" onClick={carousel.previous} aria-label="Önceki ürün detayı">←</button>
          <button type="button" onClick={carousel.next} aria-label="Sonraki ürün detayı">→</button>
        </div>
      </div>
      <div className="detail-slider-stage" aria-live="polite">
        <Link className="detail-slider-media" href={slide.href} key={slide.image}>
          <img src={slide.image} alt={slide.name} loading="lazy" />
        </Link>
        <div className="detail-slider-copy">
          <span>{String(carousel.active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <p>{slide.model} · {slide.color}</p>
          <h3>{slide.name}</h3>
          <Link className="text-link" href={slide.href}>Ürünü yakından incele <span aria-hidden="true">→</span></Link>
          <div className="detail-slider-tabs" aria-label="Detay slaytı seçimi">
            {items.map((item, index) => (
              <button type="button" key={`${item.href}-${index}`} className={index === carousel.active ? "active" : ""} aria-label={`${index + 1}. detayı göster`} aria-current={index === carousel.active ? "true" : undefined} onClick={() => carousel.setActive(index)}><i></i></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GoogleReviewsSlider() {
  const carousel = useAutoplay(GOOGLE_REVIEWS.length, 7600);
  const review = GOOGLE_REVIEWS[carousel.active];

  return (
    <section
      className="google-reviews"
      aria-labelledby="google-reviews-title"
      onMouseEnter={() => carousel.setPaused(true)}
      onMouseLeave={() => carousel.setPaused(false)}
      onFocusCapture={() => carousel.setPaused(true)}
      onBlurCapture={() => carousel.setPaused(false)}
    >
      <div className="reviews-intro">
        <h2 id="google-reviews-title">Google’dan<br />gerçek deneyimler.</h2>
        <p>Üretici ekip Güner Ofis için paylaşılan Google yorumlarından kısa alıntılar.</p>
        <a className="text-link" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Tüm yorumları aç <span aria-hidden="true">↗</span></a>
      </div>
      <div className="review-stage">
        <div className="review-stars" aria-label="5 yıldız">★★★★★</div>
        <blockquote key={review.name}>“{review.text}”</blockquote>
        <div className="review-person"><b>{review.name}</b><small>Google yorumu</small></div>
        <div className="review-controls">
          <button type="button" onClick={carousel.previous} aria-label="Önceki yorum">←</button>
          <span>{String(carousel.active + 1).padStart(2, "0")} / {String(GOOGLE_REVIEWS.length).padStart(2, "0")}</span>
          <button type="button" onClick={carousel.next} aria-label="Sonraki yorum">→</button>
        </div>
      </div>
    </section>
  );
}
