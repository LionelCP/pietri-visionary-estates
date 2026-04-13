import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const destinations = [
  { name: "Paris", country: "France", properties: 24 },
  { name: "Côte d'Azur", country: "France", properties: 18 },
  { name: "Provence", country: "France", properties: 12 },
  { name: "Londres", country: "Royaume-Uni", properties: 8 },
  { name: "Santorin", country: "Grèce", properties: 6 },
  { name: "Marrakech", country: "Maroc", properties: 5 },
  { name: "Genève", country: "Suisse", properties: 7 },
  { name: "Lisbonne", country: "Portugal", properties: 9 },
];

const DestinationsSection = () => (
  <section className="py-24 lg:py-32 bg-secondary">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <SectionHeading
        overline="Destinations"
        title="Du Local à l'International"
        subtitle="Présents là où se trouvent les propriétés les plus désirables. France, Europe, et au-delà."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {destinations.map((dest, i) => (
          <motion.a
            key={dest.name}
            href="/destinations"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group bg-background p-8 lg:p-10 hover:bg-noir-light transition-colors duration-500 cursor-pointer"
          >
            <h3 className="font-display text-xl lg:text-2xl text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
              {dest.name}
            </h3>
            <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
              {dest.country}
            </p>
            <span className="font-body text-xs text-primary">
              {dest.properties} propriétés
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default DestinationsSection;
