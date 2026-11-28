import { useEffect, useState } from "react";
import { PHOTO_SLOTS } from "@/data/property";
import { euro } from "@/lib/dates";
import { useStay } from "@/lib/stay-store";
import { AMENITY_ICONS } from "@/components/stay/icons";
import { SiteFooter, SiteHeader, MobileBookBar } from "@/components/stay/chrome";
import { Gallery } from "@/components/stay/gallery";
import { BookingSection } from "@/components/stay/booking";
import { CONTENT, t, useLang } from "@/lib/i18n";

export function HomePage() {
  const property = useStay((s) => s.property);
  const photos = useStay((s) => s.photos);
  const extraPhotos = useStay((s) => s.extraPhotos);
  const { lang } = useLang();
  const copy = CONTENT[lang];
  const hero = photos[PHOTO_SLOTS[0]?.id ?? ""] || PHOTO_SLOTS[0]?.src;
  const story = lang === "fr" ? property.story : copy.story;
  const tagline = lang === "fr" ? property.tagline : copy.tagline;
  const access = lang === "fr" ? property.access : copy.access;
  const paragraphs = story.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    document.title = `${property.name} — ${property.place}`;
  }, [property.name, property.place]);

  return (
    <div className="bg-bg text-ink">
      <SiteHeader property={property} />
      <main className="pb-24 md:pb-0">
        <section>
          {hero ? (
            <img
              src={hero}
              alt={PHOTO_SLOTS[0]?.alt ?? property.name}
              className="aspect-hero max-h-[78vh] w-full object-cover"
            />
          ) : null}
          <div className="border-b border-line">
            <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[1.4fr_0.7fr] md:items-end md:py-10">
              <div>
                <p className="eyebrow">
                  {property.place} · {property.region}
                </p>
                <h1 className="mt-2 font-display text-5xl leading-display text-balance text-ink md:text-6xl">
                  {property.name}
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty text-ink">{tagline}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{t(lang, "pitch")}</p>
              </div>
              <p className="font-display text-4xl tabular-nums leading-none text-ink md:text-right">
                {euro(property.price)}
                <span className="mt-2 block font-sans text-sm font-normal text-muted md:mt-1">
                  {t(lang, "perNight")} {euro(property.cleaning)} · {t(lang, "taxExtra")}
                </span>
                <span className="mt-2 block font-sans text-sm font-normal text-ink md:mt-1">{t(lang, "yearRound")}</span>
              </p>
            </div>
          </div>
        </section>

        <Gallery photos={photos} extraPhotos={extraPhotos} />

        <section id="maison" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-14 md:grid-cols-[1.25fr_0.75fr] md:gap-20">
            <div>
              <p className="eyebrow">{t(lang, "theHouse")}</p>
              <div className="mt-4 space-y-5 text-lg leading-relaxed text-pretty">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "font-display text-3xl leading-snug text-ink" : "text-muted"}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5">
                <Fact k={t(lang, "guests")} v={String(property.maxGuests)} />
                <Fact k={t(lang, "bedrooms")} v={String(property.bedrooms)} />
                <Fact k={t(lang, "baths")} v={String(property.baths)} />
                <Fact k={t(lang, "surface")} v={`${property.surface} m²`} />
                <Fact k={t(lang, "arrival")} v={property.checkInHour} />
                <Fact k={t(lang, "departure")} v={property.checkOutHour} />
              </dl>
              <ul className="space-y-4 border-t border-line pt-5">
                {(lang === "fr" ? property.sleeps : copy.sleeps).map((room) => (
                  <li key={room.id}>
                    <p className="font-medium">{room.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{room.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="mt-16 grid sm:grid-cols-2 md:gap-x-16">
            {property.amenities.map((item) => {
              const Icon = AMENITY_ICONS[item.icon] ?? AMENITY_ICONS.key;
              return (
                <li key={item.id} className="flex items-center gap-3 border-t border-line py-3.5">
                  <Icon className="size-5 shrink-0 text-olive" strokeWidth={1.5} aria-hidden />
                  <span>{lang === "fr" ? item.label : (copy.amenities[item.id] ?? item.label)}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="saisons" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <p className="eyebrow">{t(lang, "seasons")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-display text-ink">{t(lang, "seasonsTitle")}</h2>
            <p className="mt-4 max-w-xl text-muted">{t(lang, "seasonsIntro")}</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {[
                { key: "spring", src: "/photos/34.jpg", alt: "Jardin" },
                { key: "summer", src: "/photos/01.jpg", alt: "Piscine" },
                { key: "autumn", src: "/photos/automne.jpg", alt: "Vue d’automne depuis la terrasse" },
                { key: "winter", src: "/photos/42.jpg", alt: "La vue, en hiver" },
              ].map((season) => (
                <figure key={season.key} className="border-t border-line pt-4">
                  <img src={season.src} alt={season.alt} className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="mt-3">
                    <p className="font-medium">{t(lang, season.key)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t(lang, `${season.key}Text`)}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <BookingSection property={property} />

        <section id="avis" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <p className="eyebrow">{t(lang, "reviews")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-display text-ink">
              {t(lang, "whatGuests")}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{t(lang, "ratings")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="btn"
                href="https://www.airbnb.fr/rooms/1132067670763466321"
                target="_blank"
                rel="noreferrer"
              >
                {t(lang, "readAirbnb")}
              </a>
              <a
                className="btn-ghost"
                href="https://www.booking.com/hotel/fr/villa-bellevue-mailly-le-chateau.fr.html"
                target="_blank"
                rel="noreferrer"
              >
                {t(lang, "readBooking")}
              </a>
            </div>
            {property.reviews.length > 0 ? (
              <div className="mt-14 grid gap-10 md:grid-cols-3">
                {property.reviews.map((review) => {
                  const shown = lang === "fr" ? review : copy.review;
                  return (
                    <figure key={review.id} className="border-t border-line pt-5">
                      <blockquote className="font-display text-2xl leading-snug text-balance text-ink">
                        « {shown.text || review.text} »
                      </blockquote>
                      <figcaption className="mt-4 text-sm text-muted">
                        {shown.name || review.name}
                        <span className="mt-1 block">{shown.meta || review.meta}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            ) : null}
            <ReviewForm hostEmail={property.hostEmail} hostName={property.hostName} />
          </div>
        </section>

        <ContactSection hostEmail={property.hostEmail} hostName={property.hostName} />

        <section id="hote-presentation" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-[200px_1fr] md:py-24">
            {property.hostPhoto ? (
              <img src={property.hostPhoto} alt={property.hostName} className="aspect-square w-48 object-cover" />
            ) : (
              <div className="flex aspect-square w-48 items-center justify-center bg-surface text-sm text-muted">Photo</div>
            )}
            <div>
              <p className="eyebrow">Votre hôte</p>
              <h2 className="mt-3 font-display text-4xl leading-display text-ink">Faire connaissance avec {property.hostName}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">{property.hostBio}</p>
              <button type="button" className="btn mt-6" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contacter {property.hostName}
              </button>
            </div>
          </div>
        </section>

        <section id="infos" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-3 md:py-24">
            <div>
              <p className="eyebrow">{t(lang, "arrivalEyebrow")}</p>
              <p className="mt-3 leading-relaxed text-pretty">
                {t(lang, "arrivalText", { in: property.checkInHour, out: property.checkOutHour })}
              </p>
              <p className="mt-4 text-sm text-muted">{property.address}</p>
              <a
                className="mt-4 inline-block text-sm underline decoration-line underline-offset-4"
                href={property.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t(lang, "openMap")}
              </a>
            </div>
            <div>
              <p className="eyebrow">{t(lang, "access")}</p>
              <p className="mt-3 leading-relaxed text-pretty text-muted">{access}</p>
            </div>
            <div>
              <p className="eyebrow">{t(lang, "rules")}</p>
              <ul className="mt-3 space-y-2">
                {(lang === "fr" ? property.rules : copy.rules).filter(Boolean).map((rule) => (
                  <li key={rule} className="border-t border-line py-2 text-sm">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {property.faq.length > 0 ? (
            <div className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
              <p className="eyebrow">{t(lang, "questions")}</p>
              <div className="mt-4">
                {(lang === "fr" ? property.faq : copy.faq).map((item) => (
                  <details key={item.id} className="group border-t border-line py-4">
                    <summary className="flex items-center justify-between gap-4 text-base font-medium">
                      {item.q}
                      <span className="text-muted group-open:hidden" aria-hidden>
                        +
                      </span>
                      <span className="hidden text-muted group-open:inline" aria-hidden>
                        –
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <SiteFooter property={property} />
      <MobileBookBar property={property} />
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-eyebrow text-muted">{k}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums text-ink">{v}</dd>
    </div>
  );
}

function ContactSection({ hostEmail, hostName }: { hostEmail: string; hostName: string }) {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const mailto =
    hostEmail && name.trim() && email.trim() && text.trim()
      ? `mailto:${hostEmail}?subject=${encodeURIComponent(`Message Villa Bellevue — ${name.trim()}`)}&body=${encodeURIComponent(
          [`Nom : ${name.trim()}`, `E-mail : ${email.trim()}`, "", text.trim()].join("\n"),
        )}`
      : null;

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="eyebrow">{t(lang, "contact")}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl leading-display text-ink">
          {lang === "fr" ? "Une question avant de réserver ?" : lang === "de" ? "Eine Frage vor der Buchung?" : lang === "nl" ? "Een vraag voor het boeken?" : "A question before booking?"}
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          {lang === "fr"
            ? `${hostName} répond directement. Rien n’est réservé tant que vous n’envoyez pas de demande de dates.`
            : lang === "de"
              ? `${hostName} antwortet direkt.`
              : lang === "nl"
                ? `${hostName} antwoordt direct.`
                : `${hostName} replies directly. Nothing is booked until you send a date request.`}
        </p>
        <form
          className="mt-8 max-w-xl space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (mailto) window.location.href = mailto;
          }}
        >
          <label className="block text-sm">
            {t(lang, "name")}
            <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </label>
          <label className="block text-sm">
            {t(lang, "email")}
            <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="block text-sm">
            {t(lang, "message")}
            <textarea className="field mt-1 min-h-28" value={text} onChange={(e) => setText(e.target.value)} required />
          </label>
          <button type="submit" className="btn" disabled={!mailto}>
            {lang === "fr" ? "Envoyer le message" : lang === "de" ? "Nachricht senden" : lang === "nl" ? "Bericht versturen" : "Send message"}
          </button>
          <p className="text-xs text-muted">
            {hostEmail ? (lang === "fr" ? "Votre messagerie s’ouvre avec le message prêt à envoyer." : "Your email app opens with the message ready.") : `E-mail de ${hostName} à renseigner.`}
          </p>
        </form>
      </div>
    </section>
  );
}

function ReviewForm({ hostEmail, hostName }: { hostEmail: string; hostName: string }) {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [when, setWhen] = useState("");
  const [text, setText] = useState("");

  const mailto =
    hostEmail && name.trim() && text.trim()
      ? `mailto:${hostEmail}?subject=${encodeURIComponent(`Avis Villa Bellevue — ${name.trim()}`)}&body=${encodeURIComponent(
          [`Nom : ${name.trim()}`, when.trim() ? `Séjour : ${when.trim()}` : "", "", text.trim()].filter(Boolean).join("\n"),
        )}`
      : null;

  return (
    <form
      className="mt-16 max-w-xl border-t border-line pt-10"
      onSubmit={(e) => {
        e.preventDefault();
        if (mailto) window.location.href = mailto;
      }}
    >
      <p className="eyebrow">{t(lang, "leaveReview")}</p>
      <p className="mt-3 max-w-md text-muted">{t(lang, "leaveIntro")}</p>
      <div className="mt-6 space-y-3">
        <label className="block text-sm">
          {t(lang, "name")}
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </label>
        <label className="block text-sm">
          {t(lang, "stayWhen")}
          <input
            className="field mt-1"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder={t(lang, "stayWhenPh")}
          />
        </label>
        <label className="block text-sm">
          {t(lang, "yourReview")}
          <textarea
            className="field mt-1 min-h-28"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn" disabled={!mailto}>
          {t(lang, "sendReview")}
        </button>
        <p className="text-xs text-muted">
          {hostEmail ? t(lang, "reviewSent") : `E-mail de ${hostName} à renseigner.`}
        </p>
      </div>
    </form>
  );
}

