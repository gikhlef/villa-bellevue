import type { Booking, Property } from "@/data/property";

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function todayKey(): string {
  return toKey(startOfToday());
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Nights slept: [checkIn, checkOut). */
export function eachNight(checkIn: string, checkOut: string): string[] {
  const days: string[] = [];
  let cur = checkIn;
  let guard = 0;
  while (cur < checkOut && guard < 400) {
    days.push(cur);
    cur = addDays(cur, 1);
    guard += 1;
  }
  return days;
}

export function euro(n: number): string {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(n);
}

export function formatLong(key: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fromKey(key));
}

export function formatRange(checkIn: string, checkOut: string, locale = "fr-FR"): string {
  const a = fromKey(checkIn);
  const b = fromKey(checkOut);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) {
    const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(a);
    const rest = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(b);
    return `${day} – ${rest}`;
  }
  const left = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(a);
  const right = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(b);
  return `${left} – ${right}`;
}

export function occupiedNights(bookings: Booking[], blocked: string[]): Set<string> {
  const set = new Set<string>(blocked);
  for (const b of bookings) {
    if (b.status !== "confirmed") continue;
    for (const night of eachNight(b.checkIn, b.checkOut)) set.add(night);
  }
  return set;
}

export type Quote =
  | { ok: true; nights: number; stay: number; tax: number; total: number }
  | { ok: false; reason: "pick" | "order" | "past" | "min" | "taken"; n?: number };

export function quoteStay(
  property: Property,
  checkIn: string | null,
  checkOut: string | null,
  taken: Set<string>,
  adults = 1,
): Quote {
  if (!checkIn || !checkOut) return { ok: false, reason: "pick" };
  if (checkOut <= checkIn) return { ok: false, reason: "order" };
  if (checkIn < todayKey()) return { ok: false, reason: "past" };
  const nights = eachNight(checkIn, checkOut);
  if (nights.length < property.minNights) {
    return { ok: false, reason: "min", n: property.minNights };
  }
  if (nights.some((night) => taken.has(night))) {
    return { ok: false, reason: "taken" };
  }
  const stay = nights.length * property.price;
  const taxable = Math.max(0, Math.min(adults, property.maxGuests));
  const rate = property.touristTax ?? 1.6;
  const tax = Math.round(nights.length * taxable * rate * 100) / 100;
  return { ok: true, nights: nights.length, stay, tax, total: stay + property.cleaning + tax };
}

export function parseDateInput(text: string): string[] {
  const out: string[] = [];
  for (const rawLine of text.split(/\n+/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const range = line.match(/(\d{4}-\d{2}-\d{2})\s*(?:\.\.|→|–|-|au)\s*(\d{4}-\d{2}-\d{2})/);
    if (range?.[1] && range[2]) {
      let cur = range[1];
      const end = range[2];
      let guard = 0;
      const last = cur <= end ? end : cur;
      const first = cur <= end ? cur : end;
      cur = first;
      while (cur <= last && guard < 400) {
        out.push(cur);
        cur = addDays(cur, 1);
        guard += 1;
      }
      continue;
    }
    const singles = line.match(/\d{4}-\d{2}-\d{2}/g);
    if (singles) out.push(...singles);
  }
  return [...new Set(out)];
}

function icsDate(key: string): string {
  return key.replace(/-/g, "");
}

export function buildIcs(propertyName: string, bookings: Booking[], blocked: string[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Villa Bellevue//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const b of bookings) {
    if (b.status !== "confirmed") continue;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${b.id}@location`);
    lines.push(`DTSTART;VALUE=DATE:${icsDate(b.checkIn)}`);
    lines.push(`DTEND;VALUE=DATE:${icsDate(b.checkOut)}`);
    lines.push(`SUMMARY:${escapeIcs(b.name)} — ${escapeIcs(propertyName)}`);
    lines.push("END:VEVENT");
  }
  const sorted = [...new Set(blocked)].sort();
  let i = 0;
  while (i < sorted.length) {
    const start = sorted[i]!;
    let end = start;
    while (i + 1 < sorted.length && sorted[i + 1] === addDays(end, 1)) {
      i += 1;
      end = sorted[i]!;
    }
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:block-${icsDate(start)}@location`);
    lines.push(`DTSTART;VALUE=DATE:${icsDate(start)}`);
    lines.push(`DTEND;VALUE=DATE:${icsDate(addDays(end, 1))}`);
    lines.push(`SUMMARY:Indisponible — ${escapeIcs(propertyName)}`);
    lines.push("END:VEVENT");
    i += 1;
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function escapeIcs(value: string): string {
  return value.replace(/[,;\\]/g, " ").replace(/\n/g, " ");
}
