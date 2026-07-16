# PROJECT_RULES — Règles de contribution

Règles à respecter par tout agent (humain ou IA) intervenant sur ce
dépôt. Non négociables.

## Portée
1. **Ne jamais modifier une fonctionnalité métier sans demande explicite.**
2. **Ne jamais modifier le design** (couleurs, typographies, layout,
   ratios de carte) sans validation utilisateur.
3. Toute modification doit être documentée dans `CHANGELOG.md` et,
   si structurelle, dans `.ai/decision-log.md`.

## Stack
4. Stack figée : React 18 + Vite + TS + Tailwind v3 + shadcn/ui +
   Lovable Cloud (Supabase). Aucune migration de framework.
5. Pas de serveur Node/Python dans le repo. Toute logique serveur
   passe par une Edge Function Supabase.

## Design system
6. Uniquement des tokens sémantiques HSL définis dans `src/index.css`.
   Interdits : `text-white`, `bg-black`, `bg-[#hex]`, styles inline
   colorés.
7. Typographies : Playfair Display (titres), Outfit (corps). Ne pas
   introduire de nouvelle police.
8. Cartes de biens : ratio 3/4 vertical obligatoire.
9. Dark theme par défaut, palette Noir & Or. Voir `DESIGN_SYSTEM.md`.

## Internationalisation
10. Tout texte visible passe par `t()` du `LanguageContext`.
11. FR est la source ; EN est ajouté dans `src/i18n/translations.ts`.

## Backend / DB
12. Toute modification de schéma = une migration SQL versionnée dans
    `supabase/migrations/`. Jamais de DDL depuis le client.
13. Toute nouvelle table `public` : `GRANT` explicite +
    `ENABLE ROW LEVEL SECURITY` + au moins une policy nommée.
14. Rôles utilisateurs uniquement dans `public.user_roles`. Jamais
    dans un profil, un JWT custom ou un `localStorage`.
15. Fonctions destinées aux policies : `SECURITY DEFINER` +
    `SET search_path = public`.

## TypeScript
16. Pas de `any` dans le nouveau code. Dériver les types depuis
    `src/integrations/supabase/types.ts`.
17. Props de composant toujours typées explicitement (interface ou
    `type`, jamais inférées depuis un objet).

## Composants
18. Un composant = une responsabilité. Si le fichier dépasse
    ~200 lignes, extraire.
19. Nommage : PascalCase pour les composants, camelCase pour les
    hooks (`useXxx`), kebab-case pour les fichiers non-composant.
20. Réutiliser shadcn/ui plutôt que réécrire (Button, Dialog, etc.).

## Data
21. Accès serveur via `@tanstack/react-query`. Pas de `fetch` brut
    dans les composants.
22. Les mutations invalident les caches concernés
    (`queryClient.invalidateQueries`).

## Sécurité
23. Pas de secret dans le bundle client. Seules variables `VITE_*`
    autorisées : URL Supabase, clé anon publishable, project id.
24. Toute nouvelle Edge Function doit valider ses inputs (zod) et
    répondre en JSON avec le bon status HTTP.
25. Ne jamais exposer d'URL de dashboard Supabase ou de clé
    service_role à l'utilisateur final.

## Fichiers protégés (ne pas éditer à la main)
26. `src/integrations/supabase/client.ts`
27. `src/integrations/supabase/types.ts`
28. `supabase/functions/mcp/index.ts` (auto-généré depuis `src/lib/mcp/`)
29. `src/components/ui/*` (shadcn/ui)
30. `.env`, `supabase/config.toml` (gérés par la plateforme)

## Commits
31. Messages en français, présent de l'indicatif, courts et concrets.
    Exemples : « ajoute champ vidéo drone », « corrige tri des biens ».
32. Un commit = un changement cohérent. Pas de commit « wip » ni
    de commit fusionnant plusieurs sujets.

## Documentation
33. Toute nouvelle route, table, edge function ou composant public
    doit être ajouté dans les fichiers correspondants (`ARCHITECTURE.md`,
    `API_REFERENCE.md`, `DATABASE.md`, `COMPONENTS.md`).
34. Les décisions structurelles vont dans `.ai/architecture-decisions.md`.
