import { useState } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import heroCollection from "@/assets/hero-collection.jpg";
import propertyParis from "@/assets/property-paris.jpg";
import propertySantorini from "@/assets/property-santorini.jpg";
import propertyLondon from "@/assets/property-london.jpg";
import propertyProvence from "@/assets/property-provence.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Collection = () => {
  const { t } = useLanguage();
  const c = translations.pages.collection;
  const tags = translations.properties.tags;
  const [activeTour, setActiveTour] = useState<{ id: string; title: string } | null>(null);

  const properties = [
    { image: propertyParis, title: "Hôtel Particulier", location: "Paris VIIe — France", price: t(translations.properties.onRequest), tag: t(tags.exclusivite), beds: 6, baths: 4, area: "450 m²", matterportId: "SxQL3iGnMqk" },
    { image: propertySantorini, title: "Villa Aegean", location: "Santorin — Grèce", price: "€ 4 800 000", tag: t(tags.signature), beds: 5, baths: 5, area: "380 m²", matterportId: "Zh14WDtkjdC" },
    { image: propertyLondon, title: "The Penthouse", location: "Londres — Royaume-Uni", price: "£ 12 500 000", beds: 4, baths: 3, area: "320 m²" },
    { image: propertyProvence, title: "Château de Lumière", location: "Provence — France", price: "€ 8 200 000", tag: t(tags.nouveau), beds: 8, baths: 6, area: "650 m²", matterportId: "1maRkYB3yxs" },
  ];

  return (
    <main>
      <PageHero
        image={heroCollection}
        overline={t(c.overline)}
        title={t(c.title)}
        subtitle={t(c.subtitle)}
        breadcrumbs={[{ label: t(c.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property, i) => (
              <motion.div key={property.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <PropertyCard
                  {...property}
                  onTourClick={property.matterportId ? () => setActiveTour({ id: property.matterportId!, title: property.title }) : undefined}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {activeTour && (
        <VirtualTourViewer
          matterportId={activeTour.id}
          title={activeTour.title}
          isOpen={!!activeTour}
          onClose={() => setActiveTour(null)}
        />
      )}
    </main>
  );
};

export default Collection;
