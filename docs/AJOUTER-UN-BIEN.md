# 🏡 Gérer les biens sur le site Cabinet Pietri

Tous les biens du site sont gérés depuis **l'espace administrateur en ligne**.
Aucune intervention dans le code n'est nécessaire.

---

## 🔐 Se connecter à l'admin

1. Aller sur **`/admin/login`**
2. Se connecter avec votre compte administrateur
3. Vous arrivez sur la liste des biens : **`/admin/biens`**

---

## ➕ Ajouter un bien

Depuis `/admin/biens`, cliquer sur **« Ajouter un bien »** puis remplir le formulaire.

### 1. Identité
- **Titre** *(obligatoire)* — ex : *Villa vue mer*
- **Slug URL** — généré automatiquement à partir du titre + ville (modifiable)
- **Statut** — voir tableau plus bas
- **Type** — Appartement / Maison / Villa / Terrain / Local commercial / Programme / Autre
- **Référence interne** — votre référence privée (optionnelle)

### 2. Localisation
- **Région** — Corse / Continent / Monaco / Bali / Autre
- **Ville** et **Secteur / quartier**

### 3. Prix
- Cocher **« Prix sur demande »** pour masquer le montant
- Sinon : saisir le **prix en €** (chiffre). Affichage personnalisé optionnel (ex : `€ 1 250 000`)

### 4. Caractéristiques
- Surface, pièces, chambres, salles de bain, étage
- Cases à cocher : terrasse, jardin, balcon, vue mer / montagne / dégagée
- Classe énergie

### 5. Descriptions
- Courte + longue, en **français ET anglais** (bilingue)
- **Points forts** : un par ligne, affichés en encadré

### 6. Photos
- **Photo principale** — upload direct ou URL externe
- **Galerie** — upload multiple. Cliquer sur l'étoile d'une photo pour la promouvoir en principale.

### 7. Vidéos *(nouveau)*
Trois supports complémentaires, tous optionnels :

| Champ | Usage | Format conseillé |
|---|---|---|
| **Lien YouTube / Vimeo** | Vignette « Vidéo » dans la galerie, lecteur intégré au clic | URL YouTube ou Vimeo standard |
| **Vidéo MP4 (upload)** | Lecteur HTML5 dans la galerie | MP4 H.264, **< 50 Mo**, compressé pour le web (HandBrake) |
| **Vidéo de fond (drone)** | Diffusée en boucle, muette, en haut de la fiche | MP4 16:9, **8–15 s**, < 15 Mo |

> 💡 **Astuce** : pour la vidéo drone, prévoir un export « web » court et léger. La photo principale sert de poster pendant le chargement.

### 8. Visite virtuelle Matterport
- Récupérer l'ID dans l'URL de votre tour : `my.matterport.com/show/?m=`**`SxQL3iGnMqk`**
- Coller cet ID dans le champ **« ID Matterport »**
- Le bouton **« Visite 3D »** apparaît automatiquement sur la fiche

### 9. Options & SEO
- **Afficher en page d'accueil** — sélection éditoriale
- **Coup de cœur** — badge spécial
- **Ordre d'affichage** — plus petit = en premier
- **SEO title / description** — optionnels (sinon générés automatiquement)

Cliquer enfin sur **« Créer le bien »**. La fiche est immédiatement publiée selon son statut.

---

## ✏️ Mettre à jour un bien

1. `/admin/biens` → cliquer sur le bien à modifier
2. Modifier les champs voulus
3. **« Enregistrer »** — mise à jour immédiate sur le site public

---

## 📊 Les statuts et leur effet

| Statut | Visible sur le site public ? | Badge affiché |
|---|---|---|
| **Disponible** | ✅ Oui, en premier | — |
| **Sous offre** | ✅ Oui | « Sous offre » |
| **Réservé** | ✅ Oui | « Réservé » |
| **Vendu** | ✅ Oui, en fin de liste | « Vendu » |
| **Masqué** | ❌ Non — visible uniquement dans l'admin | — |

> 💡 **Retirer temporairement un bien sans le supprimer** : passer son statut à **« Masqué »**.

---

## 🎥 Récapitulatif vidéos & visites virtuelles

✅ **Visites virtuelles Matterport** — supportées nativement (champ ID Matterport)
✅ **Vidéos YouTube / Vimeo** — lien à coller, lecteur intégré
✅ **Vidéos MP4 hébergées** — upload direct dans l'admin
✅ **Vidéos drone en fond de fiche** — autoplay muet, immersif

Tous ces médias sont **optionnels** et **cumulables** sur une même fiche.

---

## 💡 Astuces

- **Prix sur demande** : cocher la case → affiche « Prix sur demande » / « Price on request »
- **Retirer de l'accueil** : décocher « Afficher en page d'accueil »
- **Mettre en avant** : « Coup de cœur » + ordre d'affichage faible
- **Vidéo trop lourde** : utiliser [HandBrake](https://handbrake.fr) (preset *Web → Vimeo YouTube HQ 1080p60*)
- **Pas de Matterport ?** Laisser le champ vide, le bouton « Visite 3D » n'apparaîtra pas

---

## 🆘 Besoin d'aide ?

Vous pouvez aussi demander directement dans le chat Lovable :

> *« Ajoute un bien : Villa Azur à Saint-Tropez, 6 chambres, 520 m², 7 500 000 €, statut disponible, vidéo YouTube https://… »*

Lovable créera le bien pour vous.
