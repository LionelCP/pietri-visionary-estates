# Base de données

Backend : Lovable Cloud (Postgres géré par Supabase). Toutes les
modifications de schéma passent par une migration SQL versionnée
dans `supabase/migrations/`.

Le fichier de types généré (`src/integrations/supabase/types.ts`)
est la source de vérité côté TypeScript. Ne pas l'éditer à la main.

---

## Tables

### `public.properties`
Fiche d'un bien immobilier. 49 colonnes.

Groupes de colonnes :

| Groupe | Colonnes principales |
|---|---|
| Identité | `id`, `slug`, `internal_ref`, `title` |
| Statut & tri | `status` (enum), `display_order`, `featured`, `coup_de_coeur` |
| Localisation | `region`, `city`, `sector` |
| Prix | `price_amount`, `price_display`, `price_on_request` |
| Caractéristiques | `area_m2`, `rooms`, `bedrooms`, `bathrooms`, `floor` |
| Booléens vue/extérieurs | `has_terrace`, `has_garden`, `has_balcony`, `has_sea_view`, `has_mountain_view`, `has_open_view` |
| Descriptions | `short_description`, `long_description`, `short_description_en`, `long_description_en`, `highlights[]` |
| Énergie | `energy_class` |
| Médias | `main_image_url`, `gallery` (jsonb), `plan_pdf_url` |
| Médias immersifs | `video_url`, `video_url_2`, `video_file_url`, `hero_video_url`, `drone_video_url`, `virtual_tour_url`, `virtual_tour_iframe`, `matterport_id`, `show_video`, `show_virtual_tour` |
| SEO | `seo_title`, `seo_description` |
| Meta | `created_at`, `updated_at` |

**Policies (RLS activée)** :
- Lecture publique : `status <> 'masque'`.
- Lecture admin : tout, via `has_role(auth.uid(), 'admin')`.
- Écriture (insert/update/delete) : admin uniquement.

### `public.user_roles`
Rôles utilisateurs. Table dédiée obligatoire (jamais sur un profil).

Colonnes : `id`, `user_id (fk auth.users)`, `role (enum app_role)`,
`created_at`. Unique `(user_id, role)`.

**Policies** :
- `SELECT` : l'utilisateur voit ses propres rôles ; service_role
  voit tout.
- Écriture réservée à service_role (via edge function / migration).

### `public.visit_logs`
Journal anonyme des visites. Colonnes principales : `path`,
`referrer`, `lang`, `viewport`, `country`, `ip_hash`, `session_id`,
`created_at`.

**Policies** :
- `INSERT` : service_role (edge function `log-visit`).
- `SELECT` : admin uniquement.

Purge automatique via `purge_old_visit_logs()` (> 13 mois).

---

## Types enum

```sql
create type public.app_role as enum ('admin', 'moderator', 'user');
-- + enums métier définis dans les migrations properties :
--   property_status, property_type, property_region
```

Types métier front (miroir) : `PropertyStatus`, `PropertyType`,
`PropertyRegion` dans `src/lib/properties.ts`.

---

## Fonctions SQL

### `public.has_role(_user_id uuid, _role app_role) → boolean`
`SECURITY DEFINER`, `STABLE`. Utilisée dans les policies pour éviter
les récursions RLS.

### `public.claim_first_admin() → boolean`
`SECURITY DEFINER`. Permet au premier utilisateur connecté de se
promouvoir admin **uniquement** si aucun admin n'existe encore.

### `public.tg_set_updated_at() → trigger`
Met à jour `updated_at` sur `UPDATE`.

### `public.purge_old_visit_logs() → void`
`SECURITY DEFINER`. Supprime les visites de plus de 13 mois.

---

## Storage

| Bucket | Public | Contenu | Politique |
|---|---|---|---|
| `property-images` | Non | Photos des biens | Lecture via URL signée ; upload admin. |
| `property-documents` | Non | Plans, DPE, brochures | Idem. |

---

## Edge Functions

- `log-visit` — insertion anonymisée dans `visit_logs`.
- `mcp` — serveur MCP OAuth (auto-généré depuis `src/lib/mcp/index.ts`).

---

## Règles de contribution DB

1. Toute nouvelle table dans `public` doit :
   - avoir `id uuid primary key default gen_random_uuid()` ;
   - avoir `created_at` et `updated_at` timestamptz + trigger ;
   - `GRANT` explicite sur les rôles cibles ;
   - `ENABLE ROW LEVEL SECURITY` ;
   - au moins une policy explicite (jamais de "policy USING true").
2. Les rôles ne sont **jamais** stockés hors de `user_roles`.
3. Les fonctions destinées aux policies doivent être `SECURITY DEFINER`
   + `SET search_path = public`.
4. Aucun DDL ne doit être exécuté depuis le client. Toujours passer
   par une migration.
