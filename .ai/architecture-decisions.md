# .ai/architecture-decisions.md

Architecture Decision Records (ADR) — format court inspiré de
Michael Nygard. Une décision architecturale = un bloc numéroté.
Append-only. Ne pas éditer un ADR passé ; en écrire un nouveau qui
le supersede.

Format :
```
## ADR-NNN — Titre
- Date : YYYY-MM-DD
- Statut : Proposé | Accepté | Superseded by ADR-XXX
- Contexte
- Décision
- Conséquences
```

---

## ADR-001 — Stack React + Vite + Tailwind + shadcn/ui
- Date : 2026-Q2 (initial)
- Statut : Accepté
- **Contexte** : Site vitrine + back-office léger, besoin d'un design
  éditorial fin. Pas de besoin SSR (contenu bilingue peu volumineux,
  SEO gérable avec react-helmet-async + prerender Lovable).
- **Décision** : SPA React 18 + Vite. Tailwind v3 avec tokens
  sémantiques. shadcn/ui + Radix pour les primitives accessibles.
- **Conséquences** : Pas de SSR. Le SEO repose sur le prerender
  Lovable et les balises `react-helmet-async`. Une évolution
  vers Next/Remix serait un chantier majeur (voir ADR futur).

## ADR-002 — Lovable Cloud (Supabase) comme backend unique
- Date : 2026-Q2 (initial)
- Statut : Accepté
- **Contexte** : Besoin DB + Auth + Storage + Edge Functions sans
  ops.
- **Décision** : Lovable Cloud (Supabase managé). RLS activée sur
  toutes les tables `public`. Pas de serveur Node séparé.
- **Conséquences** : Toute logique server-side passe par une Edge
  Function. Les secrets serveur ne sont pas exposés au client
  (seulement `VITE_*` publics).

## ADR-003 — Rôles dans une table dédiée `user_roles`
- Date : 2026-Q2 (initial)
- Statut : Accepté
- **Contexte** : Éviter les élévations de privilège via profil
  éditable ou JWT custom.
- **Décision** : Table `user_roles(user_id, role app_role)` +
  fonction `has_role` `SECURITY DEFINER`. Toute policy admin passe
  par `has_role(auth.uid(), 'admin')`.
- **Conséquences** : Impossible d'attribuer un rôle depuis le
  client. L'attribution passe par migration ou edge function
  admin.

## ADR-004 — i18n via Context maison (pas de i18next)
- Date : 2026-Q2 (initial)
- Statut : Accepté
- **Contexte** : Deux langues (FR/EN), dictionnaire modeste.
- **Décision** : `LanguageContext` maison + `translations.ts`.
- **Conséquences** : Zéro dépendance i18n. À reconsidérer si on
  ajoute une 3ᵉ langue ou de la pluralisation avancée.

## ADR-005 — Cartes de biens en ratio 3/4 vertical
- Date : 2026-Q3
- Statut : Accepté
- **Contexte** : Différenciation éditoriale, mise en valeur des
  photos verticales de biens.
- **Décision** : Ratio 3/4 imposé via `AspectRatio` shadcn/ui.
- **Conséquences** : Toute nouvelle carte bien doit respecter ce
  ratio (règle mémoire projet).

## ADR-006 — Serveur MCP embarqué via `@lovable.dev/mcp-js`
- Date : 2026-07-16
- Statut : Accepté
- **Contexte** : Ouvrir le site à ChatGPT / Claude pour l'aide
  éditoriale et l'administration légère.
- **Décision** : Serveur MCP dans `src/lib/mcp/`, bundlé par un
  plugin Vite vers l'edge function `mcp`. OAuth 2.1 via Supabase
  JWKS.
- **Conséquences** : Le fichier `supabase/functions/mcp/index.ts`
  est auto-généré. Toute évolution passe par la source
  `src/lib/mcp/`.

## ADR-007 — Champs médias immersifs sur `properties`
- Date : 2026-06-26
- Statut : Accepté (à reconsidérer en V3)
- **Contexte** : Besoin d'ajouter vidéos + visites virtuelles sans
  créer une table dédiée immédiate.
- **Décision** : Colonnes ajoutées directement sur `properties` +
  toggles `show_video`, `show_virtual_tour`.
- **Conséquences** : Simple aujourd'hui, à migrer vers
  `property_media` si > 3 vidéos par bien.

## ADR-008 — Documentation IA-ready comme artefact de premier ordre
- Date : 2026-07-16
- Statut : Accepté
- **Contexte** : Plusieurs agents IA vont co-développer le projet.
- **Décision** : Docs à la racine (`README`, `ARCHITECTURE`,
  `DESIGN_SYSTEM`, `PROJECT_RULES`, `API_REFERENCE`, `DATABASE`,
  `COMPONENTS`, `DEPLOYMENT`, `AI_CONTEXT`, `CHANGELOG`, `TODO`,
  `mcp.md`) + dossier `.ai/` pour l'état inter-agent + `docs/AUDIT.md`.
- **Conséquences** : Toute évolution de code notable doit être
  reflétée dans les fichiers correspondants et dans le CHANGELOG.
