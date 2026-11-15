export type MailEvent = "alindi" | "hazirlaniyor" | "kargoda" | "teslim";

export function mailEventFor(
  trigger: { type: "created" } | { type: "payment" } | { type: "shipping"; status: string },
): MailEvent | null {
  if (trigger.type === "created") return "alindi";
  if (trigger.type === "payment") return null;
  if (trigger.status === "preparing") return "hazirlaniyor";
  if (trigger.status === "shipped") return "kargoda";
  if (trigger.status === "delivered") return "teslim";
  return null;
}

export function orderMail(event: MailEvent, orderId: string, trackingUrl = "") {
  const subject = {
    alindi: `Sipariş alındı ${orderId}`,
    hazirlaniyor: `Sipariş hazırlanıyor ${orderId}`,
    kargoda: `Sipariş kargoda ${orderId}`,
    teslim: `Sipariş teslim ${orderId}`,
  }[event];
  const body = {
    alindi: `Sipariş ${orderId} alındı.`,
    hazirlaniyor: `Sipariş ${orderId} hazırlanıyor.`,
    kargoda: trackingUrl ? `Sipariş ${orderId} kargoda. ${trackingUrl}` : `Sipariş ${orderId} kargoda.`,
    teslim: `Sipariş ${orderId} teslim edildi.`,
  }[event];
  return { subject, body };
}

export function fulfillmentLabel(status: string) {
  if (status === "preparing") return "Hazırlanıyor";
  if (status === "shipped") return "Kargoda";
  if (status === "delivered") return "Teslim";
  if (status === "cancelled") return "İptal";
  return "Alındı";
}

export function paymentLabel(status: string) {
  if (status === "paid") return "Ödendi";
  if (status === "failed") return "Başarısız";
  if (status === "refunded") return "İade";
  if (status === "partially_refunded") return "Kısmi iade";
  return "Ödeme bekliyor";
}
