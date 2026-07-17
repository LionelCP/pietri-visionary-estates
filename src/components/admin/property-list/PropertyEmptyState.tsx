import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

type PropertyEmptyStateProps = {
  hasFilters: boolean;
  onReset?: () => void;
};

export function PropertyEmptyState({ hasFilters, onReset }: PropertyEmptyStateProps) {
  return (
    <div className="border border-border p-12 text-center">
      <p className="font-display text-2xl text-foreground mb-3">{hasFilters ? "Aucun bien ne correspond" : "Aucun bien pour le moment"}</p>
      <p className="font-body text-sm text-muted-foreground mb-6">
        {hasFilters ? "Modifiez la recherche ou les filtres pour retrouver vos biens." : "Ajoutez votre premier bien pour commencer."}
      </p>
      {hasFilters ? (
        <button type="button" onClick={onReset} className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border border-border text-foreground hover:border-primary">
          Réinitialiser
        </button>
      ) : (
        <Link to="/admin/biens/nouveau" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-primary text-primary-foreground">
          <Plus size={14} /> Ajouter un bien
        </Link>
      )}
    </div>
  );
}
