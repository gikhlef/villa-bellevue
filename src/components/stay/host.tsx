import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import "react-day-picker/style.css";
import { PHOTO_SLOTS, type Booking, type Property } from "@/data/property";
import {
  buildIcs,
  eachNight,
  euro,
  formatRange,
  fromKey,
  occupiedNights,
  parseDateInput,
  startOfToday,
  todayKey,
  toKey,
} from "@/lib/dates";
import { useStay } from "@/lib/stay-store";
import { SiteHeader } from "@/components/stay/chrome";

type Tab = "demandes" | "calendrier" | "maison" | "photos";

const TABS: { id: Tab; label: string }[] = [
  { id: "demandes", label: "Demandes" },
  { id: "calendrier", label: "Calendrier" },
  { id: "maison", label: "La maison" },
  { id: "photos", label: "Photos" },
];

const HOST_PASSWORD = "Villabellevue89@";
const SESSION_KEY = "bellevue-host-ok";

function PasswordGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setOk(true);
  }, []);

  if (ok) return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <SiteHeader property={useStay.getState().property} solid />
      <main className="mx-auto max-w-md px-5 py-20">
        <p className="eyebrow">Espace hôte</p>
        <h1 className="mt-2 font-display text-3xl">Accès réservé</h1>
        <p className="mt-3 text-muted">Entrez le mot de passe pour gérer la maison.</p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (value === HOST_PASSWORD) {
              sessionStorage.setItem(SESSION_KEY, "1");
              setOk(true);
            } else {
              setError(true);
            }
          }}
        >
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Mot de passe"
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            autoFocus
          />
          {error ? <p className="text-sm text-red-700">Mot de passe incorrect.</p> : null}
          <button type="submit" className="min-h-11 rounded-lg bg-olive text-white">
            Entrer
          </button>
        </form>
      </main>
    </div>
  );
}

