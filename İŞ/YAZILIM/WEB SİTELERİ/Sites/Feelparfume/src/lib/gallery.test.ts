import assert from "node:assert/strict";
import test from "node:test";
import { gallerySlides, isVideoSrc, normalizeCatalogMedia, sampleStillSet } from "./gallery.ts";

test("sample svg becomes bottle, box, and close-up", () => {
  const media = normalizeCatalogMedia("/samples/fp-001.svg", []);
  assert.deepEqual(media, sampleStillSet("FP-001"));
  assert.equal(media.image, "/samples/fp-001-sise.webp");
  assert.deepEqual(media.images, ["/samples/fp-001-kutu.webp", "/samples/fp-001-yakin.webp"]);
});

test("a real still and an extra clip stay put", () => {
  const media = normalizeCatalogMedia("/urunler/oud.webp", ["/urunler/oud-2.webp"]);
  assert.equal(media.image, "/urunler/oud.webp");
  assert.deepEqual(media.images, ["/urunler/oud-2.webp"]);
});

test("sample rows keep an added video after the three stills", () => {
  const slides = gallerySlides({
    name: "Gül Işığı",
    brand: "Maison Örnek",
    image: "/samples/fp-001.svg",
    images: ["/clips/gul.mp4"],
  });
  assert.deepEqual(
    slides.map((s) => s.label),
    ["şişe", "kutu", "yakın plan", "video"],
  );
  assert.equal(slides[0]?.alt, "Maison Örnek Gül Işığı, şişe");
  assert.equal(slides[3]?.kind, "video");
  assert.equal(isVideoSrc("/clips/gul.webm"), true);
  assert.equal(isVideoSrc("/samples/fp-001-sise.webp"), false);
});

test("unknown stills are not labeled as a box", () => {
  const slides = gallerySlides({
    name: "Oud",
    image: "/urunler/oud.webp",
    images: ["/urunler/oud-yan.webp"],
  });
  assert.equal(slides[1]?.label, "görsel");
  assert.equal(slides[1]?.alt, "Oud");
});
