# COMPONENTS

Fiche par composant. Format :
- **Rôle** — responsabilité unique.
- **Fichier** — chemin.
- **Props** — contrat public.
- **Hooks** — hooks internes.
- **Dépendances** — autres composants / libs.
- **Pages utilisatrices** — où il est monté.
- **Exemple**.

Les composants `src/components/ui/*` (shadcn/ui) suivent leur doc
officielle : https://ui.shadcn.com. Non fichés ici.

---

## Chrome global

### `Navbar`
- **Rôle** : navigation principale + toggle langue.
- **Fichier** : `src/components/Navbar.tsx`.
- **Props** : —
- **Hooks** : `useLanguage`, `useAuth`, `useLocation`.
- **Dépendances** : `NavLink`, `lucide-react`, `Button`.
- **Pages utilisatrices** : montée globalement dans `App.tsx`.
- **Exemple** :
  ```tsx
  <Navbar />
  ```

### `Footer`
- **Rôle** : pied de page (liens légaux, mentions, réseaux).
- **Fichier** : `src/components/Footer.tsx`.
- **Props** : —
- **Pages utilisatrices** : `App.tsx`.

### `NavLink`
- **Rôle** : `<Link>` stylé avec état actif.
- **Fichier** : `src/components/NavLink.tsx`.
- **Props** : `{ to: string; children: ReactNode; className?: string }`.
- **Dépendances** : `react-router-dom`, `cn`.
- **Utilisé par** : `Navbar`, `Footer`.

---

## Briques éditoriales

### `PageHero`
- **Rôle** : bandeau d'en-tête d'une page interne.
- **Fichier** : `src/components/PageHero.tsx`.
- **Props** : `{ title: string; subtitle?: string; image?: string; eyebrow?: string }`.
- **Utilisé par** : `About`, `Services`, `Acheter`, `Philosophy`, `Signature`, `Contact`, `Confidentialite`.

### `SectionHeading`
- **Rôle** : titre de section (eyebrow + h2 + intro).
- **Fichier** : `src/components/SectionHeading.tsx`.
- **Props** : `{ eyebrow?: string; title: string; intro?: string; align?: 'left' | 'center' }`.

---

## Biens

### `PropertyCard`
- **Rôle** : carte bien pour les données locales de démo (héritage).
- **Fichier** : `src/components/PropertyCard.tsx`.
- **Props** : `{ property: LocalProperty }` (voir `src/data/properties.ts`).
- **Contrainte** : ratio image 3/4.
- **Note** : sera remplacé par `PropertyCardDb` (voir TODO).

### `PropertyCardDb`
- **Rôle** : carte bien depuis Supabase.
- **Fichier** : `src/components/PropertyCardDb.tsx`.
- **Props** : `{ property: Property }` (type `src/lib/properties.ts`).
- **Hooks** : `useLanguage`.
- **Dépendances** : `StatusBadge`, `formatPrice`, `formatLocation`, `AspectRatio`.
- **Utilisé par** : `Biens`, `FeaturedProperties`.

### `PropertyMediaSection`
- **Rôle** : bloc médias immersifs sur la fiche bien.
- **Fichier** : `src/components/PropertyMediaSection.tsx`.
- **Props** : `{ property: Property }`.
- **Règle métier** : n'affiche rien si aucun média n'est renseigné
  ou si `show_video` / `show_virtual_tour` est faux.
- **Dépendances** : `VirtualTourViewer`, `SectionHeading`.
- **Utilisé par** : `BienDetail`.

### `VirtualTourViewer`
- **Rôle** : iframe sécurisée pour visite virtuelle.
- **Fichier** : `src/components/VirtualTourViewer.tsx`.
- **Props** : `{ matterportId?: string; url?: string; iframe?: string; title: string }`.
- **Sandbox** : `allow-scripts allow-same-origin allow-popups`.
- **Utilisé par** : `PropertyMediaSection`.

### `StatusBadge`
- **Rôle** : pastille de statut d'un bien.
- **Fichier** : `src/components/StatusBadge.tsx`.
- **Props** : `{ status: PropertyStatus; size?: 'sm' | 'md' }`.
- **Utilisé par** : `PropertyCardDb`, `BienDetail`, admin.

---

## Sections home (`src/components/home/`)

Toutes utilisent `SectionHeading` et les tokens de design.

| Composant | Rôle | Dépendances notables |
|---|---|---|
| `HeroSection` | Hero cinématographique de la home. | `framer-motion` |
| `ManifestoSection` | Manifeste de marque. | — |
| `FeaturedProperties` | Biens vedettes. | react-query + `fetchFeaturedProperties`, `PropertyCardDb` |
| `DestinationsSection` | Vignettes destinations. | — |
| `ServicesSection` | Services proposés. | — |
| `TrustSection` | Réassurance / presse. | — |
| `CTASection` | CTA intermédiaire. | `Button` |
| `FinalCTASection` | CTA de fin de page. | `Button` |

Toutes montées dans `pages/Index.tsx`.

---

## Auth

### `AuthProvider`
- **Rôle** : session Supabase + `isAdmin`.
- **Fichier** : `src/auth/AuthContext.tsx`.
- **Expose** : `{ session, user, isAdmin, signIn, signOut, loading }`.
- **Utilisé par** : `App.tsx` (provider), `AdminGuard`, `AdminLogin`.

### `AdminGuard`
- **Rôle** : redirige vers `/admin/login` si non-admin.
- **Fichier** : `src/auth/AdminGuard.tsx`.
- **Props** : `{ children: ReactNode }`.
- **Hooks** : `useAuth`.
- **Utilisé par** : routes `/admin/*` dans `App.tsx`.

---

## Hooks

### `useVisitTracker`
- **Fichier** : `src/hooks/useVisitTracker.ts`.
- **Rôle** : POST vers `log-visit` à chaque changement de route.
- **Dépendances** : `react-router-dom`, `supabase.functions.invoke`.

### `useIsMobile`
- **Fichier** : `src/hooks/use-mobile.tsx`.
- **Rôle** : booléen responsive via `matchMedia`.

### `useToast`
- **Fichier** : `src/hooks/use-toast.ts`.
- **Rôle** : file de toasts shadcn/ui.

### `useLanguage`
- **Fichier** : `src/i18n/LanguageContext.tsx`.
- **Rôle** : `{ lang, setLang, t }`.

---

## Pages

Une page = un fichier dans `src/pages/`. Voir `ARCHITECTURE.md`
pour la table des routes. Chaque page est libre de composer
n'importe lequel des composants ci-dessus.
