/**
 * 1v1 prototip başlangıç sabitleri — denge yakın, placeholder koordinatlar.
 * Gerçek oyun kuralları / tuning sonraki aşamalarda.
 */

export const PROTOTYPE_1V1_PLAYER_IDS = ["p0", "p1"] as const;

export type Prototype1v1PlayerSlot = (typeof PROTOTYPE_1V1_PLAYER_IDS)[number];

export const PROTOTYPE_1V1_ECONOMY = {
  /** Tek ana kaynak (oyuncu envanteri). */
  STARTING_PRIMARY_PER_PLAYER: 200,
  RESOURCE_NODE_AMOUNT: 450,
  MAIN_BASE_HP: 800,
  WORKER_HP: 45,
} as const;

export const PROTOTYPE_1V1_SLOTS = {
  WORKERS_PER_PLAYER: 3,
} as const;

/** Basit 200x200 mantıksal alan; görsel ölçek client’ta netleşecek. */
export const PROTOTYPE_1V1_MAP = {
  WIDTH: 200,
  HEIGHT: 200,
} as const;

/** Doğrudan toplama modeli (depo/üsse dönüş yok). */
export const PROTOTYPE_1V1_GATHER = {
  /** Her pulse’ta node’dan düşen ve oyuncuya eklenen miktar. */
  AMOUNT_PER_PULSE: 5,
  /** Ardışık pulse’lar arasında bekleme (tick). 1 = her simülasyon tick’inde bir pulse. */
  INTERVAL_TICKS: 1,
} as const;

/** Basit dairesel ayak izi — mesafe tabanlı çakışma için. */
export const PROTOTYPE_1V1_BUILD = {
  FOOTPRINT_RADIUS: 14,
  COST_DROP_OFF: 80,
  COST_PRODUCTION: 120,
  HP_DROP_OFF: 400,
  HP_PRODUCTION: 500,
} as const;

/** Anlık üretim (kuyruk/süre yok); maliyet ve başlangıç HP. */
export const PROTOTYPE_1V1_TRAIN = {
  COST_WORKER: 50,
  COST_MELEE: 30,
  COST_RANGED: 35,
  HP_WORKER: 45,
  HP_MELEE: 120,
  HP_RANGED: 90,
} as const;

/** Tick başına düz çizgi hareket; birim tipine göre küçük fark. */
export const PROTOTYPE_1V1_MOVE = {
  SPEED_WORKER: 5,
  SPEED_MELEE: 6,
  SPEED_RANGED: 5.5,
  ARRIVE_THRESHOLD: 0.5,
} as const;

/** Basit menzil / hasar / saldırı aralığı; Worker saldıramaz (sunucu reddeder). */
export const PROTOTYPE_1V1_COMBAT = {
  MELEE_RANGE: 18,
  MELEE_DAMAGE: 28,
  MELEE_ATTACK_INTERVAL_TICKS: 2,
  RANGED_RANGE: 42,
  RANGED_DAMAGE: 22,
  RANGED_ATTACK_INTERVAL_TICKS: 2,
} as const;
