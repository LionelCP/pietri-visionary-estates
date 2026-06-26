import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllProperties, type Property, type PropertyStatus } from "@/lib/properties";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<PropertyStatus, string> = {
  disponible: "Disponible",
  sous_offre: "Sous offre",
  reserve: "Réservé",
  vendu: "Vendu",
  masque: "Masqué",
};

const AdminBiensList = () => {
  const { signOut } = useAuth();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllProperties().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: PropertyStatus) => {
    const { error } = await supabase.from("properties").update({ status }).eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { toast({ title: "Statut mis à jour" }); load(); }
  };

  const toggleFeatured = async (id: string, value: boolean) => {
    const { error } = await supabase.from("properties").update({ featured: value }).eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else load();
  };

  const updateOrder = async (id: string, value: number) => {
    const { error } = await supabase.from("properties").update({ display_order: value }).eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Supprimer définitivement « ${title} » ? Cette action est irréversible.`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { toast({ title: "Bien supprimé" }); load(); }
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
          <p className="font-body text-sm text-muted-foreground">Chargement…</p>
        ) : items.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <p className="font-display text-2xl text-foreground mb-3">Aucun bien pour le moment</p>
            <p className="font-body text-sm text-muted-foreground mb-6">Ajoutez votre premier bien pour commencer.</p>
            <Link to="/admin/biens/nouveau" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-primary text-primary-foreground">
              <Plus size={14} /> Ajouter un bien
            </Link>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead className="bg-secondary">
                <tr className="text-left">
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ordre</th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Titre</th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Localisation</th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Accueil</th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <input type="number" defaultValue={p.display_order} onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== p.display_order) updateOrder(p.id, v);
                      }} className="w-16 bg-background border border-border px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-display text-base text-foreground">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{[p.city, p.region].filter(Boolean).join(" — ")}</td>
                    <td className="px-4 py-3">
                      <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value as PropertyStatus)} className="bg-background border border-border px-2 py-1 text-sm">
                        {(Object.keys(STATUS_LABELS) as PropertyStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={p.featured} onChange={(e) => toggleFeatured(p.id, e.target.checked)} className="accent-primary" />
                    </td>
                    <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                      <Link to={`/admin/biens/${p.id}/edit`} className="font-body text-[11px] tracking-[0.15em] uppercase text-primary hover:underline">Éditer</Link>
                      <Link to={`/biens/${p.slug}`} target="_blank" className="font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground">Voir</Link>
                      <button onClick={() => remove(p.id, p.title)} className="font-body text-[11px] tracking-[0.15em] uppercase text-destructive hover:underline">Suppr.</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminBiensList;
