
## État actuel du site

- **Données des biens** : codées en dur dans `src/data/properties.ts` (tableau TypeScript). 4 biens (Paris, Santorin, Londres, Provence) avec champs limités : `id`, `image`, `title`, `location`, `price`, `tag`, `beds/baths/area`, `matterportId`, `category` (france/international/signature), `descriptionFr/En`, `featured`.
- **Aucune base de données** connectée. Aucune authentification. Pas d'admin.
- **Pages biens** : `/collection` liste tous les biens via `properties.map(...)`. Aucune page détail par bien (pas de route `/biens/:slug`).
- **Pas de statut** (Disponible / Sous offre / Vendu / Réservé / Masqué) — seulement un `tag` éditorial.
- **Photos** : une seule par bien (`image`). Champ `gallery` typé mais inutilisé.
- **Catégories** orientées « France / International / Signature » — pas alignées avec « Corse / Continent / International (Bali, Monaco) ».
- **Ajout d'un bien** : nécessite d'éditer le code (voir `docs/AJOUTER-UN-BIEN.md`).

## Recommandation

Migrer les biens vers **Lovable Cloud** (Supabase géré) avec une table `properties` + bucket storage pour les photos, et créer une **page d'administration `/admin/biens` protégée par authentification**. C'est la seule manière de répondre à votre besoin « ajouter / modifier / changer le statut sans toucher au code » de façon fiable et durable.

Alternatives écartées :
- *Airtable* : nécessite un compte externe, ralentit le site (appels API), moins fluide pour les photos.
- *Garder le code en dur* : ne résout pas la demande principale.

## Architecture proposée

### 1. Base de données (Lovable Cloud)

Table `properties` avec les champs demandés (tous optionnels sauf `id`, `title`, `status`) :

```text
id (uuid, pk)              slug (text, unique)
title                      status   (disponible|sous_offre|vendu|reserve|masque)
property_type              (appartement|maison|villa|terrain|local|programme|autre)
region                     (corse|continent|monaco|bali|autre)
city, sector
price_amount (numeric), price_display (text), price_on_request (bool)
area_m2, rooms, bedrooms, bathrooms, floor
has_terrace, has_garden, has_balcony, has_sea_view, has_mountain_view, has_open_view
short_description, long_description
highlights (text[])         energy_class
main_image_url              gallery (jsonb: [{url, alt}])
plan_pdf_url
internal_ref               featured (bool)   coup_de_coeur (bool)
display_order (int)        matterport_id
created_at, updated_at
```

Table `user_roles` + enum `app_role` (admin) + fonction `has_role()` (pattern sécurisé Lovable).

Bucket storage `property-images` (public) et `property-documents` (privé).

**RLS** :
- `select` public uniquement pour `status != 'masque'`.
- `insert/update/delete` réservés aux admins (`has_role(auth.uid(), 'admin')`).

### 2. Pages publiques (refonte)

- **`/biens`** (nouvelle, remplace progressivement `/collection`) : grille filtrable.
  - Filtres : région, ville, type, budget (slider), pièces, statut (« Disponibles uniquement » par défaut).
  - Tri par défaut : disponibles → sous offre → vendus (si admin coche « montrer »).
- **`/biens/:slug`** (nouvelle) : page détail — galerie, infos, points forts, CTA contextuel selon statut :
  - *Disponible* → « Demander plus d'informations » (pré-rempli avec titre du bien).
  - *Sous offre* → « Être alerté si le bien redevient disponible ».
  - *Vendu* → « Nous consulter pour un bien similaire ».
  - *Réservé* → « Nous contacter ».
- **`PropertyCard`** : ajout d'un badge statut discret (texte doré sur fond translucide, pas de couleur criarde) + adaptation du CTA.
- **`/collection`** : redirige vers `/biens` (page conservée, non supprimée).

### 3. Administration `/admin/biens` (protégée)

- **Auth** : email + mot de passe (Lovable Cloud). Première connexion → vous attribuer manuellement le rôle `admin` via SQL.
- **`/admin/login`** : formulaire de connexion.
- **`/admin/biens`** : tableau de tous les biens (y compris masqués), actions : ajouter, éditer, changer le statut en 1 clic (menu déroulant inline), masquer, dupliquer, supprimer (avec confirmation), réordonner (drag-and-drop ou champ `display_order`).
- **`/admin/biens/nouveau`** et **`/admin/biens/:id/edit`** : formulaire complet avec uploader d'images (multi-upload + sélection de la photo principale + textes alt), uploader de PDF.
- Lien discret « Admin » dans le footer (visible uniquement si connecté).

### 4. Élargissement Corse / Continent / International

- Mise à jour du hero, du manifesto et des CTA pour refléter : **Corse (cœur de métier) + Continent + International (Monaco, Bali)** au lieu de centrer uniquement la Balagne.
- Section « Nos territoires » conservée avec Corse / Monaco / Bali, ajout d'une mention « et sur le continent ».
- SEO : title + meta description ajustés pour ne pas se limiter à la Balagne.

### 5. SEO des biens

- URL : `/biens/{slug}` (ex. `/biens/villa-vue-mer-monticello`).
- Slug généré auto depuis titre + ville si laissé vide.
- `react-helmet-async` ajouté pour titres/descriptions par bien + JSON-LD `RealEstateListing`.
- Title auto-généré : `{title} — {city} | Cabinet Pietri Immobilier`.
- Alt photos = champ libre, fallback = `{title} — {city}`.

### 6. Migration des biens existants

Seed automatique : les 4 biens actuels (Paris, Santorin, Londres, Provence) seront insérés dans la nouvelle table avec `status = 'disponible'` et `featured = true`. Aucune donnée perdue. Le fichier `src/data/properties.ts` sera conservé en transition puis retiré une fois la migration validée.

## Découpage de livraison

Pour limiter le risque, je propose de livrer en **2 phases** :

**Phase 1 — Fondations (à valider avant phase 2)**
1. Activer Lovable Cloud.
2. Créer la table `properties`, le système de rôles, les buckets, les RLS.
3. Seed des 4 biens actuels.
4. Refonte de la liste publique `/biens` + page détail `/biens/:slug` avec badges statut et CTA contextuels.
5. Mise à jour du hero/SEO pour refléter Corse + Continent + International.

**Phase 2 — Admin**
6. Auth + rôle admin.
7. Pages `/admin/login`, `/admin/biens`, formulaire ajout/édition avec upload multi-photos et PDF.
8. Réordonnancement, duplication, suppression.

## Ce qui ne changera pas

- Identité visuelle (palette Noir & Or, Playfair / Outfit, ratio 3/4, animations).
- Pages existantes (Philosophie, Destinations, Services, Notre histoire, Contact) conservées.
- Bilingue FR/EN maintenu sur tout le nouveau contenu.

## Confirmation demandée

Pour démarrer la **Phase 1**, j'ai besoin de votre accord sur :

1. **Activer Lovable Cloud** (backend géré, sans compte externe à créer).
2. **Email admin** que vous utiliserez pour vous connecter à `/admin/biens` (vous pourrez le créer vous-même au moment voulu, je préparerai le bouton d'attribution du rôle).
3. **Les 4 biens actuels** doivent-ils être conservés tels quels comme exemples, ou remplacés par vos vrais biens dès la migration ?
