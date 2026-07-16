# MCP — Model Context Protocol

Ce projet a **un** serveur MCP embarqué et peut être branché à
plusieurs MCP tiers côté agent IA. Ce document liste ce qui est
en place, ce qui est disponible, et ce qui n'est **pas** utilisé.

Le protocole MCP (Anthropic) permet à un agent IA d'appeler des
outils exposés par une application via un contrat standardisé.

---

## 1. Serveur MCP embarqué : `cabinet-pietri-mcp`

- **Source** : `src/lib/mcp/index.ts` (+ outils dans
  `src/lib/mcp/tools/*.ts`).
- **Bundle auto** : plugin Vite `@lovable.dev/mcp-js/stacks/supabase/vite`
  → `supabase/functions/mcp/index.ts` (ne pas éditer à la main).
- **Endpoint** : `POST https://<project-ref>.supabase.co/functions/v1/mcp`.
- **Auth** : OAuth 2.1, issuer `https://<project-ref>.supabase.co/auth/v1`,
  audience `authenticated` (Supabase JWKS).
- **Consentement** : `/.lovable/oauth/consent` (page React).
- **Transport** : MCP Streamable HTTP. Header client requis :
  `Accept: application/json, text/event-stream`.
- **Outils** (voir `API_REFERENCE.md` §3) :
  - `list_properties` (lecture)
  - `get_property` (lecture)
  - `search_properties` (lecture)
  - `update_property_status` (écriture, admin)
  - `update_property_media` (écriture, admin)

### Brancher ChatGPT
1. Paramètres ChatGPT → **Connectors** → **Add custom connector**.
2. URL du serveur : celle ci-dessus.
3. Se connecter avec les identifiants admin du site.
4. ChatGPT reçoit les outils et peut interroger / modifier les biens.

### Brancher Claude Desktop
1. Configurer le fichier `claude_desktop_config.json` :
   ```json
   {
     "mcpServers": {
       "cabinet-pietri": {
         "url": "https://<project-ref>.supabase.co/functions/v1/mcp"
       }
     }
   }
   ```
2. Autoriser via l'écran de consentement.

### Brancher Codex CLI
Ajouter la même URL dans la config MCP de Codex.

---

## 2. MCP côté Lovable (agent qui construit le site)

Lovable peut se brancher à des MCP tiers pour enrichir le contexte
d'aide au développement. Les connecteurs sont gérés dans la section
**Connectors** de Lovable (niveau workspace).

### Disponibles / recommandés selon le besoin

| MCP | Utilité pour ce projet | Priorité |
|---|---|---|
| **GitHub** | Sync code + collaboration multi-agent. À activer via + → GitHub → Connect project. | Haute |
| **Supabase** (Cloud interne) | Déjà utilisé par Lovable Cloud pour DB / Auth / Storage / Edge Functions. Rien à installer. | N/A (natif) |
| **Figma** (desktop-local MCP) | Récupérer des specs de design depuis Figma pendant l'itération. Installation via Lovable Desktop + Dev Mode Figma. | Moyenne |
| **Sentry** | Suivi d'erreurs runtime. À brancher quand on activera le monitoring (V2). | Moyenne |
| **Linear** / **Notion** | Contexte roadmap / tickets. À activer si l'équipe passe sur Linear ou Notion. | Basse |
| **PostHog** | Analytics produit (compléterait `visit_logs`). Envisageable V2. | Basse |

### Non utilisés / hors périmètre actuel

| MCP | Statut | Raison |
|---|---|---|
| **Stripe** | Non branché. | Pas de paiement en ligne dans le périmètre. |
| **Resend** | Non branché. | Emails transactionnels non requis pour l'instant (le formulaire de contact ne poste pas d'email backend). |
| **21st.dev** | Non branché. | Non nécessaire tant que le design system est stabilisé. |
| **Browser MCP** | Utilisé en debug ponctuel par les agents (Playwright), pas en runtime app. | Outil interne agent. |
| **HeyGen / Canva / Miro / Amplitude / Atlassian / Sanity / n8n / Hex / Granola / Polar** | Non branchés. | Non pertinents pour ce site vitrine. |

---

## 3. Règles MCP

1. Toute modification du contrat MCP embarqué (ajout / retrait / renommage
   d'outil, changement de schema) doit être documentée dans
   `API_REFERENCE.md` et dans `.ai/decision-log.md`.
2. Un outil d'écriture doit **toujours** vérifier le rôle admin via
   `user_roles` (voir `src/lib/mcp/tools/update-*.ts`).
3. Un outil ne doit jamais exposer de PII de `visit_logs`.
4. Les MCP tiers activés côté agent ne doivent jamais recevoir la
   clé `SUPABASE_SERVICE_ROLE_KEY` ou tout autre secret backend.
5. Toute nouvelle intégration MCP tierce doit être ajoutée dans le
   tableau §2 avec sa justification.

---

## 4. Références

- Spec MCP : https://modelcontextprotocol.io
- SDK utilisé : `@lovable.dev/mcp-js` (v0.22+).
- Docs Lovable MCP : voir base de connaissances Lovable.
