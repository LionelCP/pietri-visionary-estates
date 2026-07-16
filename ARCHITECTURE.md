# ARCHITECTURE

Vue synthétique de l'architecture du projet. Voir `docs/ARCHITECTURE.md`
pour les diagrammes de flux, et `COMPONENTS.md` / `DATABASE.md` /
`API_REFERENCE.md` pour le détail par couche.

---

## Vue en couches

```
┌─────────────────────────────────────────────────────────────┐
│  UI (src/pages, src/components, src/components/home)        │
│  - React 18 + shadcn/ui + Tailwind tokens                   │
├─────────────────────────────────────────────────────────────┤
│  Contextes (src/i18n, src/auth)                             │
│  - LanguageProvider, AuthProvider                            │
├─────────────────────────────────────────────────────────────┤
│  Data layer (src/lib, @tanstack/react-query)                │
│  - properties.ts (accès Postgres + helpers)                  │
│  - mcp/ (contrats outils IA)                                 │
├─────────────────────────────────────────────────────────────┤
│  Client Supabase (src/integrations/supabase, auto-généré)    │
├─────────────────────────────────────────────────────────────┤
│  Lovable Cloud (Postgres + Auth + Storage + Edge Functions) │
└─────────────────────────────────────────────────────────────┘
```

---

## Arborescence commentée

Chaque dossier a un **propriétaire logique** (agent responsable par
défaut) et des **dépendances** (ce qu'il utilise).

### `/` (racine)
- **Rôle** : fichiers de config projet + documentation.
- **Propriétaire** : Lead architect (Codex/Claude/Lovable).
- **Contient** : `README.md`, `AI_CONTEXT.md`, `PROJECT_RULES.md`,
  `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `API_REFERENCE.md`,
  `DATABASE.md`, `COMPONENTS.md`, `DEPLOYMENT.md`, `CHANGELOG.md`,
  `TODO.md`, `mcp.md`, `.env.example`, `package.json`, `vite.config.ts`,
  `tailwind.config.ts`, `tsconfig*.json`, `eslint.config.js`,
  `postcss.config.js`, `vitest.config.ts`, `components.json`.

### `/.ai`
- **Rôle** : espace partagé entre agents IA (tâches, ADR, style).
- **Propriétaire** : tout agent (append-only pour l'historique).
- **Dépendances** : aucune (markdown seul).

### `/docs`
- **Rôle** : documentation longue forme (architecture, DB, API,
  composants, guide admin).
- **Propriétaire** : Lead architect.
- **Dépendances** : miroir de l'état réel du code.

### `/public`
- **Rôle** : assets statiques servis à la racine (`favicon`,
  `robots.txt`, `placeholder.svg`, `llms.txt`).
- **Propriétaire** : équipe design.
- **Dépendances** : aucune.

### `/src`
- **Rôle** : code applicatif React.
- **Propriétaire** : équipe front (Lovable/Codex/Claude).
- **Dépendances** : `@/*` = alias vers `/src`.

#### `/src/assets`
- **Rôle** : images importées via ES modules.
- **Dépendances** : Vite (assets pipeline).

#### `/src/auth`
- **Rôle** : session + garde admin.
- **Fichiers** : `AuthContext.tsx`, `AdminGuard.tsx`.
- **Dépendances** : `@/integrations/supabase/client`.
- **Utilisé par** : `App.tsx`, pages `/admin/*`.

#### `/src/components`
- **Rôle** : composants réutilisables.
- **Sous-dossiers** :
  - `home/` — sections spécifiques à la home.
  - `ui/` — shadcn/ui (généré, ne pas réécrire).
- **Dépendances** : Tailwind tokens, shadcn/ui, `lucide-react`,
  `framer-motion`.

#### `/src/data`
- **Rôle** : données locales de fallback / démo (biens statiques
  historiques).
- **Dépendances** : aucune.
- **À terme** : à supprimer une fois la DB seule source (voir TODO).

#### `/src/hooks`
- **Rôle** : hooks React réutilisables (`useVisitTracker`,
  `use-mobile`, `use-toast`).
- **Dépendances** : contextes globaux, supabase client.

#### `/src/i18n`
- **Rôle** : contexte langue + dictionnaire FR/EN.
- **Fichiers** : `LanguageContext.tsx`, `translations.ts`.
- **Dépendances** : aucune (React seul).

#### `/src/integrations/supabase`
- **Rôle** : client Supabase + types générés.
- **Propriétaire** : Lovable Cloud (auto-généré).
- **⚠️ Ne pas éditer à la main.**

#### `/src/lib`
- **Rôle** : logique partagée non-UI.
- **Contenu** : `properties.ts` (accès DB + helpers biens),
  `utils.ts` (`cn()`), `mcp/` (outils MCP).
- **Dépendances** : `@/integrations/supabase/client`.

#### `/src/pages`
- **Rôle** : composants de route (un fichier = une route).
- **Sous-dossiers** : `admin/` (pages back-office).
- **Dépendances** : composants, hooks, i18n, lib.

#### `/src/test`
- **Rôle** : setup vitest (`setup.ts`) + tests unitaires.
- **Dépendances** : `vitest`, `@testing-library/react`.

### `/supabase`
- **Rôle** : ressources backend versionnées.
- **Propriétaire** : Lovable Cloud pour `config.toml`, dev pour
  `functions/` et `migrations/`.
- **Sous-dossiers** :
  - `functions/log-visit/` — tracking anonyme.
  - `functions/mcp/` — serveur MCP (auto-généré, ne pas éditer).
  - `migrations/` — SQL versionné.

---

## Contrats inter-couches

| Frontière | Contrat |
|---|---|
| UI ↔ Data | Hooks react-query wrappant les fonctions de `src/lib/properties.ts`. |
| Data ↔ DB | supabase-js typé via `src/integrations/supabase/types.ts`. |
| UI ↔ i18n | `t(key: string)` du `LanguageContext`. |
| Client ↔ Edge Function | `fetch` JSON POST vers `/functions/v1/<name>`. |
| Agent IA ↔ App | Serveur MCP (outils dans `src/lib/mcp/tools/*`). |

Voir `.ai/architecture-decisions.md` pour l'historique des choix.
