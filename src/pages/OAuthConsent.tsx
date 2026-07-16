import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthDetails = {
  client?: { name?: string; client_uri?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult = { redirect_url?: string; redirect_to?: string };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const oauth = (supabase.auth as any).oauth as OAuthApi;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("authorization_id manquant.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user.email ?? null);
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Le serveur d'autorisation n'a pas renvoyé d'URL de redirection.");
      return;
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Autorisation impossible</h1>
          <p className="font-body text-sm text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <p className="font-body text-sm text-muted-foreground">Chargement…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "une application externe";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl text-foreground mb-2">
          Connecter {clientName} à Cabinet Pietri
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-6">
          Ceci autorise <strong>{clientName}</strong> à utiliser les outils du site en votre nom.
        </p>
        {userEmail && (
          <p className="font-body text-xs text-muted-foreground mb-6">
            Connecté en tant que <strong>{userEmail}</strong>
          </p>
        )}
        <div className="border border-border p-4 mb-6 space-y-2">
          <p className="font-body text-xs text-muted-foreground">Ce que l'application pourra faire :</p>
          <ul className="font-body text-sm text-foreground list-disc pl-5 space-y-1">
            <li>Lister et consulter vos biens</li>
            <li>Modifier le statut d'un bien (si vous êtes admin)</li>
            <li>Mettre à jour les vidéos et visites virtuelles (si vous êtes admin)</li>
          </ul>
          <p className="font-body text-[11px] text-muted-foreground pt-2">
            Les règles d'accès du site (RLS) continuent de s'appliquer.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 font-body text-xs tracking-[0.2em] uppercase px-6 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {busy ? "…" : "Autoriser"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 font-body text-xs tracking-[0.2em] uppercase px-6 py-4 border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Refuser
          </button>
        </div>
      </div>
    </main>
  );
};

export default OAuthConsent;
