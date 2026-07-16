# .ai/roadmap.md

Roadmap versionnée du site Cabinet Pietri Immobilier.
Les jalons ne sont pas datés (product-led, pas time-boxed).

---

## V1 — Vitrine + admin (état actuel)

Livrée. Contenu :
- Site public bilingue FR/EN.
- Fiches biens riches (photos, vidéos, visites virtuelles).
- Back-office admin (CRUD, upload, statuts).
- Analytics anonymes.
- Serveur MCP pour agents IA.
- Documentation IA-ready.

## V2 — Qualité & croissance

Objectifs : polir, mesurer, référencer.
- [ ] Zéro `any` dans le code.
- [ ] Sitemap dynamique + JSON-LD `RealEstateListing`.
- [ ] Audit Lighthouse ≥ 95 sur les 4 axes (perf / a11y / SEO / best practices).
- [ ] Tests vitest sur les helpers, tests Playwright sur les
      parcours critiques (home → bien → contact ; admin login → édition).
- [ ] Monitoring d'erreurs (Sentry) + logs edge functions structurés.
- [ ] Analytics produit (PostHog ou équivalent) — opt-in RGPD.
- [ ] Historisation des changements de statut.
- [ ] Admin bilingue.

## V3 — Expérience acheteur

Objectifs : engager les visiteurs qualifiés.
- [ ] Espace acheteur (magic link) avec favoris.
- [ ] Alertes email par critères (bien matching).
- [ ] Mode « présentation client » plein écran pour rendez-vous.
- [ ] Prévisualisation Matterport dans l'admin.
- [ ] Nouveau format « vidéo verticale » + player social.
- [ ] Génération assistée FR/EN des descriptions via Lovable AI.

## V4 — Écosystème

Objectifs : intégrer l'agence dans son environnement outillé.
- [ ] Intégration CRM (HubSpot / Pipedrive) via connecteur Lovable.
- [ ] Feed RSS / Atom des nouveautés.
- [ ] Export XML portails immo (SeLoger, LeBonCoin API partenaire, etc.).
- [ ] Signature électronique de mandats (DocuSign / Yousign) — hors
      site, via lien magique.
- [ ] Multi-devise (EUR / USD / CHF) pour l'international.
- [ ] Version PWA installable pour l'équipe interne.

---

Toute évolution majeure de roadmap est reflétée aussi dans
`CHANGELOG.md` (section `[Unreleased]`) et arbitrée dans
`.ai/decision-log.md`.
