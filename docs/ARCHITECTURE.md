# Architecture

## Vue d'ensemble

```
                ┌──────────────────────────────┐
   Visiteur ──► │  React SPA (Vite)            │
                │  - Pages publiques            │
                │  - i18n FR/EN                 │
                │  - Design tokens (Tailwind)   │
                └──────────────┬───────────────┘
                               │  supabase-js (anon key + RLS)
                               ▼
                ┌──────────────────────────────┐
                │  Lovable Cloud (Supabase)     │
                │  ┌────────────────────────┐   │
                │  │ Postgres               │   │
                │  │  - properties          │   │
                │  │  - user_roles          │   │
                │  │  - visit_logs          │   │
                │  │  RLS + has_role()      │   │
                │  └────────────────────────┘   │
                │  ┌────────────────────────┐   │
                │  │ Auth (email + JWKS)    │   │
                │  └────────────────────────┘   │
                │  ┌────────────────────────┐   │
                │  │ Storage                │   │
                │  │  - property-images     │   │
                │  │  - property-documents  │   │
                │  └────────────────────────┘   │
                │  ┌────────────────────────┐   │
                │  │ Edge Functions         │   │
                │  │  - log-visit           │◄──┼── useVisitTracker
                │  │  - mcp (OAuth)         │◄──┼── ChatGPT / Codex
                │  └────────────────────────┘   │
                └──────────────────────────────┘
```

## Flux principaux

### 1. Affichage d'un bien public
1. `Biens` (ou `Index` via `FeaturedProperties`) appelle
   `fetchPublicProperties()` / `fetchFeaturedProperties()`.
2. RLS filtre : le rôle `anon` ne voit que `status ≠ 'masque'`.
3. Le tri est stabilisé côté client par `sortForPublic()`
   (statut → display_order → date).
4. `BienDetail` fait `fetchPropertyBySlug(slug)` et rend
   `PropertyMediaSection` si au moins une vidéo ou visite est
   renseignée et le toggle correspondant activé.

### 2. Édition admin
1. `AdminLogin` → session Supabase.
2. `AdminGuard` vérifie `has_role(uid, 'admin')`.
3. `AdminBiensList` fait `fetchAllProperties()` (inclut `masque`).
4. `AdminBienEdit` : formulaire react-hook-form → `upsert` sur
   `properties` + upload dans les buckets `property-*`.

### 3. Tracking anonyme
1. `useVisitTracker` (monté globalement) capte les navigations.
2. Envoie route, referrer, langue, viewport à `log-visit`.
3. La fonction écrit dans `visit_logs` (RLS : lecture admin seule).
4. Purge auto > 13 mois via `purge_old_visit_logs()`.

### 4. Accès agent IA (MCP)
1. ChatGPT ouvre le connecteur MCP → OAuth Supabase.
2. `/.lovable/oauth/consent` (page React) autorise la portée.
3. L'edge function `mcp` valide le JWT (audience `authenticated`)
   et propage les appels aux outils `src/lib/mcp/tools/*`.
4. Les outils d'écriture vérifient `user_roles.role = 'admin'`.

## Choix structurants

- **Client-only + Edge Functions** : pas de serveur Node dédié, tout
  passe par supabase-js côté client (avec RLS) et par des edge
  functions pour les besoins server-side.
- **Types partagés** : le contrat DB est généré (`types.ts`) puis
  enrichi par `Property` dans `src/lib/properties.ts` pour ajouter
  les types des colonnes JSON (`gallery`, `highlights`).
- **i18n minimaliste** : pas de `i18next`, un simple Context +
  dictionnaire (`translations.ts`). Suffisant pour 2 langues.
- **Tri déterministe** : côté client pour rester stable même si la
  requête DB ne peut pas faire tous les tris (ex : ordre custom
  sur enum).
