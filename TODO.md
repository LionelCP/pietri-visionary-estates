# TODO — Cabinet Pietri Immobilier

Roadmap technique et dette. Classée par priorité. Ne contient pas de
contenu métier (à gérer via l'admin).

## 🔴 Priorité haute — bugs / sécurité

- [ ] Auditer chaque policy RLS via `supabase--linter` après toute
      migration. Confirmer qu'aucune table publique n'est en accès
      total à `anon`.
- [ ] Vérifier le rate-limit du formulaire de contact et de la route
      `log-visit` (aucun limiteur natif côté Supabase Edge Functions).
- [ ] Ajouter une CSP stricte dans les headers de publication
      (framer-src limité à Matterport / YouTube / Vimeo pour la
      visite virtuelle et les vidéos embarquées).

## 🟠 Priorité moyenne — qualité

- [ ] Supprimer les `any` restants (principalement `mapRow` dans
      `src/lib/properties.ts` et handlers admin). Introduire un type
      `PropertyRow` dérivé de `Database['public']['Tables']['properties']['Row']`.
- [ ] Extraire un hook `useProperties()` / `useProperty(slug)` basé sur
      react-query pour remplacer les fetchs directs dans les pages.
- [ ] Ajouter des tests vitest pour `sortForPublic`, `formatPrice`,
      `formatLocation`.
- [ ] Ajouter un test e2e (Playwright) sur : navigation home → fiche
      bien → contact ; login admin → édition d'un bien.
- [ ] Audit accessibilité : contrastes en dark theme, focus rings sur
      tous les éléments interactifs, `aria-label` sur les icônes
      seules, `alt` non vide pour toutes les images de galerie.
- [ ] SEO : générer `sitemap.xml` dynamique (biens visibles) et un
      `robots.txt` ciblé.
- [ ] Perf : `loading="lazy"` + `decoding="async"` sur toutes les
      images de galerie ; précharger l'image hero de la home.
- [ ] Ajouter du JSON-LD `RealEstateListing` sur `/biens/:slug`.

## 🟡 Priorité basse — améliorations

- [ ] Internationaliser les libellés admin (actuellement FR only).
- [ ] Ajouter une prévisualisation Matterport dans l'admin quand un
      `matterport_id` est saisi.
- [ ] Ajouter un champ « vidéo verticale (portrait) » et un player
      dédié pour usage social.
- [ ] Historiser les changements de statut (`property_status_log`).
- [ ] Exposer un flux RSS des nouveautés.

## 🔵 Fonctionnalités futures

- [ ] Système de favoris client (auth acheteur légère, magic link).
- [ ] Alerte email quand un bien correspondant aux critères d'un
      acheteur est publié.
- [ ] Intégration CRM (HubSpot ou équivalent) via connecteur Lovable.
- [ ] Génération assistée de la description FR/EN via Lovable AI
      Gateway depuis l'admin.
- [ ] Mode « présentation client » plein écran pour rendez-vous.
