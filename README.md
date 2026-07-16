# Cabinet Pietri Immobilier

Site vitrine et back-office de l'agence **Cabinet Pietri Immobilier** (biens de prestige, Corse / Continent / Monaco / Bali). Construit sur Lovable, éditorial, bilingue FR/EN, avec un back-office admin pour la gestion des biens et de leurs médias (photos, vidéos, visites virtuelles).

- Preview : https://id-preview--d9b038a2-684a-4e83-b525-3dd6ebd5bd0d.lovable.app
- Production : https://www.cabinet-pietri-immobilier.com

---

## 1. Stack technique

| Domaine | Choix |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| Routing | react-router-dom v6 |
| Styles | Tailwind CSS v3 + tokens sémantiques (`src/index.css`) |
| UI kit | shadcn/ui (Radix + variantes CVA) |
| Animations | framer-motion |
| Formulaires | react-hook-form + zod |
| Data / cache | @tanstack/react-query |
| Backend | Lovable Cloud (Supabase managé) — Postgres, Auth, Storage, Edge Functions |
| i18n | React Context maison (`src/i18n/`) FR/EN |
| SEO | react-helmet-async |
| MCP (agent AI) | `@lovable.dev/mcp-js` (Edge Function `mcp`) |
| Tests | vitest |
| Lint | eslint |

---

## 2. Architecture des dossiers

