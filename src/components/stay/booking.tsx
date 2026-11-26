import { useEffect, useMemo, useState, type FormEvent } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { fr } from "date-fns/locale";
import { enGB } from "date-fns/locale/en-GB";
import { nl } from "date-fns/locale/nl";
import { de } from "date-fns/locale/de";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import "react-day-picker/style.css";
import type { Property } from "@/data/property";
import { euro, formatRange, fromKey, occupiedNights, quoteStay, startOfToday, toKey } from "@/lib/dates";
import { useStay } from "@/lib/stay-store";
import { CONTENT, localeOf, t, useLang } from "@/lib/i18n";

const CAL = { fr, en: enGB, nl, de } as const;

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return narrow;
}

export function BookingSection({ property }: { property: Property }) {
  const bookings = useStay((s) => s.bookings);
  const blocked = useStay((s) => s.blocked);
  const addBooking = useStay((s) => s.addBooking);
  const taken = useMemo(() => occupiedNights(bookings, blocked), [bookings, blocked]);
  const takenDates = useMemo(() => [...taken].map(fromKey), [taken]);
  const narrow = useIsNarrow();
  const { lang } = useLang();
  const copy = CONTENT[lang];

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sentId, setSentId] = useState<string | null>(null);

  const checkIn = range?.from ? toKey(range.from) : null;
  const checkOut = range?.to ? toKey(range.to) : null;
  const guestCount = Math.min(Math.max(guests, 1), property.maxGuests);
  const adultCount = Math.min(Math.max(adults, 0), guestCount);
  const priced = quoteStay(property, checkIn, checkOut, taken, adultCount);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!priced.ok || !checkIn || !checkOut) return;
    if (name.trim().length < 2) {
      toast(t(lang, "toastName"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast(t(lang, "toastEmail"));
      return;
    }
    const id = addBooking({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      checkIn,
      checkOut,
      guests: guestCount,
      total: priced.total,
    });
    setSentId(id);
    toast(t(lang, "toastSaved"));
  }

  const mailto = property.hostEmail
    ? `mailto:${property.hostEmail}?subject=${encodeURIComponent(
        `Demande — ${property.name} — ${checkIn ?? ""}`,
      )}&body=${encodeURIComponent(
        [
          `Bonjour ${property.hostName},`,
          "",
          `Je souhaite réserver ${property.name}.`,
          checkIn && checkOut ? `Dates : ${formatRange(checkIn, checkOut)}` : "",
          priced.ok ? `Voyageurs : ${guestCount}, dont ${adultCount} adulte${adultCount > 1 ? "s" : ""}` : "",
          priced.ok ? `Total estimé : ${euro(priced.total)} (taxe de séjour incluse)` : "",
          `Nom : ${name}`,
          `E-mail : ${email}`,
          phone ? `Téléphone : ${phone}` : "",
          message ? `Message : ${message}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      )}`
    : null;

  return (
    <section id="reserver" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_0.8fr] md:py-24">
        <div>
          <p className="eyebrow">{t(lang, "avail")}</p>
          <h2 className="mt-3 font-display text-4xl leading-display text-balance text-ink md:text-5xl">
            {t(lang, "choose")}
          </h2>
          <p className="mt-4 max-w-lg text-muted">{t(lang, "takenNote", { host: property.hostName })}</p>
          <div className="stay-cal mt-8 overflow-x-auto">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={CAL[lang]}
              weekStartsOn={1}
              numberOfMonths={narrow ? 1 : 2}
              disabled={{ before: startOfToday() }}
              modifiers={{ taken: takenDates }}
              modifiersClassNames={{ taken: "is-taken" }}
              excludeDisabled
              startMonth={startOfToday()}
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <span className="inline-block w-8 border-t border-muted" />
            {t(lang, "taken")}
          </p>
        </div>

        <aside className="h-fit border border-line bg-surface p-6 md:sticky md:top-24">
          <p className="font-display text-4xl tabular-nums leading-none text-ink">
            {euro(property.price)}
            <span className="ml-2 font-sans text-sm font-normal text-muted">{t(lang, "night")}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {t(lang, "cleaning")} {euro(property.cleaning)} · {t(lang, "taxLine")} {euro(property.touristTax)}{" "}
            {t(lang, "adultNight")} {property.minNights} {t(lang, "minNights")}
          </p>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm text-muted">{t(lang, "dates")}</p>
            <p className="mt-1 text-ink">
              {checkIn && checkOut
                ? formatRange(checkIn, checkOut, localeOf(lang))
                : t(lang, "pickDates")}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <p className="text-sm text-ink">{t(lang, "guests")}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-ghost size-11 px-0"
                aria-label={t(lang, "fewerGuests")}
                onClick={() => setGuests((n) => Math.max(1, n - 1))}
                disabled={guestCount <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center tabular-nums">{guestCount}</span>
              <button
                type="button"
                className="btn-ghost size-11 px-0"
                aria-label={t(lang, "moreGuests")}
                onClick={() => setGuests((n) => Math.min(property.maxGuests, n + 1))}
                disabled={guestCount >= property.maxGuests}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <p className="text-sm text-ink">{t(lang, "adults")}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-ghost size-11 px-0"
                aria-label={t(lang, "fewerAdults")}
                onClick={() => setAdults((n) => Math.max(0, n - 1))}
                disabled={adultCount <= 0}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center tabular-nums">{adultCount}</span>
              <button
                type="button"
                className="btn-ghost size-11 px-0"
                aria-label={t(lang, "moreAdults")}
                onClick={() => setAdults((n) => Math.min(guestCount, n + 1))}
                disabled={adultCount >= guestCount}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">{t(lang, "minors")}</p>

          <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            {priced.ok ? (
              <>
                <Row
                  label={`${priced.nights} ${priced.nights > 1 ? t(lang, "nightsWordP") : t(lang, "nightsWord")} × ${euro(property.price)}`}
                  value={euro(priced.stay)}
                />
                <Row label={t(lang, "cleaning")} value={euro(property.cleaning)} />
                <Row
                  label={`${t(lang, "touristTax")} · ${adultCount} ${adultCount > 1 ? t(lang, "adultsP") : t(lang, "adult")}`}
                  value={euro(priced.tax)}
                />
                <Row label={t(lang, "total")} value={euro(priced.total)} strong />
              </>
            ) : (
              <p className="text-muted">
                {copy.reasons[priced.reason].replace("{n}", String(priced.n ?? ""))}
              </p>
            )}
          </div>

          {sentId ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-display text-2xl text-ink">{t(lang, "sent")}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(lang, "sentBody", { host: property.hostName })}
              </p>
              {mailto ? (
                <a className="btn mt-4 w-full" href={mailto}>
                  {t(lang, "sendEmail")} {property.hostName}
                </a>
              ) : null}
              <button
                type="button"
                className="btn-ghost mt-3 w-full"
                onClick={() => {
                  setSentId(null);
                  setRange(undefined);
                  setMessage("");
                }}
              >
                {t(lang, "another")}
              </button>
            </div>
          ) : (
            <form className="mt-6 space-y-3 border-t border-line pt-5" onSubmit={submit}>
              <label className="block text-sm">
                {t(lang, "name")}
                <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </label>
              <label className="block text-sm">
                {t(lang, "email")}
                <input
                  className="field mt-1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="block text-sm">
                {t(lang, "phone")} <span className="text-muted">{t(lang, "optional")}</span>
                <input className="field mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </label>
              <label className="block text-sm">
                {t(lang, "message")}
                <textarea
                  className="field mt-1 min-h-24"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t(lang, "messagePh")}
                />
              </label>
              <button type="submit" className="btn w-full" disabled={!priced.ok}>
                {t(lang, "askDates")}
              </button>
              <p className="text-xs leading-relaxed text-muted">
                {t(lang, "noPay", { host: property.hostName })}{" "}
                <a className="underline underline-offset-2" href="/conditions">
                  {t(lang, "conditionsLink")}
                </a>
                .
              </p>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className={`flex items-baseline justify-between gap-4 ${strong ? "pt-2 text-base text-ink" : "text-muted"}`}>
      <span>{label}</span>
      <span className={`tabular-nums ${strong ? "font-medium text-ink" : "text-ink"}`}>{value}</span>
    </p>
  );
}

