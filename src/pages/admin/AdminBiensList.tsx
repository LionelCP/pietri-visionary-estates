import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { fetchAllProperties, type Property } from "@/lib/properties";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import { PropertyEmptyState } from "@/components/admin/property-list/PropertyEmptyState";
import { PropertyListToolbar } from "@/components/admin/property-list/PropertyListToolbar";
import { PropertyListView } from "@/components/admin/property-list/PropertyListView";
import { updatePropertyDisplayOrder, updatePropertyFeatured } from "@/components/admin/property-list/propertyListMutations";
import {
  applyPropertyListState,
  getPropertyStatusCounts,
  type PropertyListState,
} from "@/components/admin/property-list/propertyListState";

const initialListState: PropertyListState = {
  query: "",
  status: "all",
  sort: "default",
};

const AdminBiensList = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Property[]>([]);
  const [listState, setListState] = useState<PropertyListState>(initialListState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchAllProperties()
      .then(setItems)
      .catch((loadError: { message?: string }) => {
        const message = loadError.message ?? "Impossible de charger les biens.";
        setError(message);
        toast({ title: "Erreur", description: message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredItems = useMemo(() => applyPropertyListState(items, listState), [items, listState]);
  const counts = useMemo(() => getPropertyStatusCounts(items), [items]);
  const hasFilters = Boolean(listState.query) || listState.status !== "all";

  const resetListState = () => setListState(initialListState);

  const handleFeaturedChange = async (id: string, value: boolean) => {
    setMutatingId(id);
    try {
      await updatePropertyFeatured(id, value);
      load();
    } catch (mutationError) {
      toast({ title: "Erreur", description: getErrorMessage(mutationError), variant: "destructive" });
    } finally {
      setMutatingId(null);
    }
  };

  const handleDisplayOrderChange = async (id: string, value: number, currentValue: number) => {
    if (value === currentValue) return;
    setMutatingId(id);
    try {
      await updatePropertyDisplayOrder(id, value);
      load();
    } catch (mutationError) {
      toast({ title: "Erreur", description: getErrorMessage(mutationError), variant: "destructive" });
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-2">Administration</span>
            <h1 className="font-display text-4xl text-foreground">Gestion des biens</h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/admin/analytics" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border border-border text-foreground hover:border-primary transition-colors">
              Audience
            </Link>
            <Link to="/admin/biens/nouveau" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-primary text-primary-foreground hover:bg-gold-light transition-colors">
              <Plus size={14} /> Ajouter un bien
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border border-border text-foreground hover:border-primary transition-colors">
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Chargement...</p>
        ) : error ? (
          <div className="border border-border p-10">
            <p className="font-display text-2xl text-foreground mb-3">Chargement impossible</p>
            <p className="font-body text-sm text-muted-foreground mb-6">{error}</p>
            <button type="button" onClick={load} className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border border-border text-foreground hover:border-primary">
              Réessayer
            </button>
          </div>
        ) : items.length === 0 ? (
          <PropertyEmptyState hasFilters={false} />
        ) : (
          <>
            <PropertyListToolbar
              query={listState.query}
              status={listState.status}
              sort={listState.sort}
              counts={counts}
              resultCount={filteredItems.length}
              totalCount={items.length}
              onQueryChange={(query) => setListState((state) => ({ ...state, query }))}
              onStatusChange={(status) => setListState((state) => ({ ...state, status }))}
              onSortChange={(sort) => setListState((state) => ({ ...state, sort }))}
              onReset={resetListState}
            />
            {filteredItems.length === 0 ? (
              <PropertyEmptyState hasFilters={hasFilters} onReset={resetListState} />
            ) : (
              <PropertyListView
                properties={filteredItems}
                mutatingId={mutatingId}
                onEdit={(id) => navigate(`/admin/biens/${id}/edit`)}
                onReload={load}
                onMutationStart={setMutatingId}
                onMutationEnd={() => setMutatingId(null)}
                onFeaturedChange={(id, value) => void handleFeaturedChange(id, value)}
                onDisplayOrderChange={(id, value, currentValue) => void handleDisplayOrderChange(id, value, currentValue)}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
};

function getErrorMessage(error: unknown) {
  return error && typeof error === "object" && "message" in error ? String(error.message) : "Une erreur est survenue.";
}

export default AdminBiensList;
