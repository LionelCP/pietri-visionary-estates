import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import PropertyCardDb from "@/components/PropertyCardDb";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import { fetchFeaturedProperties, type Property } from "@/lib/properties";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FeaturedProperties = () => {
  const { t } = useLanguage();
  const f = translations.featured;
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchFeaturedProperties(4)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(f.overline)} title={t(f.title)} subtitle={t(f.subtitle)} />
        {loading ? (
          <p className="text-center font-body text-sm text-muted-foreground">…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.12 }}>
                <PropertyCardDb
                  property={p}
                  onTourClick={p.matterport_id ? () => setTour({ id: p.matterport_id!, title: p.title }) : undefined}
                />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-16">
          <Link to="/biens" className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3">
            {t(f.viewAll)}
            <span className="w-8 h-px bg-primary" />
          </Link>
        </div>
      </div>

      {tour && <VirtualTourViewer matterportId={tour.id} title={tour.title} isOpen={!!tour} onClose={() => setTour(null)} />}
    </section>
  );
};

export default FeaturedProperties;
