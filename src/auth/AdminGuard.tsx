import { ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [claiming, setClaiming] = useState(false);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center"><p className="font-body text-sm text-muted-foreground">…</p></main>;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    const claim = async () => {
      setClaiming(true);
      const { data, error } = await supabase.rpc("claim_first_admin");
      setClaiming(false);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      if (data === true) {
        toast({ title: "Rôle administrateur attribué" });
        window.location.reload();
      } else {
        toast({ title: "Action refusée", description: "Un administrateur existe déjà. Demandez-lui de vous ajouter.", variant: "destructive" });
      }
    };

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24">
        <h1 className="font-display text-3xl text-foreground mb-3">Accès restreint</h1>
        <p className="font-body text-sm text-muted-foreground max-w-md mb-8">
          Votre compte n'a pas encore les droits d'administration. Si vous êtes le premier utilisateur, vous pouvez vous attribuer le rôle ci-dessous.
        </p>
        <button disabled={claiming} onClick={claim} className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50">
          {claiming ? "…" : "Devenir administrateur"}
        </button>
      </main>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
