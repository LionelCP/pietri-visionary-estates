# DESIGN_SYSTEM

Design system du site Cabinet Pietri Immobilier. Ce document est
descriptif : il reflète l'état des tokens dans `src/index.css` et
`tailwind.config.ts`. Toute modification ici doit se faire en même
temps que le code.

---

## Principes

- **Éditorial haut de gamme** : storytelling, sobriété, émotion.
- **Anti-clichés** : ni dorures agressives, ni superlatifs.
- **Rythme visuel** : white space généreux, hiérarchie forte,
  contrastes maîtrisés.
- **Cinématique discrète** : `framer-motion` pour les entrées de
  section, jamais d'animation gratuite sur les éléments texte.

## Palette (Noir & Or)

Toutes les couleurs sont exposées comme tokens **HSL sémantiques**
dans `src/index.css` puis mappées dans `tailwind.config.ts`. Ne
jamais écrire une couleur en dur (`#RRGGBB`, `text-white`).

Tokens principaux (aliases Tailwind à utiliser) :

- `background`, `foreground` — surface / texte de base.
- `primary`, `primary-foreground` — accent Or.
- `secondary`, `secondary-foreground` — surface sombre alternative.
- `muted`, `muted-foreground` — textes secondaires.
- `accent`, `accent-foreground` — micro-mises en avant.
- `card`, `card-foreground`, `popover`, `popover-foreground`.
- `border`, `input`, `ring`.
- `destructive`, `destructive-foreground`.

Chaque token existe en variante `light` et `dark`. Le mode par
défaut est **dark**.

## Typographies

| Usage | Famille | Poids |
|---|---|---|
| Titres, hero, H1–H3 | Playfair Display (serif) | 400 / 500 |
| Corps, UI, labels | Outfit (sans) | 300 / 400 / 500 / 600 |

Interdit d'introduire une police tierce sans validation (pas
d'Inter, Poppins, Roboto). Voir mémoire projet `visual-direction`.

## Échelles

- **Radius** : `--radius` (défini dans `index.css`) — dérivé
  Tailwind : `rounded-md`, `rounded-lg`, `rounded-xl`.
- **Espacements** : échelle Tailwind par défaut (4 px base).
- **Container** : `container mx-auto px-4 md:px-6 lg:px-8` avec
  largeurs max éditoriales (voir `PageHero`).

## Composants patterns

- **Carte bien** : ratio image **3/4 vertical** (règle mémoire).
  Utiliser `AspectRatio` shadcn/ui avec `ratio={3/4}`.
- **Badge de statut** : `StatusBadge`, uniquement pour un
  `PropertyStatus`.
- **Section éditoriale** : `SectionHeading` (eyebrow + h2 + intro)
  puis contenu.
- **Hero interne** : `PageHero` (image + titre + sous-titre).
- **CTA** : `Button` shadcn/ui, variante `default` (Or) ou `outline`.

## Motion

- `framer-motion` seulement pour les entrées de section
  (`whileInView`, `viewport={{ once: true }}`).
- Durée par défaut : 600–800 ms, ease : `[0.22, 1, 0.36, 1]`.
- Pas d'animation sur les micro-interactions de texte.

## Iconographie

- `lucide-react` uniquement. Taille standard 16 / 20 / 24 px.
- Toujours accompagner d'un `aria-label` si l'icône est seule.

## Images

- Toujours passer par `next-gen` (Vite optimise via importation).
- `alt` obligatoire et descriptif (SEO + a11y).
- Galerie : `loading="lazy"` + `decoding="async"`.

## Dark / Light

- Dark par défaut ; light non exposée actuellement (préparée par
  les tokens).
- Ne jamais forcer une couleur qui contourne le thème (`text-white`
  → utiliser `text-foreground`).

## Erreurs anti-patterns fréquentes

- Utiliser une couleur Tailwind brute (`text-slate-100`) au lieu du
  token sémantique.
- Ajouter un `<img>` sans `alt`.
- Instancier un composant shadcn en le customisant en profondeur au
  lieu de créer une variante CVA.
- Utiliser plusieurs `<h1>` sur une page (SEO).
