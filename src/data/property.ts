export type AmenityIcon =
  | "waves"
  | "trees"
  | "pot"
  | "wash"
  | "wifi"
  | "car"
  | "flame"
  | "fan"
  | "grill"
  | "key"
  | "bed"
  | "mountain"
  | "film"
  | "bath";

export type Amenity = { id: string; icon: AmenityIcon; label: string };
export type Sleep = { id: string; title: string; detail: string };
export type Review = { id: string; name: string; meta: string; text: string };
export type Faq = { id: string; q: string; a: string };

export type Property = {
  name: string;
  place: string;
  region: string;
  tagline: string;
  story: string;
  price: number;
  cleaning: number;
  touristTax: number;
  minNights: number;
  maxGuests: number;
  bedrooms: number;
  baths: number;
  surface: number;
  checkInHour: string;
  checkOutHour: string;
  address: string;
  access: string;
  mapUrl: string;
  hostName: string;
  hostEmail: string;
  amenities: Amenity[];
  rules: string[];
  sleeps: Sleep[];
  reviews: Review[];
  faq: Faq[];
};

export type BookingStatus = "pending" | "confirmed" | "declined";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  example?: boolean;
};

export type PhotoSlot = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export { PHOTO_SLOTS } from "./photos.ts";

export const defaultProperty: Property = {
  name: "Villa Bellevue",
  place: "Mailly-le-Château",
  region: "Bourgogne",
  tagline: "Piscine, jacuzzi et cinéma, face à la vallée de l’Yonne.",
  story:
    "Villa haut de gamme, grande terrasse et piscine sans vis-à-vis, avec une vue panoramique sur la vallée de l’Yonne. Classée 4 étoiles Atout France. Le terrain, en Natura 2000, est posé sur une falaise calcaire : la vue se prend depuis la maison, toute l’année.\n\nÀ 2 h de Paris et 30 min au sud d’Auxerre, dans le village de Mailly-le-Château, au bord de l’Yonne et du canal du Nivernais. Idéale pour 8, jusqu’à 10 avec les deux lits d’appoint du cinéma. 165 m², 4 chambres, 3 salles de bain.\n\nLe jardin, d’environ 4 000 m² : cabane avec toboggan et balançoire, ping-pong, trampoline, cage de foot, panier de basket, tyrolienne de 38 m. Barbecue, grande table de 10, transats et salon de jardin à l’ombre des bambous. Un poulailler : les œufs se ramassent sur place.\n\nLa piscine est ouverte de mai à septembre, solarium plein sud, alarme sur demande. Le chauffage du bassin se demande à l’avance : 60 € le week-end, 100 € la semaine, à régler sur place.\n\nRez-de-chaussée : entrée avec dressing et bureau, salon autour de la cheminée et grande télé, home cinéma (écran, vidéoprojecteur, enceintes, DVD, télescope sur demande, livres, jeux, baby-foot). Cet espace se transforme en couchage pour une ou deux personnes. Salle à manger jusqu’à 10. Cuisine ouverte : lave-vaisselle, induction, four, réfrigérateur-congélateur, micro-ondes, hotte, bouilloire, grille-pain, machine Nespresso. Une chambre. Salle d’eau avec double vasque et douche à l’italienne. WC avec lavabo. Le séjour ouvre sur la terrasse sud.\n\nÀ l’étage : trois chambres, dont une avec télé et salle de bain privée. Une salle de bain avec jacuzzi (une à deux personnes) et grande douche. Buanderie avec lave-linge, sèche-linge, fer et étendoir. WC.\n\nSur demande : deux lits parapluie (sans linge ni oreiller), une baignoire bébé, une chaise haute. Jusqu’à six vélos à louer, avec un siège enfant et un siège bébé.",
  price: 400,
  cleaning: 85,
  touristTax: 1.6,
  minNights: 2,
  maxGuests: 10,
  bedrooms: 4,
  baths: 3,
  surface: 165,
  checkInHour: "17:00",
  checkOutHour: "10:00",
  address: "18 chemin de Bel Air, 89660 Mailly-le-Château",
  access:
    "2 h de Paris, 30 min au sud d’Auxerre. Le village se fait à pied ; l’Yonne et le canal du Nivernais sont en bas de la côte. À proximité : rochers du Saussois (3,5 km), grottes d’Arcy-sur-Cure (15 km), Vézelay (22 km), Auxerre (29 km), Avallon (31 km), Chablis (37 km), Guédelon (53 km).",
  mapUrl:
    "https://www.openstreetmap.org/search?query=18%20chemin%20de%20Bel%20Air%2C%2089660%20Mailly-le-Ch%C3%A2teau",
  hostName: "Gwendoline",
  hostEmail: "villabellevue89@gmail.com",
  amenities: [
    { id: "piscine", icon: "waves", label: "Piscine privée, mai à septembre" },
    { id: "jacuzzi", icon: "bath", label: "Jacuzzi" },
    { id: "cinema", icon: "film", label: "Home cinéma" },
    { id: "cheminee", icon: "flame", label: "Cheminée" },
    { id: "cuisine", icon: "pot", label: "Cuisine équipée" },
    { id: "linge", icon: "wash", label: "Lave-linge et sèche-linge" },
    { id: "wifi", icon: "wifi", label: "Wifi" },
    { id: "parking", icon: "car", label: "Parking privé" },
    { id: "bbq", icon: "grill", label: "Barbecue et table de 10" },
    { id: "jardin", icon: "trees", label: "Jardin, tyrolienne, trampoline" },
    { id: "vue", icon: "mountain", label: "Vue sur la vallée de l’Yonne" },
    { id: "cle", icon: "key", label: "Arrivée autonome, boîte à clés" },
  ],
  rules: [
    "Pas de fête ni d’événement animé",
    "Animaux non acceptés",
    "Arrivée entre 17 h et 20 h, départ avant 10 h",
    "Caution de 600 € à l’arrivée, chèque non encaissé",
    "Quelques marches : accès difficile pour les personnes à mobilité réduite",
  ],
  sleeps: [
    {
      id: "rdc",
      title: "Chambre du rez-de-chaussée",
      detail: "Grand lit double. Salle d’eau attenante, double vasque et douche.",
    },
    {
      id: "suite",
      title: "Chambre principale",
      detail: "À l’étage. Grand lit double, télé, salle de bain privée.",
    },
    {
      id: "double",
      title: "Chambre double",
      detail: "À l’étage. Grand lit double.",
    },
    {
      id: "twins",
      title: "Chambre à deux lits",
      detail: "À l’étage. Deux lits simples.",
    },
    {
      id: "cinema",
      title: "Cinéma",
      detail: "Deux lits d’appoint, pour passer de 8 à 10 personnes.",
    },
  ],
  reviews: [
    {
      id: "r1",
      name: "Séjour en famille",
      meta: "Juillet 2024",
      text: "Gwendoline et sa famille nous ont accueillis et fait visiter. On voit le soin mis dans la maison et le jardin. Grand réfrigérateur, cheminée, grande table, baby-foot et cinéma. Trois belles chambres doubles : celle du bas a sa douche et une double vasque, la principale à l’étage a la sienne.",
    },
  ],
  faq: [
    {
      id: "f1",
      q: "Comment se passe la réservation ?",
      a: "Vous envoyez une demande avec vos dates. Rien n’est débité. Gwendoline vérifie le calendrier et confirme par e-mail. Si les dates sont libres, elle vous envoie un lien de paiement sécurisé par carte, via Stripe. Les dates ne sont bloquées qu’après sa confirmation et le paiement.",
    },
    {
      id: "f2",
      q: "Quelle taxe de séjour ?",
      a: "1,60 € par personne majeure et par nuit, si le classement 4 étoiles Atout France est en cours. Les mineurs sont exonérés. Elle est indiquée à part, collectée avec le séjour, puis reversée à la communauté de communes Chablis, Villages et Terroirs.",
    },
    {
      id: "f3",
      q: "Quelles conditions d’annulation ?",
      a: "Annulation gratuite jusqu’à 30 jours avant l’arrivée. Entre 30 et 14 jours : 50 % du séjour. Moins de 14 jours, ou non-présentation : le séjour n’est pas remboursé. Le ménage est remboursé s’il n’a pas été engagé. Le détail est dans les conditions.",
    },
    {
      id: "f4",
      q: "La piscine est-elle chauffée ?",
      a: "Elle est ouverte de mai à septembre. Le chauffage se demande à l’avance : 60 € le week-end, 100 € la semaine, à régler sur place. L’alarme du bassin s’active sur demande, sans supplément.",
    },
    {
      id: "f5",
      q: "Quelle caution, quel ménage ?",
      a: "Caution de 600 € à l’arrivée, par chèque non encaissé. Le ménage est de 85 €. S’il n’est pas fait correctement au départ, ces 85 € sont retenus.",
    },
    {
      id: "f6",
      q: "Peut-on venir avec un chien ?",
      a: "Non. Les animaux ne sont pas acceptés.",
    },
    {
      id: "f7",
      q: "Et avec des enfants ?",
      a: "Deux lits parapluie (sans linge), une baignoire bébé et une chaise haute, sur demande. Jusqu’à six vélos à louer, avec un siège enfant et un siège bébé.",
    },
    {
      id: "f8",
      q: "Peut-on faire une fête ?",
      a: "Non. Pas de fête ni d’événement animé, pour le calme de la maison et du voisinage.",
    },
  ],
};

export const exampleBookings = (): Booking[] => [];