export function HostPage() {
  const property = useStay((s) => s.property);
  const [tab, setTab] = useState<Tab>("demandes");
  const pending = useStay((s) => s.bookings.filter((b) => b.status === "pending").length);

  useEffect(() => {
    document.title = `Espace hôte — ${property.name}`;
  }, [property.name]);

  return (
    <PasswordGate>
      <div className="min-h-screen bg-bg text-ink">
        <SiteHeader property={property} solid />
        <main className="mx-auto max-w-6xl px-5 py-8 md:py-12">
          <p className="eyebrow">Espace hôte</p>
          <h1 className="mt-2 font-display text-4xl leading-display text-balance md:text-5xl">
            Gérez la maison sans vous perdre.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Textes, tarifs, photos, dates bloquées et demandes restent dans ce navigateur. Ajoutez votre e-mail
            pour que les voyageurs puissent vous écrire leur demande. Les avis et la maison d’exemple se
            remplacent ici — envoyez vos photos quand vous voulez, ou importez-les dans l’onglet Photos.
          </p>

          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-line">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`min-h-11 shrink-0 border-b-2 px-3 text-sm ${
                  tab === item.id ? "border-olive text-ink" : "border-transparent text-muted"
                }`}
              >
                {item.label}
                {item.id === "demandes" && pending > 0 ? (
                  <span className="ml-2 tabular-nums text-olive">{pending}</span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === "demandes" ? <Requests /> : null}
            {tab === "calendrier" ? <CalendarTab property={property} /> : null}
            {tab === "maison" ? <HouseForm /> : null}
            {tab === "photos" ? <PhotosForm /> : null}
          </div>
        </main>
      </div>
    </PasswordGate>
  );
}

function Requests() {
  const bookings = useStay((s) => s.bookings);
  const setBookingStatus = useStay((s) => s.setBookingStatus);
  const removeBooking = useStay((s) => s.removeBooking);
  const clearExamples = useStay((s) => s.clearExamples);
  const hasExamples = bookings.some((b) => b.example);

  if (bookings.length === 0) {
    return <p className="text-muted">Aucune demande pour l’instant. Elles apparaîtront ici.</p>;
  }

  return (
    <div className="space-y-4">
      {hasExamples ? (
        <button type="button" className="btn-ghost" onClick={clearExamples}>
          Retirer les exemples
        </button>
      ) : null}
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li key={booking.id} className="border border-line bg-surface p-5">
            <RequestCard
              booking={booking}
              onStatus={(status) => {
                const ok = setBookingStatus(booking.id, status);
                if (!ok) toast("Ces dates chevauchent un autre séjour.");
              }}
              onRemove={() => removeBooking(booking.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestCard({
  booking,
  onStatus,
  onRemove,
}: {
  booking: Booking;
  onStatus: (status: Booking["status"]) => void;
  onRemove: () => void;
}) {
  const nights = eachNight(booking.checkIn, booking.checkOut).length;
  const label =
    booking.status === "confirmed" ? "Confirmée" : booking.status === "declined" ? "Refusée" : "En attente";

  async function copy() {
    const text = [
      booking.name,
      booking.email,
      booking.phone,
      formatRange(booking.checkIn, booking.checkOut),
      `${booking.guests} voyageurs`,
      booking.total ? euro(booking.total) : "",
      booking.message,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast("Demande copiée.");
    } catch {
      toast("Impossible de copier.");
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <p className="text-xs uppercase tracking-eyebrow text-muted">
          {label}
          {booking.example ? " · exemple" : ""}
        </p>
        <p className="mt-1 font-display text-2xl text-ink">{booking.name}</p>
        <p className="mt-1 text-sm text-muted">
          {formatRange(booking.checkIn, booking.checkOut)} · {nights} nuit{nights > 1 ? "s" : ""}
          {booking.guests ? ` · ${booking.guests} voyageurs` : ""}
          {booking.total ? ` · ${euro(booking.total)}` : ""}
        </p>
        {booking.email ? <p className="mt-2 text-sm">{booking.email}</p> : null}
        {booking.phone ? <p className="text-sm text-muted">{booking.phone}</p> : null}
        {booking.message ? <p className="mt-3 max-w-xl text-sm leading-relaxed">{booking.message}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {booking.status !== "confirmed" ? (
          <button type="button" className="btn" onClick={() => onStatus("confirmed")}>
            Confirmer
          </button>
        ) : null}
        {booking.status !== "declined" ? (
          <button type="button" className="btn-ghost" onClick={() => onStatus("declined")}>
            Refuser
          </button>
        ) : null}
        {booking.status !== "pending" ? (
          <button type="button" className="btn-ghost" onClick={() => onStatus("pending")}>
            En attente
          </button>
        ) : null}
        <button type="button" className="btn-ghost" onClick={() => void copy()}>
          Copier
        </button>
        <button type="button" className="btn-ghost" onClick={onRemove}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

function CalendarTab({ property }: { property: Property }) {
  const bookings = useStay((s) => s.bookings);
  const blocked = useStay((s) => s.blocked);
  const toggleBlock = useStay((s) => s.toggleBlock);
  const addBlocked = useStay((s) => s.addBlocked);
  const clearBlocked = useStay((s) => s.clearBlocked);
  const [draft, setDraft] = useState("");
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const reserved = useMemo(() => {
    const set = occupiedNights(
      bookings.filter((b) => b.status === "confirmed"),
      [],
    );
    return set;
  }, [bookings]);

  function download() {
    const ics = buildIcs(property.name, bookings, blocked);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disponibilites.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
      <div className="stay-cal overflow-x-auto">
        <DayPicker
          mode="single"
          locale={fr}
          weekStartsOn={1}
          numberOfMonths={narrow ? 1 : 2}
          startMonth={startOfToday()}
          onDayClick={(date) => {
            const key = toKey(date);
            if (key < todayKey()) return;
            if (reserved.has(key)) {
              toast("Cette nuit est liée à un séjour confirmé.");
              return;
            }
            toggleBlock(key);
          }}
          modifiers={{
            blocked: blocked.map(fromKey),
            taken: [...reserved].map(fromKey),
          }}
          modifiersClassNames={{ blocked: "is-blocked", taken: "is-taken" }}
        />
        <p className="mt-4 text-sm text-muted">
          Cliquez un jour libre pour le fermer. Cliquez à nouveau pour le rouvrir. Les dates fermées apparaissent barrées sur le site.
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted">
          Pour plusieurs nuits d’un coup, collez une plage, par exemple{" "}
          <span className="text-ink">2026-12-20 au 2026-12-27</span>, ou une date par ligne.
        </p>
        <textarea
          className="field min-h-36 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={"2026-12-20 au 2026-12-27\n2027-02-14"}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const days = parseDateInput(draft);
              if (days.length === 0) {
                toast("Aucune date reconnue.");
                return;
              }
              addBlocked(days);
              setDraft("");
              toast(`${days.length} nuit${days.length > 1 ? "s" : ""} fermée${days.length > 1 ? "s" : ""}.`);
            }}
          >
            Fermer ces dates
          </button>
          <button type="button" className="btn-ghost" onClick={download}>
            Exporter .ics
          </button>
          <button type="button" className="btn-ghost" onClick={clearBlocked} disabled={blocked.length === 0}>
            Rouvrir les dates fermées
          </button>
        </div>
        <p className="text-sm text-muted tabular-nums">{blocked.length} nuit{blocked.length > 1 ? "s" : ""} fermée{blocked.length > 1 ? "s" : ""} à la main.</p>
      </div>
    </div>
  );
}

function HouseForm() {
  const property = useStay((s) => s.property);
  const update = useStay((s) => s.updateProperty);
  const resetAll = useStay((s) => s.resetAll);
  const [armed, setArmed] = useState(false);

  return (
    <form
      className="grid gap-8"
      onSubmit={(event) => {
        event.preventDefault();
        toast("Enregistré sur cet appareil.");
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom de la maison" value={property.name} onChange={(name) => update({ name })} />
        <Field label="Votre prénom" value={property.hostName} onChange={(hostName) => update({ hostName })} />
        <Field
          label="Votre e-mail"
          value={property.hostEmail}
          onChange={(hostEmail) => update({ hostEmail })}
          type="email"
          hint="Les voyageurs pourront vous envoyer leur demande."
        />
        <Field label="Village" value={property.place} onChange={(place) => update({ place })} />
        <Field label="Région" value={property.region} onChange={(region) => update({ region })} />
        <Field label="Adresse" value={property.address} onChange={(address) => update({ address })} />
      </div>
      <Field label="Phrase d’accroche" value={property.tagline} onChange={(tagline) => update({ tagline })} />
      <label className="block text-sm">
        Histoire
        <textarea className="field mt-1 min-h-48" value={property.story} onChange={(e) => update({ story: e.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Num label="Prix / nuit (€)" value={property.price} onChange={(price) => update({ price })} />
        <Num label="Ménage (€)" value={property.cleaning} onChange={(cleaning) => update({ cleaning })} />
        <Num label="Nuits minimum" value={property.minNights} min={1} onChange={(minNights) => update({ minNights })} />
        <Num label="Voyageurs max" value={property.maxGuests} min={1} onChange={(maxGuests) => update({ maxGuests })} />
        <Num label="Chambres" value={property.bedrooms} min={0} onChange={(bedrooms) => update({ bedrooms })} />
        <Num label="Salles de bain" value={property.baths} min={0} onChange={(baths) => update({ baths })} />
        <Num label="Surface (m²)" value={property.surface} min={0} onChange={(surface) => update({ surface })} />
        <Field label="Arrivée" value={property.checkInHour} onChange={(checkInHour) => update({ checkInHour })} />
        <Field label="Départ" value={property.checkOutHour} onChange={(checkOutHour) => update({ checkOutHour })} />
      </div>
      <label className="block text-sm">
        Accès
        <textarea className="field mt-1 min-h-24" value={property.access} onChange={(e) => update({ access: e.target.value })} />
      </label>
      <Field label="Lien de la carte" value={property.mapUrl} onChange={(mapUrl) => update({ mapUrl })} />

      <div>
        <p className="text-sm">Couchages</p>
        <div className="mt-3 space-y-3">
          {property.sleeps.map((room, index) => (
            <div key={room.id} className="grid gap-3 md:grid-cols-2">
              <input
                className="field"
                value={room.title}
                aria-label="Nom de la chambre"
                onChange={(e) => update({ sleeps: replaceAt(property.sleeps, index, { ...room, title: e.target.value }) })}
              />
              <input
                className="field"
                value={room.detail}
                aria-label="Détail de la chambre"
                onChange={(e) => update({ sleeps: replaceAt(property.sleeps, index, { ...room, detail: e.target.value }) })}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              update({
                sleeps: [...property.sleeps, { id: crypto.randomUUID(), title: "Chambre", detail: "" }],
              })
            }
          >
            Ajouter un couchage
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm">Équipements</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {property.amenities.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <input
                className="field"
                value={item.label}
                aria-label="Équipement"
                onChange={(e) =>
                  update({ amenities: replaceAt(property.amenities, index, { ...item, label: e.target.value }) })
                }
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => update({ amenities: property.amenities.filter((a) => a.id !== item.id) })}
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-ghost mt-3"
          onClick={() =>
            update({
              amenities: [...property.amenities, { id: crypto.randomUUID(), icon: "key", label: "Nouvel équipement" }],
            })
          }
        >
          Ajouter
        </button>
      </div>

      <label className="block text-sm">
        Règles, une par ligne
        <textarea
          className="field mt-1 min-h-32"
          value={property.rules.join("\n")}
          onChange={(e) => update({ rules: e.target.value.split("\n") })}
        />
      </label>

      <ListEditor
        title="Avis"
        items={property.reviews}
        onChange={(reviews) => update({ reviews })}
        blank={() => ({ id: crypto.randomUUID(), name: "", meta: "", text: "" })}
        fields={(item, on) => (
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="field" placeholder="Nom" value={item.name} onChange={(e) => on({ ...item, name: e.target.value })} />
              <input className="field" placeholder="Mois · durée" value={item.meta} onChange={(e) => on({ ...item, meta: e.target.value })} />
            </div>
            <textarea className="field min-h-24" placeholder="Texte" value={item.text} onChange={(e) => on({ ...item, text: e.target.value })} />
          </div>
        )}
      />

      <ListEditor
        title="Questions"
        items={property.faq}
        onChange={(faq) => update({ faq })}
        blank={() => ({ id: crypto.randomUUID(), q: "", a: "" })}
        fields={(item, on) => (
          <div className="grid gap-3">
            <input className="field" placeholder="Question" value={item.q} onChange={(e) => on({ ...item, q: e.target.value })} />
            <textarea className="field min-h-20" placeholder="Réponse" value={item.a} onChange={(e) => on({ ...item, a: e.target.value })} />
          </div>
        )}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button type="submit" className="btn">
          C’est enregistré
        </button>
        {armed ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              resetAll();
              setArmed(false);
              toast("Maison d’exemple rétablie.");
            }}
          >
            Confirmer la remise à zéro
          </button>
        ) : (
          <button type="button" className="btn-ghost" onClick={() => setArmed(true)}>
            Tout remettre comme l’exemple
          </button>
        )}
      </div>
    </form>
  );
}

function PhotosForm() {
  const photos = useStay((s) => s.photos);
  const setPhoto = useStay((s) => s.setPhoto);

  async function onFile(id: string, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Choisissez une image.");
      return;
    }
    try {
      const data = await compress(file);
      setPhoto(id, data);
      toast("Photo mise à jour.");
    } catch {
      toast("Impossible de lire cette image.");
    }
  }

  return (
    <div>
      <p className="max-w-xl text-sm leading-relaxed text-muted">
        Les photos de l’annonce. Une image remplacée reste dans ce navigateur. « Photo d’origine » revient à
        celle de la fiche.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTO_SLOTS.map((slot) => {
          const src = photos[slot.id] || slot.src;
          return (
            <li key={slot.id} className="border border-line bg-surface">
              {src ? <img src={src} alt={slot.alt} className="aspect-photo w-full object-cover" /> : null}
              <div className="space-y-3 p-4">
                <p className="text-sm">{slot.caption}</p>
                <label className="btn-ghost w-full">
                  Remplacer
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      void onFile(slot.id, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {photos[slot.id] ? (
                  <button type="button" className="btn-ghost w-full" onClick={() => setPhoto(slot.id, null)}>
                    Photo d’origine
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input className="field mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function Num({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        className="field mt-1 tabular-nums"
        type="number"
        min={min}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
      />
    </label>
  );
}

function ListEditor<T extends { id: string }>({
  title,
  items,
  onChange,
  blank,
  fields,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  fields: (item: T, update: (next: T) => void) => ReactNode;
}) {
  return (
    <div>
      <p className="text-sm">{title}</p>
      <div className="mt-3 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="border border-line bg-surface p-4">
            {fields(item, (next) => onChange(replaceAt(items, index, next)))}
            <button type="button" className="btn-ghost mt-3" onClick={() => onChange(items.filter((x) => x.id !== item.id))}>
              Retirer
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-ghost mt-3" onClick={() => onChange([...items, blank()])}>
        Ajouter
      </button>
    </div>
  );
}

function replaceAt<T>(list: T[], index: number, next: T): T[] {
  return list.map((item, i) => (i === index ? next : item));
}

async function compress(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.68);
}

