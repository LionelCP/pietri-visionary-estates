import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import { getFeaturedProperties } from "@/data/properties";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FeaturedProperties = () => {
  const { t, lang } = useLanguage();
  const f = translations.featured;
  const tagLabels = translations.properties.tags;
  const [activeTour, setActiveTour] = useState<{ id: string; title: string } | null>(null);

  const properties = getFeaturedProperties();

  const resolvePrice = (price: string) =>
    price === "on-request" ? t(translations.properties.onRequest) : price;

  const resolveTag = (tag?: string) => {
    if (!tag) return undefined;
    const key = tag as keyof typeof tagLabels;
    return tagLabels[key] ? t(tagLabels[key]) : tag;
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(f.overline)} title={t(f.title)} subtitle={t(f.subtitle)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, i) => (
            <motion.div key={property.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.15 }}>
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
        <div className="text-center mt-16">
          <a href="/collection" className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3">
            {t(f.viewAll)}
            <span className="w-8 h-px bg-primary" />
          </a>
        </div>
      </div>

      {activeTour && (
        <VirtualTourViewer
          matterportId={activeTour.id}
          title={activeTour.title}
          isOpen={!!activeTour}
          onClose={() => setActiveTour(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProperties;
