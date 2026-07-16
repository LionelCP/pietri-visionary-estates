# CHANGELOG

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/).
Dates au format `YYYY-MM-DD`. Semver informel (le site n'est pas
distribué comme lib).

---

## [Unreleased]

### Added
- Documentation IA-ready complète :
  - `README.md`, `AI_CONTEXT.md`, `PROJECT_RULES.md`,
    `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `API_REFERENCE.md`,
    `DATABASE.md`, `COMPONENTS.md`, `DEPLOYMENT.md`, `TODO.md`,
    `CHANGELOG.md`, `mcp.md`.
  - Dossier `.ai/` : `tasks.md`, `roadmap.md`, `coding-style.md`,
    `prompt-history.md`, `decision-log.md`,
    `architecture-decisions.md`.
  - `docs/AUDIT.md` (SEO / a11y / perf / responsive / sécurité / UX).
  - `.env.example` documenté.

### Changed
- Aucun changement fonctionnel ni graphique.

---

## [0.3.0] — 2026-07-16

### Added
- Serveur MCP `cabinet-pietri-mcp` (Edge Function `mcp`) exposant
  5 outils : `list_properties`, `get_property`, `search_properties`,
  `update_property_status`, `update_property_media`.
- Page de consentement OAuth `/.lovable/oauth/consent`.
- Redirection `next` sur `AdminLogin` pour flow OAuth.
- Plugin Vite `mcpPlugin()` (bundle auto vers
  `supabase/functions/mcp/index.ts`).

### Changed
- `AdminLogin` accepte un paramètre `next` pour reprise post-login.

---

## [0.2.0] — 2026-06-26

### Added
- Champs médias immersifs sur `properties` :
  `video_url`, `video_url_2`, `video_file_url`, `hero_video_url`,
  `drone_video_url`, `virtual_tour_url`, `virtual_tour_iframe`,
  `matterport_id`, `show_video`, `show_virtual_tour`.
- Composants `PropertyMediaSection` et `VirtualTourViewer`.
- Section médias dans `AdminBienEdit`.

### Changed
- `BienDetail` intègre `PropertyMediaSection` (rendu conditionnel).

---

## [0.1.0] — jalon initial

### Added
- Site public bilingue FR/EN (React + Vite + Tailwind + shadcn/ui).
- Pages : Home, Biens, BienDetail, Destinations, Signature, Services,
  Acheter, About, Contact, Confidentialite, NotFound.
- Back-office admin : login, liste des biens, édition, analytics.
- Table `properties`, `user_roles`, `visit_logs` avec RLS.
- Edge Function `log-visit` (tracking anonyme).
- Buckets Storage `property-images`, `property-documents`.
- i18n via React Context.
- Design system Noir & Or, Playfair Display / Outfit.
