# Composants

Format de chaque fiche :
- **Responsabilité** : ce que le composant fait, et rien d'autre.
- **Props** : contrat public.
- **Dépendances** : autres composants / hooks / libs utilisés.
- **Utilisé par** : où il est monté.

Les composants `src/components/ui/*` sont générés par shadcn/ui ; ils
suivent leur documentation officielle et ne sont pas fichés ici.

---

## `Navbar` — `src/components/Navbar.tsx`
- **Responsabilité** : barre de navigation globale + toggle langue.
- **Props** : aucune.
- **Dépendances** : `NavLink`, `LanguageContext`, `lucide-react`.
- **Utilisé par** : `App.tsx` (monté globalement).

## `Footer` — `src/components/Footer.tsx`
- **Responsabilité** : pied de page (liens légaux, réseaux, mentions).
- **Props** : aucune.
- **Utilisé par** : `App.tsx`.

## `NavLink` — `src/components/NavLink.tsx`
- **Responsabilité** : `<Link>` stylé avec état actif.
- **Props** : `{ to: string; children: ReactNode; className?: string }`.
- **Utilisé par** : `Navbar`, `Footer`.

## `PageHero` — `src/components/PageHero.tsx`
- **Responsabilité** : bandeau d'en-tête éditorial d'une page interne.
- **Props** : `{ title: string; subtitle?: string; image?: string }`.
- **Utilisé par** : pages statiques (`About`, `Services`, `Acheter`, …).

## `SectionHeading` — `src/components/SectionHeading.tsx`
- **Responsabilité** : titre de section (eyebrow + h2 + intro).
- **Props** : `{ eyebrow?: string; title: string; intro?: string }`.
- **Utilisé par** : sections home et pages internes.

## `PropertyCard` — `src/components/PropertyCard.tsx`
- **Responsabilité** : carte bien pour les données locales de démo.
- **Props** : `{ property: LocalProperty }` (voir `src/data/properties.ts`).
- **Contrainte** : ratio d'image **3/4 vertical** (règle mémoire).
- **Utilisé par** : sections statiques.

## `PropertyCardDb` — `src/components/PropertyCardDb.tsx`
- **Responsabilité** : carte bien pour les données Supabase.
- **Props** : `{ property: Property }` (type `src/lib/properties.ts`).
- **Dépendances** : `StatusBadge`, `formatPrice`, `formatLocation`,
  `LanguageContext`.
- **Utilisé par** : `Biens`, `FeaturedProperties`.

## `PropertyMediaSection` — `src/components/PropertyMediaSection.tsx`
- **Responsabilité** : bloc médias immersifs sur la fiche bien
  (vidéo principale, secondaire, drone, visite virtuelle,
  YouTube/Vimeo, iframe custom, Matterport).
- **Props** : `{ property: Property }`.
- **Règle métier** : si aucun média n'est renseigné ou si les toggles
  `show_video` / `show_virtual_tour` sont faux, ne rien afficher.
- **Utilisé par** : `pages/BienDetail`.

## `VirtualTourViewer` — `src/components/VirtualTourViewer.tsx`
- **Responsabilité** : iframe sécurisée pour visite virtuelle
  (Matterport ID ou URL/iframe custom).
- **Props** : `{ matterportId?: string; url?: string; iframe?: string; title: string }`.
- **Dépendances** : sandbox iframe, `aria-label`.
- **Utilisé par** : `PropertyMediaSection`.

## `StatusBadge` — `src/components/StatusBadge.tsx`
- **Responsabilité** : pastille de statut d'un bien.
- **Props** : `{ status: PropertyStatus }`.
- **Utilisé par** : `PropertyCardDb`, `BienDetail`, admin.

---

## Sections home — `src/components/home/`

Toutes utilisent `SectionHeading` et les tokens de design.

| Fichier | Rôle |
|---|---|
| `HeroSection.tsx` | Hero cinématographique de la home. |
| `ManifestoSection.tsx` | Manifeste de marque. |
| `FeaturedProperties.tsx` | Biens vedettes (react-query + `fetchFeaturedProperties`). |
| `DestinationsSection.tsx` | Vignettes des destinations. |
| `ServicesSection.tsx` | Services proposés. |
| `TrustSection.tsx` | Éléments de réassurance / presse. |
| `CTASection.tsx` | CTA intermédiaire. |
| `FinalCTASection.tsx` | CTA de fin de page. |

---

## Auth

### `AuthProvider` — `src/auth/AuthContext.tsx`
- **Responsabilité** : session Supabase + `isAdmin`.
- **Expose** : `{ session, user, isAdmin, signIn, signOut, loading }`.
- **Utilisé par** : `App.tsx` (provider), `AdminGuard`, `AdminLogin`.

### `AdminGuard` — `src/auth/AdminGuard.tsx`
- **Responsabilité** : redirige vers `/admin/login` si non-admin.
- **Props** : `{ children: ReactNode }`.
- **Utilisé par** : toutes les routes `/admin/*` dans `App.tsx`.

---

## Hooks

### `useVisitTracker`
- **Fichier** : `src/hooks/useVisitTracker.ts`.
- **Responsabilité** : appelle l'edge function `log-visit` à chaque
  changement de route.
- **Utilisé par** : `App.tsx` (via `VisitTracker`).

### `useIsMobile`
- **Fichier** : `src/hooks/use-mobile.tsx`.
- **Responsabilité** : booléen responsive basé sur `matchMedia`.

### `useToast`
- **Fichier** : `src/hooks/use-toast.ts`.
- **Responsabilité** : file de toasts shadcn/ui.

### `useLanguage`
- **Fichier** : `src/i18n/LanguageContext.tsx`.
- **Responsabilité** : `{ lang, setLang, t }`.
