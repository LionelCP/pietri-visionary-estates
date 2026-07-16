# DEPLOYMENT

## Environnements

| Environnement | URL | Déclenchement |
|---|---|---|
| Local | http://localhost:8080 | `bun run dev` |
| Preview Lovable | https://id-preview--<uuid>.lovable.app | auto à chaque édition |
| Production | https://www.cabinet-pietri-immobilier.com<br>https://pietri-visionary-estates.lovable.app | bouton **Publish** dans Lovable |

Domaines personnalisés actuels :
- `https://www.cabinet-pietri-immobilier.com`
- `https://cabinet-pietri-immobilier.com`

## Prérequis

- Node 20+ (recommandé 20 LTS).
- Bun (recommandé) ou npm.
- Compte Lovable + backend Lovable Cloud activé.

## Installation locale

```bash
cp .env.example .env       # puis renseigner si hors Lovable
bun install                # ou : npm install
bun run dev                # http://localhost:8080
```

Dans Lovable, `.env` est renseigné automatiquement.

## Commandes

```bash
bun run dev        # dev server (Vite, port 8080)
bun run build      # build production (dist/)
bun run build:dev  # build en mode development (debug)
bun run preview    # sert le build dist/
bun run lint       # eslint
bun run test       # vitest run
bun run test:watch # vitest watch
```

## Publication

1. Ouvrir le projet dans l'éditeur Lovable.
2. Cliquer sur **Publish** (haut à droite).
3. La plateforme :
   - build le front (`vite build`),
   - déploie `dist/` sur les URLs Lovable et les domaines custom,
   - applique les migrations SQL en attente,
   - déploie les Edge Functions (`log-visit`, `mcp`).

## Migrations DB

- Créées via l'outil de migration Lovable → approbation utilisateur
  → application.
- Fichiers stockés dans `supabase/migrations/`.
- Après application, les types (`src/integrations/supabase/types.ts`)
  sont regénérés automatiquement.

## Edge Functions

- Le code source vit dans `supabase/functions/<name>/index.ts`.
- `mcp/index.ts` est **auto-généré** depuis `src/lib/mcp/`, ne pas
  éditer à la main.
- Déploiement automatique via Lovable. En dehors de Lovable, utiliser
  `supabase functions deploy <name>` (nécessite l'accès au projet
  Supabase).

## Rollback

- **Front** : Lovable garde un historique de versions. Ouvrir
  l'historique de projet → « Restaurer » sur la version cible.
- **DB** : chaque migration est un fichier SQL. En cas de régression,
  écrire une migration corrective (jamais rollback destructif en
  prod). Les données sont exportables via Cloud → Advanced settings
  → Export data.

## Secrets

- Runtime (Edge Functions) : gérés via l'outil `add_secret` / vue
  Secrets de Lovable Cloud.
- Build (npm privé) : Workspace Settings → Build Secrets.
- Aucun secret ne doit apparaître dans un `VITE_*` (bundle client).

## Self-hosting (optionnel)

Le repo est un projet Vite standard :
1. Connecter GitHub (menu **+** → **GitHub** → *Connect project*).
2. Cloner le repo GitHub.
3. Déployer `dist/` sur Vercel, Netlify, Cloudflare Pages, etc.
4. Renseigner les variables `VITE_*` dans les settings de l'hébergeur.
5. Les Edge Functions restent hébergées sur Supabase.

## Post-déploiement — checklist

- [ ] Home charge en < 2 s (LCP), pas d'erreur console.
- [ ] `/biens` affiche la liste.
- [ ] `/biens/<slug>` s'ouvre sur un bien connu.
- [ ] `/admin/login` → session admin → `/admin/biens` OK.
- [ ] `POST /functions/v1/log-visit` retourne `204`.
- [ ] Sitemap / robots.txt / llms.txt accessibles.
- [ ] Analytics de visite reçues (table `visit_logs`).
