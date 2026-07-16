# Partager le projet avec ChatGPT — 3 volets

## Volet 1 — Guide écrit (PDF) : "Utiliser ChatGPT sur ce projet"

Génération d'un PDF simple (même style que le guide existant), qui explique :

1. Les 3 façons de donner du contexte à ChatGPT :
   - Coller une URL GitHub d'un fichier / dossier
   - Uploader un ZIP du code (bouton Download codebase de Lovable)
   - Brancher ChatGPT sur le serveur MCP du site (volet 3)
2. Les bons prompts à utiliser (ex : "Voici le repo GitHub X, aide-moi à ajouter Y en respectant les conventions").
3. Ce qu'il ne faut **jamais** coller dans ChatGPT (clés Supabase service_role, secrets, données clients).
4. Comment récupérer un extrait de code précis à partir de l'URL GitHub.

Livrable : `guide-chatgpt-cabinet-pietri.pdf` téléchargeable.

## Volet 2 — Connecter le projet à GitHub

Je ne peux pas cliquer à votre place. Le guide décrit précisément la procédure :

1. Menu Plus (+) en bas à gauche du chat Lovable → **GitHub → Connect project**
2. Autoriser l'app Lovable GitHub
3. Choisir le compte/organisation
4. Cliquer **Create Repository** → un repo est créé avec tout le code
5. La sync est **bidirectionnelle** (Lovable ↔ GitHub, temps réel)

Une fois fait, vous partagez à ChatGPT l'URL du repo (public ou privé + accès lecture).

## Volet 3 — Serveur MCP : ChatGPT parle directement au site

Installation d'un serveur MCP sur le backend du site pour que ChatGPT (via **Settings → Connectors → Add custom connector**) puisse lire/écrire les biens, sans copier-coller.

### Auth : OAuth obligatoire

Le site a un espace admin protégé (`/admin`) et les biens sont derrière RLS. Un serveur MCP public exposerait toutes les données à n'importe qui sur internet. On passe donc par **OAuth 2.1 Supabase** : ChatGPT se connecte comme un utilisateur admin authentifié.

### Outils exposés à ChatGPT

Version 1, minimale et safe :

| Outil | Type | Description |
|---|---|---|
| `list_properties` | lecture | Liste tous les biens (id, ref, titre, statut, prix) |
| `get_property` | lecture | Détails complets d'un bien par id ou référence |
| `search_properties` | lecture | Recherche par ville / type / prix mini-maxi / statut |
| `update_property_status` | écriture (admin) | Passe un bien en Disponible / Sous offre / Vendu / Masqué |
| `update_property_media` | écriture (admin) | Met à jour les nouveaux champs vidéo / visite virtuelle |

Toutes les écritures vérifient le rôle admin via la table `user_roles` déjà en place. Aucune écriture ne bypasse la RLS.

### Fichiers créés

```
src/lib/mcp/index.ts               ← defineMcp (nom, version, auth OAuth)
src/lib/mcp/tools/list-properties.ts
src/lib/mcp/tools/get-property.ts
src/lib/mcp/tools/search-properties.ts
src/lib/mcp/tools/update-property-status.ts
src/lib/mcp/tools/update-property-media.ts
src/pages/OAuthConsent.tsx         ← page /.lovable/oauth/consent
```

Modifs :
- `vite.config.ts` : ajout de `mcpPlugin()` (une ligne)
- `src/App.tsx` : route `/.lovable/oauth/consent`
- `src/pages/admin/AdminLogin.tsx` : préservation du `next` pour le retour de consent

Le plugin génère tout seul `supabase/functions/mcp/index.ts` (ne pas y toucher). Deploy de la fonction `mcp` en fin de setup.

### Étapes techniques (ordre exact)

1. `npm install @lovable.dev/mcp-js zod`
2. Ajouter `mcpPlugin()` dans `vite.config.ts`
3. Créer les 5 tools + `src/lib/mcp/index.ts` avec auth OAuth (issuer = `https://<ref>.supabase.co/auth/v1`)
4. Créer la page de consentement `/.lovable/oauth/consent` + route
5. Activer OAuth 2.1 côté Supabase (`configure_oauth_server`)
6. Générer le manifest MCP
7. Déployer la fonction edge `mcp`
8. Ajouter un favicon si absent (utilisé par le connecteur)
9. Dans le guide PDF : donner l'URL MCP (`https://<ref>.supabase.co/functions/v1/mcp`) et les étapes pour l'ajouter dans ChatGPT (Settings → Connectors → Add → coller l'URL → login OAuth avec votre compte admin du site).

### Points d'attention

- **Rien n'est cassé** : aucun changement sur les pages publiques ni les biens existants.
- **RLS respectée** : chaque appel MCP agit avec l'identité de l'utilisateur connecté via OAuth.
- **Aucun secret exposé** : pas de service_role dans les tools.
- **Réversible** : supprimer `defineMcp` désactive tout au prochain build.

## Ordre d'exécution

1. Serveur MCP (le plus long)
2. Génération du guide PDF (avec l'URL MCP dedans, une fois le déploiement fait)
3. Réponse finale avec : le PDF, l'URL MCP à coller dans ChatGPT, et le rappel de l'étape GitHub à faire manuellement

Prêt à lancer ?
