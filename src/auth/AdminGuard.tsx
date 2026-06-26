import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center"><p className="font-body text-sm text-muted-foreground">…</p></main>;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24">
        <h1 className="font-display text-3xl text-foreground mb-3">Accès restreint</h1>
        <p className="font-body text-sm text-muted-foreground max-w-md">
          Votre compte n'a pas encore les droits d'administration. Demandez à Lovable d'activer le rôle « admin » sur votre email pour accéder à cette page.
        </p>
      </main>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
