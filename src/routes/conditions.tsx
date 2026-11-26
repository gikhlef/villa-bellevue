import { createFileRoute, Link } from "@tanstack/react-router";
import { useStay } from "@/lib/stay-store";
import { SiteHeader, SiteFooter } from "@/components/stay/chrome";
import { t, useLang, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/conditions")({
  component: ConditionsPage,
});

const COPY: Record<Lang, { title: string; items: { k: string; v: string }[] }> = {
  fr: {
    title: "Conditions",
    items: [
      { k: "Demande.", v: "Le site enregistre une demande. Rien n’est débité. Les dates restent libres jusqu’à la confirmation de {host}." },
      { k: "Prix.", v: "Nuitées au tarif affiché, plus ménage de {cleaning} €, plus taxe de séjour (1,60 € par adulte et par nuit, mineurs exonérés). Le chauffage de la piscine, s’il est demandé, se règle sur place." },
      { k: "Paiement.", v: "Après confirmation, {host} envoie un lien de paiement sécurisé par carte, via Stripe. Les dates ne sont bloquées qu’après sa confirmation et le paiement." },
      { k: "Annulation.", v: "Gratuite jusqu’à 30 jours avant l’arrivée. Entre 30 et 14 jours : 50 % du montant des nuitées. Moins de 14 jours, ou non-présentation : les nuitées ne sont pas remboursées. Le ménage est remboursé s’il n’a pas été engagé. La taxe de séjour n’est due que pour les nuits effectivement passées." },
      { k: "Caution.", v: "600 € à l’arrivée, par chèque non encaissé, rendu au départ s’il n’y a pas de dégradation." },
      { k: "Règles.", v: "Pas de fête. Animaux non acceptés. Arrivée entre 17 h et 20 h, départ avant 10 h. Quelques marches : accès difficile pour les personnes à mobilité réduite." },
      { k: "", v: "Le droit de rétractation de 14 jours des contrats à distance ne s’applique pas à un hébergement fourni à une date déterminée." },
    ],
  },
  en: {
    title: "Terms",
    items: [
      { k: "Enquiry.", v: "The site records an enquiry. Nothing is charged. Dates stay open until {host} confirms." },
      { k: "Price.", v: "Nights at the rate shown, plus cleaning of €{cleaning}, plus tourist tax (€1.60 per adult per night, minors exempt). Pool heating, if requested, is paid on site." },
      { k: "Payment.", v: "After confirmation, {host} sends a secure card payment link via Stripe. Dates are blocked only after her confirmation and payment." },
      { k: "Cancellation.", v: "Free up to 30 days before arrival. Between 30 and 14 days: 50% of the nights. Less than 14 days, or no-show: nights are not refunded. Cleaning is refunded if it has not been committed. Tourist tax is due only for nights actually spent." },
      { k: "Deposit.", v: "€600 on arrival, by uncashed cheque, returned on departure if there is no damage." },
      { k: "Rules.", v: "No parties. Pets not accepted. Arrival between 17:00 and 20:00, departure before 10:00. A few steps: difficult access for people with reduced mobility." },
      { k: "", v: "The 14-day withdrawal right for distance contracts does not apply to accommodation provided on a set date." },
    ],
  },
  nl: {
    title: "Voorwaarden",
    items: [
      { k: "Aanvraag.", v: "De site registreert een aanvraag. Er wordt niets afgeschreven. De data blijven vrij tot {host} bevestigt." },
      { k: "Prijs.", v: "Nachten tegen het getoonde tarief, plus schoonmaak van € {cleaning}, plus toeristenbelasting (€ 1,60 per volwassene per nacht, minderjarigen vrijgesteld). Verwarming van het zwembad, indien gevraagd, wordt ter plaatse betaald." },
      { k: "Betaling.", v: "Na bevestiging stuurt {host} een beveiligde betaallink per kaart via Stripe. Data worden pas geblokkeerd na haar bevestiging en betaling." },
      { k: "Annulering.", v: "Gratis tot 30 dagen voor aankomst. Tussen 30 en 14 dagen: 50 % van de nachten. Minder dan 14 dagen, of no-show: nachten worden niet terugbetaald. De schoonmaak wordt terugbetaald als die nog niet is ingezet. Toeristenbelasting is alleen verschuldigd voor daadwerkelijk doorgebrachte nachten." },
      { k: "Borg.", v: "€ 600 bij aankomst, per niet-geïnde cheque, teruggegeven bij vertrek als er geen schade is." },
      { k: "Regels.", v: "Geen feesten. Huisdieren niet toegestaan. Aankomst tussen 17:00 en 20:00, vertrek voor 10:00. Enkele treden: moeilijke toegang voor mensen met beperkte mobiliteit." },
      { k: "", v: "Het herroepingsrecht van 14 dagen voor overeenkomsten op afstand geldt niet voor accommodatie op een bepaalde datum." },
    ],
  },
  de: {
    title: "Bedingungen",
    items: [
      { k: "Anfrage.", v: "Die Website erfasst eine Anfrage. Es wird nichts abgebucht. Die Daten bleiben frei, bis {host} bestätigt." },
      { k: "Preis.", v: "Nächte zum angezeigten Tarif, plus Reinigung von {cleaning} €, plus Kurtaxe (1,60 € pro Erwachsenen und Nacht, Minderjährige befreit). Poolheizung, falls gewünscht, wird vor Ort gezahlt." },
      { k: "Zahlung.", v: "Nach Bestätigung sendet {host} einen sicheren Kartenzahlungslink über Stripe. Die Daten werden erst nach ihrer Bestätigung und Zahlung gesperrt." },
      { k: "Stornierung.", v: "Kostenlos bis 30 Tage vor Anreise. Zwischen 30 und 14 Tagen: 50 % der Nächte. Weniger als 14 Tage oder Nichterscheinen: die Nächte werden nicht erstattet. Die Reinigung wird erstattet, wenn sie noch nicht gebunden ist. Die Kurtaxe ist nur für tatsächlich verbrachte Nächte fällig." },
      { k: "Kaution.", v: "600 € bei Ankunft, per unangezahltem Scheck, bei Abreise zurückgegeben, wenn kein Schaden vorliegt." },
      { k: "Regeln.", v: "Keine Partys. Haustiere nicht erlaubt. Anreise zwischen 17:00 und 20:00, Abreise vor 10:00. Einige Stufen: erschwerter Zugang für Menschen mit eingeschränkter Mobilität." },
      { k: "", v: "Das 14-tägige Widerrufsrecht bei Fernabsatzverträgen gilt nicht für Unterkunft zu einem bestimmten Termin." },
    ],
  },
};

function ConditionsPage() {
  const property = useStay((s) => s.property);
  const { lang } = useLang();
  const page = COPY[lang];
  const fill = (s: string) => s.replace("{host}", property.hostName).replace("{cleaning}", String(property.cleaning));
  return (
    <div className="min-h-screen bg-bg text-ink">
      <SiteHeader property={property} solid />
      <main className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <p className="eyebrow">{t(lang, "conditionsEyebrow")}</p>
        <h1 className="mt-2 font-display text-4xl leading-display">{page.title}</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted">
          {page.items.map((item) => (
            <p key={item.v}>
              {item.k ? <span className="text-ink">{item.k} </span> : null}
              {fill(item.v)}
            </p>
          ))}
        </div>
        <p className="mt-10">
          <Link to="/" className="text-sm underline underline-offset-4">
            {t(lang, "back")}
          </Link>
        </p>
      </main>
      <SiteFooter property={property} />
    </div>
  );
}
