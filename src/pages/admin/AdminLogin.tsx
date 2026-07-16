import { useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const AdminLogin = () => {
  const { session, signIn, signUp, loading } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/admin/biens";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to={next} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password);
      setBusy(false);
      if (error) setErr(error);
      else setErr("Compte créé. Vérifiez votre email si la confirmation est activée, puis connectez-vous.");
      return;
    }
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setErr(error);
    else nav(next);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-foreground mb-2">Administration</h1>
        <p className="font-body text-sm text-muted-foreground mb-10">Espace réservé à l'équipe Cabinet Pietri.</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Mot de passe</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary outline-none" />
          </div>

          {err && <p className="font-body text-xs text-destructive">{err}</p>}

          <button disabled={busy} type="submit" className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50">
            {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </button>

          <button type="button" onClick={() => { setErr(null); setMode(mode === "signin" ? "signup" : "signin"); }} className="w-full font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors">
            {mode === "signin" ? "Première connexion ? Créer un compte" : "Déjà inscrit ? Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
