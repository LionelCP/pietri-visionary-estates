import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
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

  const properties = [
    { image: propertyParis, title: "Hôtel Particulier", location: "Paris VIIe — France", price: t(translations.properties.onRequest), tag: t(tags.exclusivite) },
    { image: propertySantorini, title: "Villa Aegean", location: "Santorin — Grèce", price: "€ 4 800 000", tag: t(tags.signature) },
    { image: propertyLondon, title: "The Penthouse", location: "Londres — Royaume-Uni", price: "£ 12 500 000" },
    { image: propertyProvence, title: "Château de Lumière", location: "Provence — France", price: "€ 8 200 000", tag: t(tags.nouveau) },
  ];

  return (
    <main className="pt-20">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(c.overline)} title={t(c.title)} subtitle={t(c.subtitle)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property, i) => (
              <motion.div key={property.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collection;
