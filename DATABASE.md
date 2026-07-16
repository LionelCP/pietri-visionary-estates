# DATABASE

Documentation du schéma Postgres. Reflète l'état géré via
`supabase/migrations/`. Le contrat TypeScript vit dans
`src/integrations/supabase/types.ts` (auto-généré).

Version détaillée : `docs/DATABASE.md`.

---

## Schéma `public`

### Tables

| Table | Rôle | RLS |
|---|---|---|
| `properties` | Fiches biens (49 colonnes). | oui |
| `user_roles` | Rôles utilisateurs. | oui |
| `visit_logs` | Journal anonyme des visites. | oui |

### Relations

- `user_roles.user_id → auth.users.id` (FK, `ON DELETE CASCADE`).
- Aucune autre FK inter-tables `public` à ce jour.

### Enums

| Enum | Valeurs |
|---|---|
| `app_role` | `admin`, `moderator`, `user` |
| `property_status` | `disponible`, `sous_offre`, `reserve`, `vendu`, `masque` |
| `property_type` | `appartement`, `maison`, `villa`, `terrain`, `local_commercial`, `programme`, `autre` |
| `property_region` | `corse`, `continent`, `monaco`, `bali`, `autre` |

---

## `public.properties` — colonnes

Regroupement fonctionnel :

| Groupe | Colonnes |
|---|---|
| Identité | `id (uuid, pk)`, `slug (text, unique)`, `internal_ref (text)`, `title (text)` |
| Statut/tri | `status (property_status)`, `display_order (int)`, `featured (bool)`, `coup_de_coeur (bool)` |
| Localisation | `region (property_region)`, `city (text)`, `sector (text)` |
| Prix | `price_amount (int)`, `price_display (text)`, `price_on_request (bool)` |
| Caractéristiques | `area_m2 (int)`, `rooms (int)`, `bedrooms (int)`, `bathrooms (int)`, `floor (text)` |
| Vues/extérieurs | `has_terrace`, `has_garden`, `has_balcony`, `has_sea_view`, `has_mountain_view`, `has_open_view` (bool) |
| Descriptions | `short_description`, `long_description`, `short_description_en`, `long_description_en`, `highlights (text[])` |
| Énergie | `energy_class (text)` |
| Médias | `main_image_url (text)`, `gallery (jsonb)`, `plan_pdf_url (text)` |
| Immersif | `video_url`, `video_url_2`, `video_file_url`, `hero_video_url`, `drone_video_url`, `virtual_tour_url`, `virtual_tour_iframe`, `matterport_id`, `show_video (bool)`, `show_virtual_tour (bool)` |
| SEO | `seo_title (text)`, `seo_description (text)` |
| Meta | `created_at (timestamptz)`, `updated_at (timestamptz)` |

### Policies
- `properties_public_read` — `SELECT` pour `anon` et `authenticated`
  où `status <> 'masque'`.
- `properties_admin_read` — `SELECT` pour admins (voit tout).
- `properties_admin_write` — `INSERT/UPDATE/DELETE` pour admins via
  `public.has_role(auth.uid(), 'admin')`.

### Triggers
- `set_updated_at` : `tg_set_updated_at()` avant chaque `UPDATE`.

---

## `public.user_roles`

Colonnes : `id (uuid, pk)`, `user_id (uuid, fk auth.users)`,
`role (app_role)`, `created_at`. Unique `(user_id, role)`.

### Policies
- `SELECT` : l'utilisateur voit ses propres rôles ; service_role
  voit tout.
- Écriture réservée à service_role (edge functions / migrations).

---

## `public.visit_logs`

Colonnes : `id`, `path`, `referrer`, `lang`, `viewport`, `country`,
`ip_hash`, `session_id`, `user_agent`, `created_at`.

### Policies
- `INSERT` : service_role uniquement (via edge function `log-visit`).
- `SELECT` : admin uniquement.

### Purge
Fonction `public.purge_old_visit_logs()` supprime les entrées
> 13 mois. Peut être planifiée via un cron Supabase.

---

## Fonctions

| Fonction | Signature | Description |
|---|---|---|
| `has_role` | `(_user_id uuid, _role app_role) → boolean` | `SECURITY DEFINER`, utilisée dans les policies. |
| `claim_first_admin` | `() → boolean` | Auto-promotion admin si aucun admin n'existe. |
| `tg_set_updated_at` | `() → trigger` | Met à jour `updated_at`. |
| `purge_old_visit_logs` | `() → void` | Purge des visites > 13 mois. |

Toutes en `SET search_path = public`.

---

## Storage

| Bucket | Public | Contenu | Politique |
|---|---|---|---|
| `property-images` | Non | Photos des biens (galerie, hero). | Lecture via URL signée ; upload admin. |
| `property-documents` | Non | Plans, DPE, brochures. | Idem. |

---

## Migrations

Répertoire : `supabase/migrations/`. Nommage horodaté par Lovable.
Ne jamais éditer une migration déjà appliquée en production — créer
une nouvelle migration.

Règles (rappel `PROJECT_RULES.md`) :
1. `CREATE TABLE` → `GRANT` → `ENABLE ROW LEVEL SECURITY` → `CREATE POLICY`.
2. `id uuid default gen_random_uuid()` + `created_at`/`updated_at`
   + trigger `tg_set_updated_at`.
3. Pas d'`ALTER DATABASE`.
