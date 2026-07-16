# .ai/tasks.md

File-based backlog partagé entre agents IA. **Append-only** pour
l'historique ; les tâches actives peuvent être cochées/déplacées.

Format d'une tâche :
```
- [ ] [prio] [owner|any] Titre court — contexte / lien
```
- `prio` : `P0` (bloquant) · `P1` (haut) · `P2` (moyen) · `P3` (bas).
- `owner` : `lovable`, `codex`, `claude`, `gemini`, `chatgpt`, ou `any`.

---

## Actives

- [ ] P1 any Supprimer les `any` restants (surtout `mapRow` dans
      `src/lib/properties.ts`) — voir `TODO.md`.
- [ ] P1 any Ajouter hooks react-query `useProperties()` et
      `useProperty(slug)` pour remplacer les fetchs directs.
- [ ] P2 any Générer `sitemap.xml` dynamique à partir des biens
      visibles.
- [ ] P2 any Ajouter JSON-LD `RealEstateListing` sur `/biens/:slug`.
- [ ] P2 any Tests unitaires vitest sur `sortForPublic`,
      `formatPrice`, `formatLocation`.
- [ ] P2 any Scaffold Playwright (dossier `e2e/`, config, sample
      test qui ne tourne pas en CI).
- [ ] P3 any Internationaliser les libellés admin (FR only
      actuellement).
- [ ] P3 any Historiser les changements de statut
      (`property_status_log`).

## Faites (extrait)

- [x] Documentation IA-ready (README, ARCHITECTURE, DESIGN_SYSTEM,
      API_REFERENCE, DATABASE, COMPONENTS, DEPLOYMENT, PROJECT_RULES,
      AI_CONTEXT, CHANGELOG, TODO, mcp.md, `.ai/*`, `docs/AUDIT.md`).
- [x] Serveur MCP + OAuth consent.
- [x] Champs médias immersifs + `PropertyMediaSection`.
