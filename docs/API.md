# API

Le site n'expose pas d'API REST maison. Toutes les interactions
serveur passent par :

1. **Supabase REST/PostgREST** via `@supabase/supabase-js` (RLS).
2. **Edge Functions** Supabase (`supabase/functions/*`).
3. **Serveur MCP** pour les agents IA.

---

## 1. Accès Postgres via supabase-js

Client : `import { supabase } from "@/integrations/supabase/client"`.

### Table `properties`

| Opération | Fonction front | RLS effective |
|---|---|---|
| Liste publique | `fetchPublicProperties()` | anon lit `status ≠ 'masque'`. |
| Liste vedettes | `fetchFeaturedProperties(limit)` | idem + `featured = true`. |
| Détail public | `fetchPropertyBySlug(slug)` | idem + slug. |
| Liste admin | `fetchAllProperties()` | admin lit tout. |
| Upsert admin | `supabase.from('properties').upsert(...)` | admin uniquement. |

Voir `src/lib/properties.ts` pour la signature exacte et le type
`Property`.

### Table `user_roles`
Lecture par l'utilisateur (ses propres rôles) et service_role.
Écriture réservée à service_role via edge function ou migration.

### Table `visit_logs`
Écriture via edge function `log-visit` (service_role).
Lecture réservée aux admins.

---

## 2. Edge Functions

### `POST /functions/v1/log-visit`

Enregistre une visite anonymisée.

- **Auth** : aucune (fonction publique, IP hashée côté serveur).
- **Body JSON** :
  ```json
  {
    "path": "/biens/villa-porto",
    "referrer": "https://google.com",
    "lang": "fr",
    "viewport": "1440x900"
  }
  ```
- **Réponse** : `204 No Content` en succès, `4xx` si payload invalide.
- **Erreurs** : `400` (validation), `500` (DB indisponible).
- **RGPD** : aucune donnée personnelle. IP hashée + tronquée avant
  écriture. Rétention 13 mois (`purge_old_visit_logs`).

### `POST /functions/v1/mcp`

Serveur MCP (Model Context Protocol) pour agents IA.

- **Auth** : OAuth 2.1 via Supabase JWKS (audience `authenticated`).
- **Transport** : MCP Streamable HTTP. Les clients doivent envoyer
  `Accept: application/json, text/event-stream`.
- **Outils exposés** : voir §3.

---

## 3. Outils MCP

Définis dans `src/lib/mcp/tools/*`. Toute mutation exige un rôle
admin (vérifié via `user_roles`).

### `list_properties`
- **Type** : lecture.
- **Params** :
  - `include_hidden?: boolean` — inclure `status = 'masque'` (admin).
  - `limit?: number (1..200)`.
- **Réponse** : liste de biens (colonnes essentielles).
- **Erreurs** : `Not authenticated`.

### `get_property`
- **Type** : lecture.
- **Params** : au moins un de `id | slug | internal_ref`.
- **Réponse** : bien complet.
- **Erreurs** : `Not authenticated`, `Not found`, params manquants.

### `search_properties`
- **Type** : lecture.
- **Params** : `city?`, `property_type?`, `status?`, `min_price?`,
  `max_price?`, `limit?`.
- **Réponse** : `{ results, count }`.

### `update_property_status`
- **Type** : écriture (admin).
- **Params** : `{ id: uuid, status: 'disponible' | 'sous_offre' | 'reserve' | 'vendu' | 'masque' }`.
- **Réponse** : bien mis à jour.
- **Erreurs** : `Not authenticated`, `Admin role required`.

### `update_property_media`
- **Type** : écriture (admin).
- **Params** : `id: uuid` + n'importe quel sous-ensemble de
  `video_url`, `video_url_2`, `drone_video_url`, `hero_video_url`,
  `virtual_tour_url`, `virtual_tour_iframe`, `matterport_id`,
  `show_video`, `show_virtual_tour`.
- **Comportement** : seuls les champs fournis sont mis à jour.
- **Erreurs** : `Not authenticated`, `Admin role required`,
  `No fields to update`.

---

## 4. Storage

| Bucket | Public | Usage |
|---|---|---|
| `property-images` | Non | Photos des biens (galerie). URL signées. |
| `property-documents` | Non | Documents (plans, DPE, brochures). URL signées. |

Écriture réservée aux admins ; lecture via URL signée générée
côté client authentifié admin ou côté serveur pour la vitrine.
