/**
 * Maç yaşam döngüsü — sunucu otoritesi (shared contract).
 * - Uninitialized: state üretildi; `start()` bekleniyor.
 * - Running: tick ilerliyor; simülasyon burada bağlanacak.
 * - Ended: `result` dolu; tick genelde sabit kalır.
 */
export enum MatchPhase {
  Uninitialized = "uninitialized",
  Running = "running",
  Ended = "ended",
}
