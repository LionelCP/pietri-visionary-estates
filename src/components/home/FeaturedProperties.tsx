import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
import propertyParis from "@/assets/property-paris.jpg";
import propertySantorini from "@/assets/property-santorini.jpg";
import propertyLondon from "@/assets/property-london.jpg";
import propertyProvence from "@/assets/property-provence.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FeaturedProperties = () => {
  const { t } = useLanguage();
  const f = translations.featured;
  const tags = translations.properties.tags;

  const properties = [
    { image: propertyParis, title: "Hôtel Particulier", location: "Paris VIIe — France", price: t(translations.properties.onRequest), tag: t(tags.exclusivite) },
    { image: propertySantorini, title: "Villa Aegean", location: "Santorin — Grèce", price: "€ 4 800 000", tag: t(tags.signature) },
    { image: propertyLondon, title: "The Penthouse", location: "Londres — Royaume-Uni", price: "£ 12 500 000" },
    { image: propertyProvence, title: "Château de Lumière", location: "Provence — France", price: "€ 8 200 000", tag: t(tags.nouveau) },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(f.overline)} title={t(f.title)} subtitle={t(f.subtitle)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, i) => (
            <motion.div key={property.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <PropertyCard {...property} />
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
    </section>
  );
};

export default FeaturedProperties;
