import { defaultProperty } from "@/data/property";

const SITE = "https://villabellevue.fr";

export function lodgingJsonLd() {
  const p = defaultProperty;
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: p.name,
    description:
      "Villa Bellevue à Mailly-le-Château (Yonne, Bourgogne). Location de vacances 4 étoiles Atout France, piscine, jacuzzi, home cinéma, vue sur la vallée de l’Yonne. Jusqu’à 10 personnes. Réservation directe.",
    url: SITE,
    image: `${SITE}/photos/01.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "18 chemin de Bel Air",
      addressLocality: "Mailly-le-Château",
      postalCode: "89660",
      addressRegion: "Yonne",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.5958,
      longitude: 3.6426,
    },
    telephone: undefined,
    email: p.hostEmail,
    numberOfRooms: p.bedrooms,
    occupancy: { "@type": "QuantitativeValue", maxValue: p.maxGuests },
    floorSize: { "@type": "QuantitativeValue", value: p.surface, unitCode: "MTK" },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Piscine privée", value: true },
      { "@type": "LocationFeatureSpecification", name: "Jacuzzi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Home cinéma", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wifi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking privé", value: true },
    ],
    starRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "30",
      bestRating: "5",
    },
    sameAs: [
      "https://www.airbnb.fr/rooms/1132067670763466321",
      "https://www.booking.com/hotel/fr/villa-bellevue-mailly-le-chateau.fr.html",
    ],
    identifier: "93181119400014",
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: defaultProperty.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
