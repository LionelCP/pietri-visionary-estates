# .ai/coding-style.md

Style de code du projet. Court, opérationnel. Complète
`PROJECT_RULES.md`.

## TypeScript
- `strict: false` actuellement (héritage Lovable). Objectif :
  passer `strict: true` progressivement (V2).
- Interdire `any` dans tout nouveau code. Utiliser `unknown` +
  narrowing si le type est vraiment inconnu.
- Types de props : `interface XxxProps {}` juste au-dessus du
  composant.
- Enums métier côté DB → types unions côté front (voir
  `src/lib/properties.ts`).

## React
- Composants **fonctionnels** uniquement.
- Un fichier = un composant exporté par défaut, plus des sous-composants
  privés si besoin.
- Ordre interne d'un composant :
  1. Types
  2. Const/utilitaires locaux
  3. Le composant lui-même : hooks → dérivations → handlers → JSX
- Pas de logique métier dans le JSX (extraire en variable/hook).

## Hooks
- Nommage `useXxx`.
- Un hook maison ne fait pas d'appel réseau sans passer par
  react-query (sauf usage très ponctuel documenté).

## Data
- `@tanstack/react-query` pour tout accès serveur.
- `queryKey` = tuple stable : `['properties', 'public']`,
  `['property', slug]`, `['properties', 'admin']`.
- Mutations : invalider les clefs concernées via
  `queryClient.invalidateQueries({ queryKey: [...] })`.

## Styling
- Tailwind avec **tokens sémantiques** uniquement (voir
  `DESIGN_SYSTEM.md`).
- Utiliser `cn()` de `@/lib/utils` pour combiner des classes
  conditionnelles.
- Ne pas overrider les composants shadcn avec du style inline —
  créer une variante CVA.

## Imports
- Alias `@/*` pour tout ce qui vit sous `src/`.
- Ordre : externes → aliasés → relatifs.
- Un import default et des named séparés :
  ```ts
  import React from "react";
  import { useEffect } from "react";
  ```
- Pas d'import `*` sauf `import * as z from "zod"` (interdit —
  utiliser `import { z } from "zod"`).

## Fichiers
- Composants : `PascalCase.tsx`.
- Hooks : `use-xxx.ts` (héritage shadcn) ou `useXxx.ts` pour les
  hooks maison.
- Utilitaires : `kebab-case.ts`.
- Un fichier > 200 lignes est un signal d'extraction.

## Formulaires
- `react-hook-form` + `zod` (via `@hookform/resolvers`).
- Toujours un schéma de validation, même minimal.
- Toujours des `<Label>` associés (`htmlFor`) pour l'a11y.

## Erreurs
- Front : `toast()` (shadcn) pour les erreurs utilisateur ;
  `console.error` pour le debug (jamais en prod bruyant).
- Edge Function : status HTTP explicite (`400/401/403/404/500`) +
  body JSON `{ error: string, details?: unknown }`.

## Accessibilité
- Un `<h1>` par page.
- `alt` non vide sur toute image porteuse d'info ;
  `alt=""` sur les images décoratives.
- Focus visible sur tous les éléments interactifs (déjà géré par
  les tokens `ring`).
- `aria-label` sur les boutons contenant uniquement une icône.

## Commits
- Français, présent, court : « ajoute champ vidéo drone ».
- Pas de commit « fix stuff » / « wip ».
- Un commit = un sujet.

## Interdits durables
- `any`, `as any`.
- `console.log` laissés en prod.
- Couleurs en dur (`#hex`, `text-white`, `bg-slate-*`).
- Requête réseau depuis un composant sans react-query.
- DDL depuis le front.
- Rôles stockés hors `user_roles`.
