# AI_CONTEXT — Brief pour agents IA (ChatGPT / Codex / autres)

Ce document est le **point d'entrée unique** pour tout agent IA qui
intervient sur ce dépôt. Lire ce fichier avant toute modification.

---

## 1. Contexte métier

- Site du **Cabinet Pietri Immobilier**, agence de biens de prestige.
- Zones : Corse, France continentale, Monaco, Bali.
- Ton : éditorial, haut de gamme, storytelling. Pas de clichés
  « luxe » (dorures, superlatifs). Sobriété et émotion.
- Public : acquéreurs et vendeurs premium, FR et EN.
- Le site a deux faces : vitrine publique + back-office admin.

## 2. Stack et frontières

- React 18 + Vite + TS. Tailwind + shadcn/ui. react-router v6.
- Backend = **Lovable Cloud** (Supabase managé). Ne jamais parler de
  « Supabase » à l'utilisateur final : dire « Lovable Cloud » ou
  « backend ».
- Pas de framework SSR (pas de Next/Remix/etc.). Ne pas migrer.
- Pas de serveur Node custom. Toute logique backend passe par une
  Edge Function Supabase (`supabase/functions/*`).

## 3. Conventions non négociables

1. **Design tokens uniquement.** Interdit d'écrire `text-white`,
   `bg-black`, `bg-[#hex]` dans un composant. Les tokens HSL sont
   dans `src/index.css` et exposés via `tailwind.config.ts`.
2. **Cartes biens en ratio 3/4 vertical** (règle mémoire projet).
3. **Bilingue FR/EN.** Tout texte visible passe par `t()` du
   `LanguageContext`. Ajouter la clé dans `src/i18n/translations.ts`.
4. **Rôles = table dédiée** `user_roles` + fonction `public.has_role`.
   Jamais de flag `is_admin` sur un profil ou en `localStorage`.
5. **RLS obligatoire** sur toute nouvelle table publique. Toujours
   `GRANT` explicite. Voir `docs/DATABASE.md`.
6. **Pas de secret côté client.** Les seules variables `VITE_*`
   acceptables sont l'URL Supabase, la clé anon, le project id.
7. **Pas de `any`** dans le nouveau code. Utiliser les types générés
   depuis `src/integrations/supabase/types.ts`.
8. **react-query** pour tout accès data ; jamais de `fetch` brut dans
   un composant.

## 4. Objectifs

- Maintenir un site rapide (LCP < 2 s en 4G) et parfaitement
  responsive.
- Simplifier au maximum le travail de l'équipe non-technique via
  l'admin (`/admin/biens`).
- Rendre les fiches biens riches en médias immersifs (photos, vidéos,
  visites virtuelles) **sans casser les fiches existantes**.

## 5. Composants critiques (touche avec précaution)

| Fichier | Pourquoi c'est sensible |
|---|---|
| `src/App.tsx` | Providers + routes ; casser l'ordre = tout casser. |
| `src/auth/AuthContext.tsx` | Session Supabase + isAdmin. |
| `src/auth/AdminGuard.tsx` | Barrière /admin/*. Ne pas court-circuiter. |
| `src/lib/properties.ts` | Contrat de la table `properties` côté front. Modifier en même temps que les types. |
| `src/pages/BienDetail.tsx` | Fiche bien publique — SEO + médias. |
| `src/pages/admin/AdminBienEdit.tsx` | Formulaire CRUD complet. Beaucoup de champs, garder la structure. |
| `src/components/PropertyMediaSection.tsx` | Rendu vidéos + visite virtuelle avec règles d'affichage. |
| `src/components/VirtualTourViewer.tsx` | Iframe tierce (Matterport). Attention CSP / sandbox. |
| `supabase/functions/log-visit/index.ts` | Tracking anonyme (RGPD). Ne pas y stocker de PII. |
| `src/lib/mcp/**` | Outils exposés à ChatGPT via MCP. Toute modif change le contrat public. |

## 6. Fichiers auto-générés — NE PAS ÉDITER À LA MAIN

- `src/integrations/supabase/client.ts` — regénéré par la plateforme.
- `src/integrations/supabase/types.ts` — regénéré après chaque migration.
- `supabase/functions/mcp/index.ts` — bundlé par le plugin Vite MCP
  depuis `src/lib/mcp/index.ts`. Modifier la source, pas la sortie.
- `src/components/ui/*` — shadcn/ui. Composer par-dessus, ne pas
  réécrire.
- `.env` — géré par Lovable Cloud. Modifier via secrets ou reconnect.
- `supabase/config.toml` — géré par la plateforme.

## 7. Dépendances importantes

- `@supabase/supabase-js` — client DB/Auth.
- `@tanstack/react-query` — cache serveur.
- `@lovable.dev/mcp-js` — serveur MCP (auth OAuth via Supabase JWKS).
- `react-hook-form` + `zod` — formulaires.
- `react-helmet-async` — SEO / balises head.
- `framer-motion` — animations éditoriales.
- `lucide-react` — icônes (uniquement, pas d'autre pack).
- `tailwindcss` — v3, pas v4.

## 8. Fonctionnalités importantes

- Liste + fiche bien (public), tri par statut → `display_order` → date.
- Admin biens (CRUD, upload images/documents, réordonnancement).
- Analytics de visite anonymisées (`useVisitTracker` + `log-visit`).
- Serveur MCP exposant 5 outils lecture/écriture bien (voir `docs/API.md`).
- OAuth consent page (`/.lovable/oauth/consent`) pour brancher ChatGPT.

## 9. Stratégie de développement pour un agent IA

1. **Lire d'abord** : `README.md`, ce fichier, puis `docs/ARCHITECTURE.md`
   et le fichier ciblé.
2. **Ne pas modifier** la logique métier tant que le besoin n'est pas
   explicite. Ajouter d'abord la doc / les types.
3. **Toute modif DB** = une migration SQL versionnée dans
   `supabase/migrations/`. Jamais de DDL depuis le front.
4. **Toute modif de contrat MCP** = mettre à jour aussi
   `docs/API.md` et l'entrée correspondante dans le manifest.
5. **Éviter les régressions SEO** : conserver `<title>`,
   `<meta description>`, un seul `<h1>`, `alt` d'images.
6. **Tester** :
   - Build : `bun run build`.
   - Lint : `bun run lint`.
   - Unit : `bun run test`.
   - Runtime : ouvrir la preview, naviguer home → bien → contact,
     puis admin login → édition d'un bien.
7. **Ne pas exposer** de clé service_role ni d'URL de dashboard
   Supabase à l'utilisateur final.
8. **En cas de doute** : demander avant d'agir. Ne pas supprimer de
   bien ni de fichier de contenu.

## 10. Anti-patterns à refuser

- Ajouter un backend Node/Python/Ruby dans le repo → utiliser une
  Edge Function.
- Migrer vers Next.js / Remix / autre → hors périmètre.
- Écrire une couleur en dur (`#RRGGBB`, `text-white`) → tokens.
- Stocker un rôle dans un JWT custom ou en `localStorage` → table.
- Ajouter un `any` « juste pour que ça compile » → typer.
- Introduire une lib UI concurrente de shadcn/Radix → refuser.