```
.
├── docs/                      Documentation détaillée (voir §12)
├── public/                    Assets statiques servis à la racine
├── src/
│   ├── assets/                Images importées via ES modules
│   ├── auth/                  Contexte d'auth + garde admin
│   │   ├── AuthContext.tsx
│   │   └── AdminGuard.tsx
│   ├── components/            Composants réutilisables
│   │   ├── home/              Sections spécifiques à la home
│   │   └── ui/                shadcn/ui (générés, à ne pas réécrire)
│   ├── data/                  Données locales (fallback / démo)
│   ├── hooks/                 Hooks React réutilisables
│   ├── i18n/                  Contexte de langue + dictionnaire
│   ├── integrations/supabase/ Client + types générés (NE PAS ÉDITER)
│   ├── lib/                   Logique métier partagée
│   │   ├── properties.ts      Accès Postgres + helpers biens
│   │   ├── utils.ts           `cn()` Tailwind
│   │   └── mcp/               Définitions des outils MCP
│   ├── pages/                 Pages de routing
│   │   └── admin/             Back-office admin
│   ├── test/                  Setup vitest
│   ├── App.tsx                Providers + routes
│   ├── main.tsx               Bootstrap
│   └── index.css              Tokens & thème global
├── supabase/
│   ├── config.toml            Config projet (auto)
│   ├── functions/
│   │   ├── log-visit/         Edge function tracking anonyme
│   │   └── mcp/               Edge function MCP (auto-générée)
│   └── migrations/            SQL versionné
├── .env                       Vars Vite (auto par Lovable Cloud)
├── .env.example               Modèle documenté
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 3. Pages

Toutes les pages sont enregistrées dans `src/App.tsx`.

| Route | Composant | Rôle |
|---|---|---|
| `/` | `pages/Index` | Home éditoriale (hero cinémato, manifeste, biens vedettes, destinations, CTA). |
| `/philosophy` | `pages/Philosophy` | Récit de marque et valeurs. |
| `/biens` | `pages/Biens` | Liste publique des biens (hors `masque`). |
| `/biens/:slug` | `pages/BienDetail` | Fiche bien : galerie, description FR/EN, médias immersifs, formulaire de contact. |
| `/collection` | Redirect → `/biens` | Ancien chemin conservé pour SEO. |
| `/destinations` | `pages/Destinations` | Présentation des zones couvertes. |
| `/signature` | `pages/Signature` | Service Signature (offre haut de gamme). |
| `/services` / `/vendre` | `pages/Services` | Vendre avec le cabinet. |
| `/acheter` | `pages/Acheter` | Accompagnement acquéreur. |
| `/about` | `pages/About` | Présentation de l'agence. |
| `/contact` | `pages/Contact` | Formulaire + coordonnées. |
| `/confidentialite` | `pages/Confidentialite` | Politique RGPD. |
| `/.lovable/oauth/consent` | `pages/OAuthConsent` | Écran de consentement OAuth du serveur MCP. |
| `/admin/login` | `pages/admin/AdminLogin` | Connexion admin (email/password). |
| `/admin/biens` | `pages/admin/AdminBiensList` | Table admin des biens. |
| `/admin/biens/nouveau` | `pages/admin/AdminBienEdit` | Création. |
| `/admin/biens/:id/edit` | `pages/admin/AdminBienEdit` | Édition. |
| `/admin/analytics` | `pages/admin/AdminAnalytics` | Stats de visite anonymisées. |
| `*` | `pages/NotFound` | 404. |

Les routes `/admin/*` sont enveloppées par `AdminGuard` (redirige vers `/admin/login` si non-admin).

---

## 4. Composants

Voir `docs/COMPONENTS.md` pour la fiche détaillée de chaque composant (responsabilité, props, dépendances, usages).

Résumé :

- `Navbar`, `Footer`, `NavLink` — chrome global.
- `PageHero`, `SectionHeading` — briques éditoriales.
- `PropertyCard` (données locales) / `PropertyCardDb` (données DB) — carte bien, ratio 3/4 vertical (règle mémoire).
- `PropertyMediaSection` — bloc vidéos + visite virtuelle sur la fiche bien.
- `VirtualTourViewer` — iframe visite virtuelle (Matterport / iframe custom).
- `StatusBadge` — pastille de statut (`disponible`, `sous_offre`, `vendu`, `reserve`, `masque`).
- `components/home/*` — sections propres à la home (`HeroSection`, `FeaturedProperties`, `ManifestoSection`, `DestinationsSection`, `ServicesSection`, `TrustSection`, `CTASection`, `FinalCTASection`).
- `components/ui/*` — shadcn/ui : ne pas réécrire manuellement, dérivés via variantes.

---

## 5. Hooks

- `useVisitTracker` — enregistre une visite anonymisée (route, referrer, langue) via l'edge function `log-visit`. Monté globalement dans `App.tsx`.
- `use-mobile` — booléen `isMobile` basé sur un `matchMedia`.
- `use-toast` — proxy shadcn/ui pour les toasts.
- `i18n/LanguageContext` — expose `{ lang, setLang, t }` (dictionnaire dans `translations.ts`).
- `auth/AuthContext` — expose la session Supabase, `signIn`, `signOut`, `isAdmin`.

---

## 6. Contexte métier

Cabinet Pietri Immobilier commercialise des biens de prestige avec un positionnement éditorial haut de gamme. Le site a deux volets :

1. **Vitrine publique** : biens visibles (statut ≠ `masque`), triés par statut puis `display_order` puis date. Chaque fiche peut exposer plusieurs médias immersifs (vidéo principale, vidéo drone, visite virtuelle Matterport ou iframe custom).
2. **Back-office admin** : CRUD des biens, upload de médias (buckets Storage `property-images`, `property-documents`), gestion des statuts, statistiques de visites.

Règles importantes :

- Un bien avec statut `masque` n'est jamais servi par l'API publique.
- Les rôles sont stockés dans la table dédiée `user_roles` (jamais sur `auth.users` ni sur un profil). Vérification via `public.has_role()` (security definer).
- Contenu bilingue : chaque champ descriptif a une variante `_en`.
- SEO : `title` < 60 car, `meta description` < 160 car, un seul H1, `alt` sur images.

---

## 7. Variables d'environnement

Voir `.env.example` pour le modèle complet. Les valeurs sont injectées automatiquement par Lovable Cloud dans `.env` à la racine.

| Variable | Portée | Rôle |
|---|---|---|
| `VITE_SUPABASE_URL` | client (Vite) | URL du projet Supabase. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client (Vite) | Clé anon publique (RLS obligatoire côté DB). |
| `VITE_SUPABASE_PROJECT_ID` | client (Vite) | Référence projet, utilisée par le MCP. |
| `SUPABASE_URL` | edge functions | Idem, côté serveur. |
| `SUPABASE_PUBLISHABLE_KEY` | edge functions | Clé anon serveur. |
| `SUPABASE_SERVICE_ROLE_KEY` | edge functions | Clé service (bypass RLS). Jamais côté client. |
| `LOVABLE_API_KEY` | edge functions | Auth Lovable AI Gateway / connecteurs. |

Les variables `SUPABASE_*` côté serveur sont gérées par la plateforme et non modifiables via `.env`.

---

## 8. Installation locale

```bash
# Prérequis : Node 20+, bun ou npm
bun install         # ou : npm install
bun run dev         # démarre Vite sur http://localhost:8080
```

Le `.env` local est renseigné automatiquement quand le projet est ouvert dans Lovable. En dehors de Lovable, copier `.env.example` → `.env` et remplir avec les valeurs de votre backend.

---

## 9. Build

```bash
bun run build          # build production (dist/)
bun run build:dev      # build en mode development
bun run preview        # sert le build
bun run lint           # eslint
bun run test           # vitest
```

---

## 10. Déploiement

Le déploiement se fait depuis Lovable :

1. Dans l'éditeur, cliquer sur **Publish** (haut à droite).
2. Le site est servi sous `https://<slug>.lovable.app` et sur les domaines personnalisés configurés.
3. Les Edge Functions (`log-visit`, `mcp`) sont déployées automatiquement à chaque publication.
4. Les migrations Supabase sont appliquées via l'outil de migration Lovable.

Alternative self-host : connecter GitHub (menu **+** > **GitHub** > *Connect project*) puis déployer le code sur n'importe quel host Node (Vercel, Netlify, etc.). Les Edge Functions restent hébergées sur Supabase.

---

## 11. Conventions de développement

- **Alias** : `@/*` → `src/*`.
- **Design system** : uniquement des tokens sémantiques HSL définis dans `src/index.css`. Interdit : classes couleur brutes (`text-white`, `bg-black`, `bg-[#...]`).
- **Composants** : petits, découplés, une responsabilité, props typées explicitement.
- **State serveur** : react-query (jamais de fetch manuel dans un composant sans cache).
- **Auth** : `useAuth()` pour la session, `AdminGuard` pour les routes admin.
- **i18n** : tout texte visible passe par `t()` du `LanguageContext`.
- **RLS** : chaque table publique doit avoir `ENABLE ROW LEVEL SECURITY` + policies + `GRANT` explicite.
- **Types** : pas de `any` toléré dans le nouveau code (voir `TODO.md` pour le legacy).
- **Commits** : messages courts en français, présent de l'indicatif (« ajoute champ vidéo drone »).
- **Ne pas éditer** : `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/functions/mcp/index.ts`, `src/components/ui/*` (voir `AI_CONTEXT.md`).

---

## 12. Documentation détaillée

- `docs/ARCHITECTURE.md` — schéma d'ensemble et flux de données.
- `docs/COMPONENTS.md` — fiche de chaque composant.
- `docs/API.md` — endpoints Supabase + Edge Functions.
- `docs/DATABASE.md` — tables, policies, functions, storage.
- `docs/AJOUTER-UN-BIEN.md` — guide utilisateur pour l'admin.
- `AI_CONTEXT.md` — brief pour agents IA (ChatGPT / Codex).
- `TODO.md` — dette technique et roadmap.
