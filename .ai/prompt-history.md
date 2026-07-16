# .ai/prompt-history.md

Journal chronologique des prompts utilisateur significatifs et de
la réponse structurelle associée. Sert à retracer l'intention.

Format :
```
## YYYY-MM-DD — Titre
**Prompt (résumé)** : …
**Décision / Livrable** : …
**Fichiers impactés** : …
```

---

## 2026-07-16 — AI Ready Project v2

**Prompt (résumé)** : Préparer le projet pour une collaboration entre
plusieurs agents IA (Lovable, ChatGPT, Codex, Claude, Gemini). Créer
toute la documentation demandée sans modifier code métier ni design.

**Décision / Livrable** : Ajout de la documentation IA-ready complète
(README, AI_CONTEXT, PROJECT_RULES, ARCHITECTURE, DESIGN_SYSTEM,
API_REFERENCE, DATABASE, COMPONENTS, DEPLOYMENT, CHANGELOG, TODO,
mcp.md, `.ai/*`, `docs/AUDIT.md`). Aucun changement de code métier.

**Fichiers impactés** : voir `CHANGELOG.md` section `[Unreleased]`.

---

## 2026-07-16 — Guide + Connecteur MCP + GitHub

**Prompt (résumé)** : Rendre le projet partageable avec ChatGPT via
GitHub, ZIP, et connecteur MCP.

**Décision / Livrable** : Mise en place du serveur MCP
`cabinet-pietri-mcp` (5 outils), page OAuth consent, guide PDF
utilisateur.

**Fichiers impactés** : `src/lib/mcp/**`, `src/pages/OAuthConsent.tsx`,
`supabase/functions/mcp/index.ts` (auto), `vite.config.ts`,
`src/App.tsx`, `src/pages/admin/AdminLogin.tsx`.

---

## 2026-06-26 — Médias immersifs sur fiches biens

**Prompt (résumé)** : Permettre d'ajouter vidéos / visites virtuelles
sans toucher au code.

**Décision / Livrable** : Ajout de 10 champs média sur `properties` +
composants `PropertyMediaSection` et `VirtualTourViewer` + section
médias dans l'admin.

**Fichiers impactés** : migration properties, `src/lib/properties.ts`,
`src/pages/BienDetail.tsx`, `src/pages/admin/AdminBienEdit.tsx`,
`src/components/PropertyMediaSection.tsx`.
