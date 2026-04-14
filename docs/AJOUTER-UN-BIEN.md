# 🏡 Comment ajouter un bien sur le site Cabinet Pietri

## Processus en 3 étapes

---

### Étape 1 — Préparer les fichiers

1. **Photo principale** (obligatoire)
   - Format : `.jpg` (préféré) ou `.png`
   - Résolution recommandée : 1200×1600 px minimum (portrait 3:4)
   - Placez le fichier dans `src/assets/properties/`
   - Nommage : `nom-du-bien.jpg` (ex: `mas-oliviers.jpg`)

2. **Visite virtuelle Matterport** (optionnel)
   - Connectez-vous sur [my.matterport.com](https://my.matterport.com)
   - Récupérez l'ID du tour dans l'URL : `https://my.matterport.com/show/?m=VOTRE_ID`
   - Notez cet ID (ex: `SxQL3iGnMqk`)

---

### Étape 2 — Ajouter le bien dans le fichier de données

Ouvrez le fichier `src/data/properties.ts`

**A) Importez la photo** en haut du fichier, dans la section `IMPORTS PHOTOS` :

```typescript
import masOliviers from "@/assets/properties/mas-oliviers.jpg";
```

**B) Ajoutez le bien** dans le tableau `properties`, à l'endroit indiqué par le commentaire `AJOUTEZ VOS NOUVEAUX BIENS ICI` :

```typescript
{
  id: "mas-des-oliviers",              // Identifiant unique (URL-friendly)
  image: masOliviers,                  // Variable importée ci-dessus
  title: "Mas des Oliviers",           // Nom affiché
  location: "Luberon — France",        // Format : "Ville — Pays"
  price: "€ 3 200 000",               // Prix ou "on-request"
  tag: "nouveau",                      // "exclusivite", "signature", "nouveau" ou rien
  beds: 5,                             // Nombre de chambres
  baths: 3,                            // Nombre de salles de bain
  area: "280 m²",                      // Surface
  matterportId: "votre-id-ici",        // ID Matterport (supprimer si pas de visite)
  category: "france",                  // "france", "international" ou "signature"
  featured: true,                      // true = affiché sur la page d'accueil
  descriptionFr: "Description en français...",
  descriptionEn: "English description...",
},
```

---

### Étape 3 — Vérifier

Le bien apparaît automatiquement :
- ✅ Sur la **page Collection** (`/collection`)
- ✅ Sur la **page d'accueil** (si `featured: true`)
- ✅ Avec le **bouton "Visite 3D"** (si `matterportId` est renseigné)

---

## 📋 Référence rapide des champs

| Champ | Obligatoire | Exemple | Description |
|-------|-------------|---------|-------------|
| `id` | ✅ | `"villa-mer"` | Identifiant unique, sans espaces |
| `image` | ✅ | `villaMer` | Variable de l'import photo |
| `title` | ✅ | `"Villa Mer"` | Nom affiché |
| `location` | ✅ | `"Nice — France"` | Ville — Pays |
| `price` | ✅ | `"€ 2 500 000"` | Prix ou `"on-request"` |
| `category` | ✅ | `"france"` | `france` / `international` / `signature` |
| `tag` | ❌ | `"nouveau"` | Badge sur la photo |
| `beds` | ❌ | `4` | Chambres |
| `baths` | ❌ | `3` | Salles de bain |
| `area` | ❌ | `"250 m²"` | Surface |
| `matterportId` | ❌ | `"SxQL3iGnMqk"` | Active la visite 3D |
| `featured` | ❌ | `true` | Affiche en page d'accueil |
| `descriptionFr` | ❌ | `"..."` | Description FR |
| `descriptionEn` | ❌ | `"..."` | Description EN |

---

## 💡 Astuces

- **Prix "Sur demande"** : Mettez `price: "on-request"` — le site affichera automatiquement "Sur demande" en FR et "On request" en EN
- **Tags bilingues** : Les tags `exclusivite`, `signature` et `nouveau` sont automatiquement traduits
- **Pas de visite virtuelle ?** Supprimez simplement la ligne `matterportId` — le bouton "Visite 3D" n'apparaîtra pas
- **Retirer de l'accueil** : Mettez `featured: false` — le bien reste visible dans la Collection

---

## 🔧 Pour aller plus loin

### Demander à Lovable d'ajouter un bien

Vous pouvez simplement dire dans le chat :

> "Ajoute un nouveau bien : Villa Azur à Saint-Tropez, 6 chambres, 4 SDB, 520 m², prix 7 500 000€, catégorie france, tag signature, ID Matterport : ABC123"

Lovable ajoutera le bien automatiquement pour vous.
