# API_REFERENCE

Référence complète des APIs consommées et exposées par le projet.

Le site n'a pas d'API REST maison. Trois surfaces :

1. **Supabase Data API** via `@supabase/supabase-js` (RLS).
2. **Edge Functions Supabase** (`supabase/functions/*`).
3. **Serveur MCP** exposant des outils aux agents IA.

Voir aussi `docs/API.md` (version longue) et `mcp.md` pour la
configuration MCP.

---

## 1. Supabase Data API

Base URL : `https://<project-ref>.supabase.co/rest/v1/`
Auth : header `apikey` + `Authorization: Bearer <token|anon_key>`.
Client : `import { supabase } from "@/integrations/supabase/client"`.

### `GET properties` (public)
- **Fonction front** : `fetchPublicProperties()`.
- **Filtre RLS** : `status <> 'masque'`.
- **Retour** : `Property[]` trié par statut → `display_order` → date.
- **Erreurs** : `PostgrestError` (statut HTTP transmis).

### `GET properties?featured=eq.true` (public)
- **Fonction front** : `fetchFeaturedProperties(limit = 4)`.
- **Retour** : `Property[]`.

### `GET properties?slug=eq.<slug>` (public)
- **Fonction front** : `fetchPropertyBySlug(slug)`.
- **Retour** : `Property | null`.

### `GET properties` (admin)
- **Fonction front** : `fetchAllProperties()`.
- **Filtre RLS** : admin voit tout (dont `masque`).

### `POST/PATCH properties` (admin)
- **Front** : `AdminBienEdit` via `supabase.from('properties').upsert(...)`.
- **Erreurs** : `42501` (RLS refus), `23505` (unique violation slug).

### `GET user_roles?user_id=eq.<uid>`
- Lecture par l'utilisateur de ses propres rôles.

### Storage
- `POST /storage/v1/object/property-images/<path>` (admin) — upload
  photo. Retourne `{ Key }`.
- `POST /storage/v1/object/sign/property-images/<path>` — URL signée
  (durée courte).
- Idem pour `property-documents`.

---

## 2. Edge Functions

Base URL : `https://<project-ref>.supabase.co/functions/v1/`.

### `POST /log-visit`
Enregistre une visite anonymisée.

- **Auth** : aucune (endpoint public).
- **Body** :
  ```json
  {
    "path": "/biens/villa-porto",
    "referrer": "https://google.com",
    "lang": "fr",
    "viewport": "1440x900"
  }
  ```
- **Réponses** :
  | Statut | Cas |
  |---|---|
  | `204` | Succès. |
  | `400` | Payload invalide. |
  | `500` | Erreur DB. |
- **RGPD** : IP hashée + tronquée. Rétention 13 mois.

### `POST /mcp`
Serveur MCP (Model Context Protocol) pour agents IA.

- **Auth** : OAuth 2.1 (Supabase JWKS, audience `authenticated`).
- **Transport** : MCP Streamable HTTP. Header requis côté client :
  `Accept: application/json, text/event-stream`.
- **Découverte** : `GET /.lovable/oauth/consent` (page React locale)
  pour l'écran de consentement.
- **Réponses** : conformes MCP (`initialize`, `tools/list`,
  `tools/call`).

---

## 3. Outils MCP

Contrat détaillé dans `src/lib/mcp/tools/*`. Toute mutation exige un
rôle admin (vérifié via `user_roles`).

| Outil | Type | Paramètres | Retour |
|---|---|---|---|
| `list_properties` | read | `include_hidden?: boolean`, `limit?: 1..200` | liste (colonnes essentielles) |
| `get_property` | read | un de `id`, `slug`, `internal_ref` | bien complet |
| `search_properties` | read | `city?`, `property_type?`, `status?`, `min_price?`, `max_price?`, `limit?` | `{ results, count }` |
| `update_property_status` | write (admin) | `id: uuid`, `status: enum` | `{ id, title, status }` |
| `update_property_media` | write (admin) | `id: uuid` + sous-ensemble de `video_url`, `video_url_2`, `drone_video_url`, `hero_video_url`, `virtual_tour_url`, `virtual_tour_iframe`, `matterport_id`, `show_video`, `show_virtual_tour` | bien mis à jour |

Erreurs standard :
- `Not authenticated` — JWT absent ou invalide.
- `Admin role required` — le rôle admin manque.
- `Not found` — id/slug inconnu.
- `No fields to update` — patch vide.

---

## 4. Codes d'erreur transverses

| Code | Sens | Action attendue |
|---|---|---|
| `PGRST116` | Row not found (`maybeSingle`) | Retourner `null`. |
| `42501` | Insufficient privilege (RLS) | Vérifier le rôle / policy. |
| `23505` | Unique violation | Message utilisateur (slug pris). |
| `401` | Session expirée | Rediriger vers `/admin/login`. |
| `429` | Rate limit provider | Backoff exponentiel. |

---

## 5. Formats communs

- Dates : ISO 8601 UTC (`created_at`, `updated_at`).
- Prix : `price_amount` en entier (EUR), affichage via `formatPrice()`.
- IDs : UUID v4.
- Slugs : `[a-z0-9-]+`, uniques, générés côté admin.
