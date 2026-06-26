
# Mesure d'audience anonymisée — Cabinet Pietri

## Objectif

Mettre en place une mesure d'audience **conforme à la recommandation CNIL "mesure d'audience exemptée de consentement"**, qui collecte des informations utiles sans bandeau cookies et sans risque RGPD.

## Ce qui sera collecté

À chaque chargement de page, une edge function enregistre :

- **IP tronquée** (les derniers chiffres sont masqués, ex : `92.184.105.0` au lieu de `92.184.105.42`) — non-identifiante au sens CNIL
- **Pays + ville approximative** (déduits de l'IP via les headers Cloudflare/Lovable avant troncature)
- **Page visitée** (URL)
- **Site d'origine** (referrer)
- **Date/heure**
- **Type d'appareil** (mobile / desktop) et navigateur
- **Identifiant de session anonyme** (UUID gardé en mémoire pendant la visite, non persistant) — permet de calculer la durée et le nombre de pages par session

Aucun cookie n'est déposé, aucune IP complète n'est stockée, aucun croisement avec d'autres données. Pas de profilage publicitaire.

## Ce qui sera construit

### 1. Table `visit_logs` (Lovable Cloud)

Colonnes : id, session_id, ip_truncated, country, city, page, referrer, device, browser, duration_seconds, created_at.

RLS : lecture réservée aux admins (réutilisation du rôle existant). Insertion via la service_role depuis l'edge function uniquement.

Purge automatique : conservation **13 mois** (recommandation CNIL), via une tâche de nettoyage déclenchée à l'insertion.

### 2. Edge function `log-visit`

- Reçoit l'IP via `x-forwarded-for` / `cf-connecting-ip`
- Tronque immédiatement (IPv4 : dernier octet à 0 ; IPv6 : garde les 48 premiers bits)
- Récupère pays/ville via les headers Cloudflare (`cf-ipcountry`, `cf-ipcity`) si disponibles, sinon via une API gratuite
- Parse user-agent pour device + browser
- Insère dans `visit_logs`

### 3. Hook côté client `useVisitTracker`

Branché dans `App.tsx` :
- Génère un `session_id` (UUID) en mémoire au premier chargement
- À chaque changement de route, appelle `log-visit` avec page + referrer
- À la sortie de page, envoie la durée via `navigator.sendBeacon`

### 4. Page admin `/admin/analytics`

Protégée par `AdminGuard`. Affiche :

- **Compteurs en-tête** : visiteurs uniques (par session_id), pages vues, durée moyenne — sur 7 / 30 / 90 jours
- **Liste des dernières visites** : date, pays/ville, IP tronquée, page, referrer, device
- **Top pages** consultées
- **Top sources** (referrers)
- **Répartition pays**
- **Filtre par période**
- Bouton **export CSV**

Design dans la continuité de l'admin existante (Noir & Gold, Playfair / Outfit).

### 5. Mention dans la politique de confidentialité

Ajout d'un court paragraphe : *"Nous utilisons une mesure d'audience anonymisée, exemptée de consentement selon la recommandation de la CNIL. Les adresses IP sont tronquées immédiatement et ne permettent pas votre identification. Les statistiques sont conservées 13 mois."*

Si la page n'existe pas encore, je créerai `/confidentialite` avec un lien discret dans le footer.

## Détails techniques

```text
client (App.tsx)
   │  useVisitTracker — UUID session en mémoire
   │  → fetch POST /log-visit { page, referrer, session_id, device }
   ▼
edge function log-visit (verify_jwt=false)
   │  - tronque IP
   │  - lit cf-ipcountry / cf-ipcity
   │  - parse UA
   │  - insert via service_role
   ▼
table public.visit_logs (RLS: admin only)
   ▲
   │  read
page /admin/analytics (AdminGuard)
```

## Ce qui n'est PAS inclus

- Pas de bandeau cookies (inutile dans ce scénario)
- Pas d'IP complète stockée
- Pas de profilage individuel
- Pas d'intégration Google Analytics / Matomo / Plausible (vous gardez la donnée chez vous)

## Étapes d'implémentation

1. Migration : table `visit_logs`, GRANTs, RLS, policies admin
2. Edge function `log-visit`
3. Hook `useVisitTracker` + branchement dans `App.tsx`
4. Page `/admin/analytics` + lien dans la sidebar admin
5. Page `/confidentialite` (si absente) + paragraphe mesure d'audience
6. Vérification : ouvrir le site, naviguer, vérifier que les visites apparaissent dans l'admin

