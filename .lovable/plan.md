
# Plan — Vidéos sur les fiches de biens + guide admin à jour

## 1. Réécrire `docs/AJOUTER-UN-BIEN.md`

Remplacer entièrement l'ancien guide (basé sur le fichier `properties.ts`, **plus utilisé**) par un guide qui reflète le vrai process via l'admin Lovable Cloud.

Le nouveau guide couvrira :
- Connexion à l'admin (`/admin/login`)
- Ajouter un bien depuis `/admin/biens` → « Ajouter un bien »
- Détail de chaque section du formulaire (identité, localisation, prix, caractéristiques, descriptions FR/EN, photos, visite Matterport, **vidéos**, options)
- Mettre à jour un bien
- Statuts (Disponible / Sous offre / Réservé / Vendu / Masqué) et leur effet sur le site public
- Visites virtuelles Matterport (récupération de l'ID)
- Vidéos (les 3 nouveaux champs)
- Astuces (prix sur demande, retirer sans supprimer, ordre d'affichage, coup de cœur, mise en avant)

## 2. Ajouter le support vidéo en base

Migration Supabase sur la table `properties` — 3 nouveaux champs :

| Champ | Type | Usage |
|---|---|---|
| `video_url` | text | URL YouTube ou Vimeo (lecteur intégré dans la galerie) |
| `video_file_url` | text | URL d'un MP4 uploadé dans Lovable Cloud |
| `hero_video_url` | text | Vidéo aérienne/drone diffusée en haut de la fiche, autoplay muet en boucle |

Tous optionnels (`null` par défaut). Pas de breaking change.

## 3. Étendre l'admin (`AdminBienEdit.tsx`)

Nouvelle section **« Vidéos »** dans le formulaire, après la section Photos :

- **Lien YouTube / Vimeo** : champ texte (URL). Détection auto du provider et de l'ID pour le lecteur embed.
- **Vidéo MP4 (upload)** : bouton upload vers le bucket `property-images` (sous-dossier `videos/`). Limite indicative 50 Mo affichée. Aperçu + bouton « Retirer ».
- **Vidéo hero (drone)** : champ URL (recommandation : lien direct MP4 hébergé, ou Vimeo). Note explicative sur format conseillé (16:9, < 15 s, muet).

Mise à jour du payload de sauvegarde pour inclure les 3 champs.

## 4. Étendre l'affichage public (`BienDetail.tsx`)

- **Hero vidéo** : si `hero_video_url` est renseigné, remplacer la première image de couverture par une `<video autoplay muted loop playsinline>` (avec fallback image principale si erreur de chargement).
- **Galerie** : si `video_url` (YouTube/Vimeo) → insérer une vignette « ▶ Vidéo » qui ouvre un lecteur embed dans la lightbox existante.
- **Vidéo MP4** : si `video_file_url` → afficher un player HTML5 natif dans la galerie.
- Conserver le bouton Matterport existant inchangé.

Ajouter un petit helper `getEmbedUrl()` pour transformer une URL YouTube/Vimeo en URL d'iframe embed.

## 5. Mettre à jour les types

- `src/lib/properties.ts` : ajouter les 3 champs à l'interface `Property`.
- Les types Supabase générés se mettent à jour automatiquement après la migration.

## Détails techniques

- **Stockage MP4** : bucket `property-images` existant (déjà privé avec policy publique en lecture via getPublicUrl). Sous-dossier `videos/` pour organisation.
- **Détection provider vidéo** : regex simple sur l'URL (`youtube.com/watch?v=`, `youtu.be/`, `vimeo.com/`).
- **Hero vidéo** : `preload="metadata"`, `poster={main_image_url}` pour éviter un flash blanc avant le chargement. Sur mobile (< 768px) on garde l'image fixe pour économiser la data.
- **Pas de transcodage** : on assume que l'utilisateur uploade un MP4 H.264 prêt pour le web. Une note dans le guide recommande HandBrake ou un export « web » depuis l'éditeur vidéo.

## Hors scope (à confirmer si besoin)

- Pas de génération automatique de poster depuis la vidéo (resterait à l'utilisateur de bien renseigner la photo principale).
- Pas de gestion multi-vidéos (1 lien + 1 fichier + 1 hero par bien — suffisant pour l'usage actuel).
