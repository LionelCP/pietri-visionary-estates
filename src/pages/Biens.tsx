import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import PropertyCardDb from "@/components/PropertyCardDb";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import heroCollection from "@/assets/hero-collection.jpg";
import { fetchPublicProperties, type Property, type PropertyRegion, type PropertyStatus, type PropertyType } from "@/lib/properties";
import { useLanguage } from "@/i18n/LanguageContext";

const REGION_OPTIONS: { value: PropertyRegion; fr: string; en: string }[] = [
  { value: "corse", fr: "Corse", en: "Corsica" },
  { value: "continent", fr: "Continent", en: "Mainland France" },
  { value: "monaco", fr: "Monaco", en: "Monaco" },
  { value: "bali", fr: "Bali", en: "Bali" },
  { value: "autre", fr: "Autre", en: "Other" },
];

const TYPE_OPTIONS: { value: PropertyType; fr: string; en: string }[] = [
  { value: "appartement", fr: "Appartement", en: "Apartment" },
  { value: "maison", fr: "Maison", en: "House" },
  { value: "villa", fr: "Villa", en: "Villa" },
  { value: "terrain", fr: "Terrain", en: "Land" },
  { value: "local_commercial", fr: "Local commercial", en: "Commercial" },
  { value: "programme", fr: "Programme immobilier", en: "New development" },
  { value: "autre", fr: "Autre", en: "Other" },
];

const STATUS_OPTIONS: { value: PropertyStatus; fr: string; en: string }[] = [
  { value: "disponible", fr: "Disponible", en: "Available" },
  { value: "sous_offre", fr: "Sous offre", en: "Under offer" },
  { value: "reserve", fr: "Réservé", en: "Reserved" },
  { value: "vendu", fr: "Vendu", en: "Sold" },
];

const Biens = () => {
  const { lang } = useLanguage();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<{ id: string; title: string } | null>(null);

  // filters
  const [region, setRegion] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [rooms, setRooms] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    fetchPublicProperties()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (availableOnly && p.status !== "disponible") return false;
      if (region && p.region !== region) return false;
      if (type && p.property_type !== type) return false;
      if (status && p.status !== status) return false;
      if (rooms && (p.rooms ?? 0) < Number(rooms)) return false;
      if (budget && (p.price_amount ?? 0) > Number(budget)) return false;
      return true;
    });
  }, [items, region, type, status, rooms, budget, availableOnly]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 font-body text-xs uppercase tracking-wider text-foreground focus:border-primary outline-none transition-colors";

  return (
    <main>
      <PageHero
        image={heroCollection}
        overline={t("Collection", "Collection")}
        title={t("Biens disponibles", "Available properties")}
        subtitle={t(
          "Corse, continent, Monaco, Bali — une sélection de biens choisis avec exigence.",
          "Corsica, mainland France, Monaco, Bali — a curated selection of properties.",
        )}
        breadcrumbs={[{ label: t("Biens", "Properties") }]}
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Filters */}
          <div className="border border-border p-6 lg:p-8 mb-12 lg:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">{t("Région", "Region")}</option>
                {REGION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{lang === "fr" ? o.fr : o.en}</option>)}
              </select>
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">{t("Type de bien", "Property type")}</option>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{lang === "fr" ? o.fr : o.en}</option>)}
              </select>
              <select className={inputCls} value={rooms} onChange={(e) => setRooms(e.target.value)}>
                <option value="">{t("Pièces (min)", "Rooms (min)")}</option>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
              <select className={inputCls} value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">{t("Budget max", "Max budget")}</option>
                {[300000, 500000, 800000, 1200000, 2000000, 5000000, 10000000].map((n) => (
                  <option key={n} value={n}>≤ {new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(n)} €</option>
                ))}
              </select>
              <select className={inputCls} value={status} onChange={(e) => { setStatus(e.target.value); if (e.target.value) setAvailableOnly(false); }}>
                <option value="">{t("Statut", "Status")}</option>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{lang === "fr" ? o.fr : o.en}</option>)}
              </select>
              <label className="flex items-center gap-2 font-body text-xs uppercase tracking-wider text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-primary" />
                {t("Disponibles uniquement", "Available only")}
              </label>
            </div>
          </div>

          {loading ? (
            <p className="text-center font-body text-sm text-muted-foreground py-20">{t("Chargement…", "Loading…")}</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-foreground mb-3">{t("Aucun bien à afficher pour le moment.", "No properties to display yet.")}</p>
              <p className="font-body text-sm text-muted-foreground">{t("Notre sélection est mise à jour régulièrement. Contactez-nous pour une recherche personnalisée.", "Our selection is updated regularly. Contact us for a tailored search.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <PropertyCardDb
                    property={p}
                    onTourClick={p.matterport_id ? () => setTour({ id: p.matterport_id!, title: p.title }) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {tour && <VirtualTourViewer matterportId={tour.id} title={tour.title} isOpen={!!tour} onClose={() => setTour(null)} />}
    </main>
  );
};

export default Biens;
