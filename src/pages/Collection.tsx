import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
import propertyParis from "@/assets/property-paris.jpg";
import propertySantorini from "@/assets/property-santorini.jpg";
import propertyLondon from "@/assets/property-london.jpg";
import propertyProvence from "@/assets/property-provence.jpg";

const properties = [
  { image: propertyParis, title: "Hôtel Particulier", location: "Paris VIIe — France", price: "Sur demande", tag: "Exclusivité" },
  { image: propertySantorini, title: "Villa Aegean", location: "Santorin — Grèce", price: "€ 4 800 000", tag: "Signature" },
  { image: propertyLondon, title: "The Penthouse", location: "Londres — Royaume-Uni", price: "£ 12 500 000" },
  { image: propertyProvence, title: "Château de Lumière", location: "Provence — France", price: "€ 8 200 000", tag: "Nouveau" },
];

const Collection = () => (
  <main className="pt-20">
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="Collection"
          title="Nos Propriétés"
          subtitle="Chaque bien est sélectionné avec rigueur pour son caractère exceptionnel."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, i) => (
            <motion.div
              key={property.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Collection;
