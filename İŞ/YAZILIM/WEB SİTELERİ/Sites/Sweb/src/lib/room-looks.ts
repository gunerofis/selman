import { getProduct, type CategoryId, type Product } from "./products";

const LOOKS: Record<CategoryId, { skus: string[]; note: string }> = {
  ofis: {
    skus: ["7101", "7033", "7112", "7080"],
    note: "Masa yüzeyi, şarj, kulaklık, dizüstü — espresso veya orman.",
  },
  banyo: {
    skus: ["7048", "7030", "7045", "7047"],
    note: "Lavabo kenarı, döner gövde, saç aleti, duvar rafı.",
  },
  makyaj: {
    skus: ["7028", "7036", "7075", "7074"],
    note: "Organizer, ruj kulesi, oje — krem ve kestane.",
  },
  mutfak: {
    skus: ["7043", "7029", "7076", "7041"],
    note: "Ekmek, baharat, sofra, evye — tezgâh sırası.",
  },
  gardrop: {
    skus: ["7002", "7012", "7083", "7050"],
    note: "Komodin, ayakkabı bankı, çanta rafı, kemer.",
  },
  giris: {
    skus: ["7015", "7051", "7032", "7081"],
    note: "Anahtar, pano, şemsiye, cüzdan.",
  },
  cocuk: {
    skus: ["7059", "7023"],
    note: "Çocuk kitap rafı ve kitaplık — erişilebilir yükseklik, yuvarlak köşe.",
  },
  yasam: {
    skus: ["7069", "7068", "7070", "7018"],
    note: "Fotoğraf tepsisi, oyun, dikiş, valet.",
  },
  arac: {
    skus: ["7003"],
    note: "Koltuk arkası tek parça; başka araç ürünü yok.",
  },
};

export function roomLook(id: CategoryId): { products: Product[]; note: string } {
  const look = LOOKS[id];
  const products = look.skus.map(getProduct).filter((p): p is Product => p != null);
  return { products, note: look.note };
}
