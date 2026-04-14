import { useState } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import heroCollection from "@/assets/hero-collection.jpg";
import { properties } from "@/data/properties";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Collection = () => {
  const { t } = useLanguage();
  const c = translations.pages.collection;
  const tagLabels = translations.properties.tags;
  const [activeTour, setActiveTour] = useState<{ id: string; title: string } | null>(null);

  const resolvePrice = (price: string) =>
    price === "on-request" ? t(translations.properties.onRequest) : price;

  const resolveTag = (tag?: string) => {
    if (!tag) return undefined;
    const key = tag as keyof typeof tagLabels;
    return tagLabels[key] ? t(tagLabels[key]) : tag;
  };

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
              <motion.div key={property.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <PropertyCard
                  image={property.image}
                  title={property.title}
                  location={property.location}
                  price={resolvePrice(property.price)}
                  tag={resolveTag(property.tag)}
                  beds={property.beds}
                  baths={property.baths}
                  area={property.area}
                  matterportId={property.matterportId}
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
