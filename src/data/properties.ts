/**
 * =============================================================
 *  CABINET PIETRI — Données des propriétés
 * =============================================================
 *
 *  COMMENT AJOUTER UN BIEN ?
 *  ─────────────────────────
 *  1. Ajoutez vos photos dans  src/assets/properties/
 *     Nommez-les clairement : villa-aegean-1.jpg, villa-aegean-2.jpg, etc.
 *
 *  2. Importez la photo principale en haut de ce fichier (section IMPORTS)
 *
 *  3. Ajoutez un objet dans le tableau `properties` ci-dessous
 *     en suivant le modèle existant.
 *
 *  4. C'est tout ! Le bien apparaîtra automatiquement sur le site.
 *
 *  Voir le guide complet : docs/AJOUTER-UN-BIEN.md
 * =============================================================
 */

// ─── IMPORTS PHOTOS ────────────────────────────────────────────
import propertyParis from "@/assets/property-paris.jpg";
import propertySantorini from "@/assets/property-santorini.jpg";
import propertyLondon from "@/assets/property-london.jpg";
import propertyProvence from "@/assets/property-provence.jpg";

// ─── TYPES ─────────────────────────────────────────────────────

export interface Property {
  /** Identifiant unique (utilisé pour les URLs) */
  id: string;
  /** Photo principale affichée sur la card */
  image: string;
  /** Nom du bien */
  title: string;
  /** Localisation : "Ville — Pays" */
  location: string;
  /** Prix affiché : "€ 4 800 000" ou "on-request" pour afficher "Sur demande" */
  price: string;
  /** Tag optionnel : "exclusivite" | "signature" | "nouveau" */
  tag?: "exclusivite" | "signature" | "nouveau";
  /** Nombre de chambres */
  beds?: number;
  /** Nombre de salles de bain */
  baths?: number;
  /** Surface : "450 m²" */
  area?: string;
  /** ID Matterport pour la visite virtuelle (trouvable dans l'URL du tour) */
  matterportId?: string;
  /** Catégorie pour le filtrage */
  category: "france" | "international" | "signature";
  /** Courte description du bien (FR) */
  descriptionFr?: string;
  /** Courte description du bien (EN) */
  descriptionEn?: string;
  /** Galerie photos supplémentaires (chemins des imports) */
  gallery?: string[];
  /** Bien affiché sur la page d'accueil ? */
  featured?: boolean;
}

// ─── DONNÉES DES PROPRIÉTÉS ────────────────────────────────────

export const properties: Property[] = [
  {
    id: "hotel-particulier-paris",
    image: propertyParis,
    title: "Hôtel Particulier",
    location: "Paris VIIe — France",
    price: "on-request",
    tag: "exclusivite",
    beds: 6,
    baths: 4,
    area: "450 m²",
    matterportId: "SxQL3iGnMqk",
    category: "france",
    featured: true,
    descriptionFr: "Un hôtel particulier d'exception au cœur du VIIe arrondissement, alliant prestige historique et confort contemporain.",
    descriptionEn: "An exceptional private mansion in the heart of the 7th arrondissement, blending historic prestige with contemporary comfort.",
  },
  {
    id: "villa-aegean",
    image: propertySantorini,
    title: "Villa Aegean",
    location: "Santorin — Grèce",
    price: "€ 4 800 000",
    tag: "signature",
    beds: 5,
    baths: 5,
    area: "380 m²",
    matterportId: "Zh14WDtkjdC",
    category: "international",
    featured: true,
    descriptionFr: "Vue imprenable sur la caldeira, architecture cycladique réinventée avec des matériaux nobles.",
    descriptionEn: "Breathtaking caldera views, reinvented Cycladic architecture with premium materials.",
  },
  {
    id: "the-penthouse-london",
    image: propertyLondon,
    title: "The Penthouse",
    location: "Londres — Royaume-Uni",
    price: "£ 12 500 000",
    beds: 4,
    baths: 3,
    area: "320 m²",
    category: "international",
    featured: true,
    descriptionFr: "Un penthouse panoramique dominant la skyline londonienne, finitions sur-mesure.",
    descriptionEn: "A panoramic penthouse overlooking the London skyline, bespoke finishes throughout.",
  },
  {
    id: "chateau-de-lumiere",
    image: propertyProvence,
    title: "Château de Lumière",
    location: "Provence — France",
    price: "€ 8 200 000",
    tag: "nouveau",
    beds: 8,
    baths: 6,
    area: "650 m²",
    matterportId: "1maRkYB3yxs",
    category: "france",
    featured: true,
    descriptionFr: "Château provençal restauré avec goût, entouré de lavandes et d'oliviers centenaires.",
    descriptionEn: "Tastefully restored Provençal château surrounded by lavender fields and century-old olive trees.",
  },

  // ┌──────────────────────────────────────────────────────────────┐
  // │  AJOUTEZ VOS NOUVEAUX BIENS ICI                             │
  // │  Copiez un bloc ci-dessus et modifiez les valeurs.          │
  // │                                                              │
  // │  Exemple :                                                   │
  // │  {                                                           │
  // │    id: "mas-des-oliviers",                                   │
  // │    image: masOliviers,           // importé en haut          │
  // │    title: "Mas des Oliviers",                                │
  // │    location: "Luberon — France",                             │
  // │    price: "€ 3 200 000",                                    │
  // │    tag: "nouveau",                                           │
  // │    beds: 5,                                                  │
  // │    baths: 3,                                                 │
  // │    area: "280 m²",                                           │
  // │    matterportId: "votre-id-matterport",  // optionnel        │
  // │    category: "france",                                       │
  // │    featured: false,                                          │
  // │    descriptionFr: "...",                                     │
  // │    descriptionEn: "...",                                     │
  // │  },                                                          │
  // └──────────────────────────────────────────────────────────────┘
];

// ─── HELPERS ───────────────────────────────────────────────────

/** Propriétés à afficher sur la page d'accueil */
export const getFeaturedProperties = () =>
  properties.filter((p) => p.featured);

/** Propriétés par catégorie */
export const getPropertiesByCategory = (category: Property["category"]) =>
  properties.filter((p) => p.category === category);

/** Trouver un bien par son ID */
export const getPropertyById = (id: string) =>
  properties.find((p) => p.id === id);

/** Toutes les propriétés avec visite virtuelle */
export const getPropertiesWithTour = () =>
  properties.filter((p) => p.matterportId);
