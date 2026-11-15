/** Hafta içi 09.00–18.00, Europe/Istanbul. */
export function atelierOpenAt(date: Date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= 9 * 60 && minutes < 18 * 60;
}

/** Skip Saturday and Sunday. `days` counts weekdays after `from`. */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let left = Math.max(0, days);
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

function nextWorkday(from: Date) {
  const d = new Date(from.getTime());
  const minutes = d.getHours() * 60 + d.getMinutes();
  if (d.getDay() === 0 || d.getDay() === 6 || minutes >= 18 * 60) {
    do {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
    } while (d.getDay() === 0 || d.getDay() === 6);
  }
  return d;
}

export function shipWindow(from = new Date()) {
  const start = nextWorkday(from);
  return {
    earliest: addBusinessDays(start, 3),
    latest: addBusinessDays(start, 5),
  };
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Atölye 18.00 kesimi: açıkken bugün, değilse sonraki iş günü. */
export function processDay(from = new Date()) {
  return nextWorkday(from);
}

export function cutoffCopy(from = new Date()) {
  const day = processDay(from);
  if (sameCalendarDay(day, from)) return "18.00'a kadar bugün işleme alınır.";
  return `İşleme ${formatTrDay(day)} alınır.`;
}

export function formatTrDay(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function istanbulNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  const weekday = map.weekday;
  const closed = weekday === "Sat" || weekday === "Sun";
  const hour = Number(map.hour);
  const minute = Number(map.minute);
  const minutes = hour * 60 + minute;
  const open = !closed && minutes >= 9 * 60 && minutes < 18 * 60;
  return { open, closed, hour, minute };
}
