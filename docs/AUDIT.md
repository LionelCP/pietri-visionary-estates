# AUDIT — Checklist qualité

Audit des axes qualité du site. Chaque item est une case à cocher
actionnable. Cet audit est **statique** : il ne remplace pas un
Lighthouse ni un axe-core, il en résume les points à surveiller
manuellement pour ce projet.

---

## SEO

- [ ] Chaque page a un `<title>` unique (< 60 caractères).
- [ ] Chaque page a une `<meta name="description">` (< 160 car).
- [ ] Un seul `<h1>` par page, contenant le mot-clé principal.
- [ ] Hiérarchie H1 → H2 → H3 respectée (pas de saut).
- [ ] `canonical` défini sur les pages avec paramètres/variantes.
- [ ] Balises Open Graph + Twitter Card sur les pages partageables.
- [ ] JSON-LD `RealEstateListing` sur `/biens/:slug` (V2).
- [ ] `sitemap.xml` dynamique généré à partir des biens visibles (V2).
- [ ] `robots.txt` cohérent (public accessible, admin bloqué).
- [ ] `llms.txt` à jour (`public/llms.txt`).
- [ ] Toutes les images ont un `alt` descriptif.
- [ ] URLs lisibles, en kebab-case, sans paramètre superflu.

## Accessibilité (WCAG 2.1 AA)

- [ ] Contraste texte / fond ≥ 4.5:1 (3:1 pour texte large).
- [ ] Focus visible sur tous les éléments interactifs.
- [ ] Ordre de tabulation logique.
- [ ] `aria-label` sur boutons icônes seules.
- [ ] Formulaires : `<Label htmlFor>` associé à chaque champ.
- [ ] Erreurs de formulaire annoncées (`aria-invalid`, `aria-describedby`).
- [ ] Aucun contenu qui dépend uniquement de la couleur.
- [ ] Vidéo / audio : contrôles utilisateur, pas d'auto-play sonore.
- [ ] Iframe visite virtuelle : `title` explicite + `sandbox`.
- [ ] Site utilisable au clavier seul (menu, admin, formulaires).
- [ ] Attributs `lang` sur `<html>` (dynamique selon FR/EN).

## Performance

- [ ] LCP < 2 s en 4G sur home et fiche bien.
- [ ] CLS < 0.1 (réserver l'espace des images/vidéos).
- [ ] INP < 200 ms.
- [ ] Images en next-gen (importées par Vite / servies WebP-avif).
- [ ] `loading="lazy"` + `decoding="async"` sur galeries.
- [ ] Précharger l'image hero de la home (`<link rel="preload">`).
- [ ] Pas de JS bloquant en `<head>`.
- [ ] Bundle initial < 250 kB gzip (viser).
- [ ] Fonts : `font-display: swap`, sous-ensembles latin.
- [ ] Cache HTTP long sur les assets versionnés.

## Responsive

- [ ] Aucun scroll horizontal ≥ 320 px.
- [ ] Navbar utilisable sur mobile (menu burger).
- [ ] Galerie bien pilotable au doigt (swipe).
- [ ] Formulaires : champs pleine largeur mobile, `inputmode` adapté.
- [ ] `AspectRatio` respecté sur toutes les tailles.
- [ ] Test sur : 375×667, 390×844, 768×1024, 1280×800, 1920×1080.

## Sécurité

- [ ] RLS activée sur toutes les tables `public` (audit régulier).
- [ ] Aucun secret dans le bundle client (`VITE_*` uniquement les
      valeurs publiques).
- [ ] Edge Functions valident leur payload (zod).
- [ ] Rate-limit sur `log-visit` et formulaire contact (à ajouter).
- [ ] CSP stricte en production (framer-src limité à Matterport /
      YouTube / Vimeo).
- [ ] `X-Frame-Options: DENY` (sauf pages nécessitant l'iframe).
- [ ] Dépendances à jour (`npm audit` / `bun audit`).
- [ ] Journalisation admin des changements de statut (V2).
- [ ] Aucun `dangerouslySetInnerHTML` sans sanitize.

## UX

- [ ] Feedback immédiat sur toute action (toast, spinner).
- [ ] Loading states clairs (skeleton sur cartes, spinner sur détail).
- [ ] Erreurs utilisateur en langage naturel, pas de stack trace.
- [ ] Cohérence des CTA (label, emplacement, style).
- [ ] Retour visuel au survol des liens/cards.
- [ ] Formulaire contact : confirmation explicite après envoi.
- [ ] Admin : confirmations avant suppression / dépublication.
- [ ] i18n : chaque page est complète FR et EN.

---

Un axe = un ticket à créer si la case reste vide après audit.
Voir `TODO.md` pour la liste priorisée en cours.
