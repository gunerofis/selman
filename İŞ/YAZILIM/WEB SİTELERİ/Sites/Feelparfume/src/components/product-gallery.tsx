import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CatalogImg } from "@/components/catalog-img";
import { trapTab } from "@/lib/focus";
import { videoMime, type GallerySlide } from "@/lib/gallery";
import { cn } from "@/lib/utils";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProductGallery({ slides, title }: { slides: GallerySlide[]; title: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const key = slides.map((s) => s.src).join("|");
  const frameClass =
    "mx-auto aspect-square w-full max-h-44 bg-bg object-contain sm:max-h-52 lg:max-h-[min(65vw,calc(100svh-22rem))]";

  useEffect(() => {
    setIndex(0);
    setZoom(null);
    scroller.current?.scrollTo({ left: 0 });
  }, [key]);

  function go(next: number) {
    const count = slides.length;
    if (count < 2) return;
    const i = (next + count) % count;
    const el = scroller.current;
    el?.scrollTo({
      left: i * el.clientWidth,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
    setIndex(i);
  }

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Ürün görselleri"
      className="block"
      data-gallery
      onKeyDown={(e) => {
        if (zoom != null) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-xl border border-solid border-border">
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.clientWidth === 0) return;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {slides.map((slide, i) => (
            <div key={slide.src} className="w-full shrink-0 grow-0 basis-full snap-start">
              {slide.kind === "video" ? (
                <video
                  className={frameClass}
                  controls
                  playsInline
                  preload={i === 0 ? "metadata" : "none"}
                  aria-label={slide.alt}
                >
                  <source src={slide.src} type={videoMime(slide.src)} />
                </video>
              ) : (
                <button
                  type="button"
                  className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-taba focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  aria-label={`${slide.alt}, büyüt`}
                  onClick={() => setZoom(i)}
                >
                  <CatalogImg
                    src={slide.src}
                    alt={slide.alt}
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={frameClass}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3">
            <GalleryStep label="Önceki görsel" onClick={() => go(index - 1)}>
              <ChevronLeft className="size-5" aria-hidden="true" />
            </GalleryStep>
            <GalleryStep label="Sonraki görsel" onClick={() => go(index + 1)}>
              <ChevronRight className="size-5" aria-hidden="true" />
            </GalleryStep>
          </div>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <div className="mt-3 hidden gap-2 sm:flex" role="tablist" aria-label="Görseller">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slide.label}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-md border border-solid bg-bg outline-none focus-visible:ring-2 focus-visible:ring-taba",
                i === index ? "border-fg" : "border-border",
              )}
              onClick={() => go(i)}
            >
              {slide.kind === "video" ? (
                <span className="font-mono text-[10px] text-fg">Video</span>
              ) : (
                <CatalogImg
                  src={slide.src}
                  alt=""
                  sizes="64px"
                  className="size-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
      {zoom != null && slides[zoom] ? (
        <ZoomDialog
          slides={slides}
          index={zoom}
          title={title}
          onIndex={(i) => setZoom(i)}
          onClose={() => setZoom(null)}
        />
      ) : null}
    </section>
  );
}

function GalleryStep({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="pointer-events-auto flex size-11 items-center justify-center rounded-md border border-solid border-border bg-bg/90 text-fg outline-none hover:border-fg focus-visible:ring-2 focus-visible:ring-taba"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ZoomDialog({
  slides,
  index,
  title,
  onIndex,
  onClose,
}: {
  slides: GallerySlide[];
  index: number;
  title: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const slide = slides[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const indexRef = useRef(index);
  const onIndexRef = useRef(onIndex);
  const onCloseRef = useRef(onClose);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  indexRef.current = index;
  onIndexRef.current = onIndex;
  onCloseRef.current = onClose;

  useEffect(() => {
    setScale(1);
    setOrigin("50% 50%");
  }, [index]);

  useEffect(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 20);
    const count = slides.length;
    const onKey = (e: KeyboardEvent) => {
      const i = indexRef.current;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndexRef.current((i + 1) % count);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndexRef.current((i - 1 + count) % count);
        return;
      }
      if (e.key === "Tab" && panelRef.current) trapTab(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [slides.length]);

  if (!slide) return null;
  const motion = "transition-transform duration-200 motion-reduce:transition-none";

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={slide.alt}
      data-print-hide
    >
      <button type="button" className="absolute inset-0" aria-label="Galeriyi kapat" onClick={onClose} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <p className="font-display text-xl text-fg-on-deep">{title}</p>
        <button
          ref={closeRef}
          type="button"
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center border border-solid border-fg-on-deep/30 text-fg-on-deep outline-none hover:border-fg-on-deep focus-visible:ring-2 focus-visible:ring-fg-on-deep"
          aria-label="Galeriyi kapat"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      {slide.kind === "video" ? (
        <video
          key={slide.src}
          className="relative z-10 max-h-[calc(100%-7rem)] max-w-full bg-bg object-contain"
          controls
          playsInline
          preload="metadata"
          aria-label={slide.alt}
        >
          <source src={slide.src} type={videoMime(slide.src)} />
        </video>
      ) : (
        <img
          src={slide.src}
          alt={slide.alt}
          width={1500}
          height={1500}
          className={cn("relative z-10 max-h-[calc(100%-7rem)] max-w-full object-contain", motion)}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: origin,
            cursor: scale > 1 ? "zoom-out" : "zoom-in",
          }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setOrigin(`${x}% ${y}%`);
            setScale((s) => (s === 1 ? 2.4 : 1));
          }}
        />
      )}
      {slides.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Önceki görsel"
            className="absolute top-1/2 left-3 z-20 flex size-11 -translate-y-1/2 items-center justify-center border border-solid border-fg-on-deep/30 text-fg-on-deep outline-none hover:border-fg-on-deep focus-visible:ring-2 focus-visible:ring-fg-on-deep"
            onClick={() => onIndex((index - 1 + slides.length) % slides.length)}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Sonraki görsel"
            className="absolute top-1/2 right-3 z-20 flex size-11 -translate-y-1/2 items-center justify-center border border-solid border-fg-on-deep/30 text-fg-on-deep outline-none hover:border-fg-on-deep focus-visible:ring-2 focus-visible:ring-fg-on-deep"
            onClick={() => onIndex((index + 1) % slides.length)}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}
