# .ai/decision-log.md

Journal court des décisions prises pendant le développement (autres
que les décisions d'architecture, qui vont dans
`architecture-decisions.md`). Append-only.

Format :
```
## YYYY-MM-DD — Décision
**Contexte** : …
**Décision** : …
**Alternatives écartées** : …
**Conséquences** : …
```

---

## 2026-07-16 — Documentation IA-ready séparée
**Contexte** : Le projet va être développé par plusieurs agents IA.
**Décision** : Centraliser la doc à la racine (`README`, `ARCHITECTURE`,
`DESIGN_SYSTEM`, etc.) + un dossier `.ai/` pour l'état inter-agent.
**Alternatives écartées** : Tout mettre sous `docs/` uniquement (moins
visible pour un agent qui n'ouvre que la racine).
**Conséquences** : Les fichiers `docs/*` déjà présents restent en
version longue et sont référencés depuis la racine.

## 2026-07-16 — Serveur MCP dans la même base de code
**Contexte** : ChatGPT / Claude doivent pouvoir lire et modifier les
biens.
**Décision** : Utiliser `@lovable.dev/mcp-js` avec un plugin Vite qui
bundle vers `supabase/functions/mcp/index.ts`. OAuth via Supabase JWKS.
**Alternatives écartées** : Serveur MCP externe (surcoût d'hébergement
+ duplication d'auth).
**Conséquences** : Le fichier `supabase/functions/mcp/index.ts` est
auto-généré, ne pas l'éditer.

## 2026-06-26 — Champs médias immersifs directement sur `properties`
**Contexte** : Éviter de créer une table `property_media` séparée pour
un besoin encore restreint.
**Décision** : Ajouter les colonnes vidéo / visite virtuelle sur
`properties` avec deux toggles `show_video` / `show_virtual_tour`.
**Alternatives écartées** : Table `property_media(id, property_id, kind, url)`
(plus flexible mais surdimensionnée aujourd'hui).
**Conséquences** : Si le besoin dépasse ~3 vidéos par bien, prévoir
la table dédiée en V3.
