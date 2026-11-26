import { createFileRoute, Link } from "@tanstack/react-router";
import { useStay } from "@/lib/stay-store";
import { SiteHeader, SiteFooter } from "@/components/stay/chrome";
import { t, useLang, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/mentions")({
  component: MentionsPage,
});

const COPY: Record<Lang, { title: string; items: { k: string; v: string }[] }> = {
  fr: {
    title: "Mentions légales",
    items: [
      { k: "Éditeur.", v: "{host}, hôte de {name}, {address}. SIRET 931 811 194 00014. Contact : {email}." },
      { k: "Hébergement.", v: "Site publié via Grok. Les réservations ne sont pas encaissées en ligne : une demande est envoyée à l’hôte, qui confirme ensuite et envoie un lien de paiement Stripe." },
      { k: "Taxe de séjour.", v: "Collectée auprès du voyageur, puis reversée à la communauté de communes Chablis, Villages et Terroirs (SIREN 200 067 080). Tarif publié pour un meublé classé 4 étoiles : 1,60 € par personne majeure et par nuit. Les mineurs sont exonérés." },
      { k: "Données.", v: "Nom, e-mail et téléphone saisis dans une demande servent uniquement à répondre à cette demande." },
      { k: "À compléter.", v: "Numéro d’enregistrement du meublé, s’il existe." },
    ],
  },
  en: {
    title: "Legal notice",
    items: [
      { k: "Publisher.", v: "{host}, host of {name}, {address}. SIRET 931 811 194 00014. Contact: {email}." },
      { k: "Hosting.", v: "Site published via Grok. Bookings are not taken online: an enquiry is sent to the host, who then confirms and sends a Stripe payment link." },
      { k: "Tourist tax.", v: "Collected from the guest, then paid to the communauté de communes Chablis, Villages et Terroirs (SIREN 200 067 080). Published rate for a 4-star classified furnished rental: €1.60 per adult per night. Minors are exempt." },
      { k: "Data.", v: "Name, e-mail and phone entered in an enquiry are used only to answer that enquiry." },
      { k: "To complete.", v: "Registration number of the furnished rental, if one exists." },
    ],
  },
  nl: {
    title: "Juridische vermelding",
    items: [
      { k: "Uitgever.", v: "{host}, gastvrouw van {name}, {address}. SIRET 931 811 194 00014. Contact: {email}." },
      { k: "Hosting.", v: "Site gepubliceerd via Grok. Boekingen worden niet online geïnd: een aanvraag gaat naar de gastvrouw, die daarna bevestigt en een Stripe-betaallink stuurt." },
      { k: "Toeristenbelasting.", v: "Geïnd bij de gast, daarna overgemaakt aan de communauté de communes Chablis, Villages et Terroirs (SIREN 200 067 080). Gepubliceerd tarief voor een 4-sterren meublé: € 1,60 per volwassene per nacht. Minderjarigen zijn vrijgesteld." },
      { k: "Gegevens.", v: "Naam, e-mail en telefoon in een aanvraag dienen alleen om die aanvraag te beantwoorden." },
      { k: "Aan te vullen.", v: "Registratienummer van het meublé, als dat bestaat." },
    ],
  },
  de: {
    title: "Impressum",
    items: [
      { k: "Herausgeber.", v: "{host}, Gastgeberin von {name}, {address}. SIRET 931 811 194 00014. Kontakt: {email}." },
      { k: "Hosting.", v: "Website veröffentlicht über Grok. Buchungen werden nicht online eingezogen: eine Anfrage geht an die Gastgeberin, die danach bestätigt und einen Stripe-Zahlungslink sendet." },
      { k: "Kurtaxe.", v: "Beim Gast erhoben, dann an die communauté de communes Chablis, Villages et Terroirs (SIREN 200 067 080) überwiesen. Veröffentlichter Satz für ein 4-Sterne-Möbliertes: 1,60 € pro Erwachsenen und Nacht. Minderjährige sind befreit." },
      { k: "Daten.", v: "Name, E-Mail und Telefon in einer Anfrage dienen nur zur Beantwortung dieser Anfrage." },
      { k: "Noch zu ergänzen.", v: "Registrierungsnummer des Möblierten, falls vorhanden." },
    ],
  },
};

function MentionsPage() {
  const property = useStay((s) => s.property);
  const { lang } = useLang();
  const page = COPY[lang];
  const fill = (s: string) =>
    s
      .replace("{host}", property.hostName)
      .replace("{name}", property.name)
      .replace("{address}", property.address)
      .replace("{email}", property.hostEmail);
  return (
    <div className="min-h-screen bg-bg text-ink">
      <SiteHeader property={property} solid />
      <main className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <p className="eyebrow">{t(lang, "legalEyebrow")}</p>
        <h1 className="mt-2 font-display text-4xl leading-display">{page.title}</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted">
          {page.items.map((item) => (
            <p key={item.v}>
              <span className="text-ink">{item.k} </span>
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
