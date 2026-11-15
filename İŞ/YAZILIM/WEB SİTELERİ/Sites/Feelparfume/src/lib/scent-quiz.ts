import type { FamilyId, SeasonId } from "./perfume.ts";
import { allNotes, foldTr, type Product } from "./products.ts";

export type ScentAnswers = {
  kim?: "kadin" | "erkek" | "unisex" | "hepsi";
  his?: FamilyId;
  zaman?: "gunduz" | "aksam" | "hergun";
  guc?: 1 | 2 | 3;
  mevsim?: SeasonId;
  nota?: "Gül" | "Vanilya" | "Bergamot" | "Sedir" | "Misk";
};

export const SCENT_QUESTIONS = [
  {
    key: "kim",
    title: "Kimin için?",
    options: [
      ["kadin", "Kadın"],
      ["erkek", "Erkek"],
      ["unisex", "Unisex"],
      ["hepsi", "Fark etmez"],
    ],
  },
  {
    key: "his",
    title: "Hangisi size daha yakın?",
    options: [
      ["taze", "Narenciye, deniz, ferahlık"],
      ["ciceksi", "Gül, yasemin, çiçek bahçesi"],
      ["odunsu", "Sedir, vetiver, kuru odun"],
      ["gurme", "Vanilya, karamel, kahve"],
      ["amber", "Baharat, reçine, sıcaklık"],
      ["misk", "Temiz çamaşır, ten kokusu"],
    ],
  },
  {
    key: "zaman",
    title: "En çok ne zaman kullanacaksınız?",
    options: [
      ["gunduz", "Gündüz, sıcak havada"],
      ["aksam", "Akşam, soğuk havada"],
      ["hergun", "Her gün, her mevsim"],
    ],
  },
  {
    key: "guc",
    title: "Ne kadar belirgin olsun?",
    options: [
      ["1", "Hafif, yakından"],
      ["2", "Dengeli"],
      ["3", "Güçlü, iz bırakan"],
    ],
  },
  {
    key: "mevsim",
    title: "Hangi mevsim?",
    options: [
      ["ilkbahar", "İlkbahar"],
      ["yaz", "Yaz"],
      ["sonbahar", "Sonbahar"],
      ["kis", "Kış"],
    ],
  },
  {
    key: "nota",
    title: "Hangi nota?",
    options: [
      ["Gül", "Gül"],
      ["Vanilya", "Vanilya"],
      ["Bergamot", "Bergamot"],
      ["Sedir", "Sedir"],
      ["Misk", "Misk"],
    ],
  },
] as const;

export function scentAnswer(key: string, value: string): string | number {
  return key === "guc" ? Number(value) : value;
}

export function scentScore(product: Product, answers: ScentAnswers) {
  let score = 0;
  if (answers.kim && answers.kim !== "hepsi") {
    if (product.gender === answers.kim) score += 4;
    else if (product.gender === "unisex") score += 2;
    else score -= 6;
  }
  if (answers.his && product.families?.includes(answers.his)) score += 5;
  if (answers.zaman === "gunduz" && product.seasons?.some((x) => x === "yaz" || x === "ilkbahar")) score += 2;
  if (answers.zaman === "aksam" && product.seasons?.some((x) => x === "kis" || x === "sonbahar")) score += 2;
  if (answers.zaman === "hergun" && (product.seasons?.length ?? 0) >= 3) score += 2;
  if (answers.guc && product.sillage) {
    score += 2 - Math.abs(product.sillage - (answers.guc === 1 ? 2 : answers.guc === 2 ? 3 : 5));
  }
  if (answers.mevsim && product.seasons?.includes(answers.mevsim)) score += 3;
  if (answers.nota) {
    const needle = foldTr(answers.nota);
    if (allNotes(product).some((note) => foldTr(note).includes(needle))) score += 4;
  }
  return score;
}

export function rankScents(products: Product[], answers: ScentAnswers, limit = 3) {
  return products
    .filter((product) => product.category !== "hediye-seti")
    .map((product) => ({ product, score: scentScore(product, answers) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.product);
}
