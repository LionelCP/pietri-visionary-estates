import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import PropertyCardDb from "@/components/PropertyCardDb";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import heroCollection from "@/assets/hero-collection.jpg";
import { fetchPublicProperties, getPropertyTitle, type Property, type PropertyRegion, type PropertyStatus, type PropertyType } from "@/lib/properties";
import { useLanguage } from "@/i18n/LanguageContext";

const REGION_OPTIONS: { value: PropertyRegion; fr: string; en: string }[] = [
  { value: "corse", fr: "Corse", en: "Corsica" },
  { value: "continent", fr: "Continent", en: "Mainland" },
  { value: "bali", fr: "Asie", en: "Asia" },
];

const TYPE_OPTIONS: { value: PropertyType; fr: string; en: string }[] = [
  { value: "appartement", fr: "Appartement", en: "Apartment" },
  { value: "maison", fr: "Maison", en: "House" },
  { value: "villa", fr: "Villa", en: "Villa" },
  { value: "terrain", fr: "Terrain", en: "Land" },
  { value: "programme", fr: "Projet", en: "Project" },
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
        title={t("Notre sélection immobilière", "Our property selection")}
        subtitle={t(
          "Corse, continent, Asie : une sélection de biens choisis pour leur emplacement, leur potentiel, leur atmosphère et la qualité de vie qu'ils permettent.",
          "Corsica, mainland France, Asia: a selection of properties chosen for their location, potential, atmosphere and the quality of life they offer.",
        )}
        breadcrumbs={[{ label: t("Biens", "Properties") }]}
      />

      <section className="py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {t(
              "Chaque bien présenté par Cabinet Pietri Immobilier fait l'objet d'une attention particulière : cohérence du projet, qualité du lieu, environnement, potentiel d'usage et adéquation avec les attentes de nos clients.",
              "Every property presented by Cabinet Pietri Immobilier receives particular attention: coherence of the project, quality of the place, surroundings, potential and alignment with our clients' expectations.",
            )}
          </motion.p>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">
              {t("Recherche", "Search")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              {t("Rechercher un bien", "Find a property")}
            </h2>
          </div>

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
            <div className="max-w-[680px] mx-auto text-center py-16 space-y-6">
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block">
                {t("Bientôt", "Coming soon")}
              </span>
              <h3 className="font-display text-3xl md:text-4xl text-foreground">
                {t("La collection arrive prochainement", "The collection is coming soon")}
              </h3>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {t(
                  "Notre sélection est en cours de mise à jour.",
                  "Our selection is currently being updated.",
                )}
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {t(
                  "Certains biens peuvent être proposés de manière confidentielle ou faire l'objet d'une présentation personnalisée avant leur mise en ligne.",
                  "Some properties may be offered confidentially or presented privately before being published.",
                )}
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {t(
                  "Vous pouvez nous transmettre votre recherche afin que nous vous orientions vers les biens correspondant à votre projet.",
                  "You can share your search with us so we can direct you to the properties that match your project.",
                )}
              </p>
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center font-body text-xs tracking-[0.3em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors"
                >
                  {t("Nous parler de votre recherche", "Tell us about your search")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <PropertyCardDb
                    property={p}
                    onTourClick={p.matterport_id ? () => setTour({ id: p.matterport_id!, title: getPropertyTitle(p, lang) }) : undefined}
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
