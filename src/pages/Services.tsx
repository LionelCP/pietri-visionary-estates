import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const services = [
  { title: "Recherche Sur Mesure", desc: "Identification et sourcing de propriétés rares, y compris off-market." },
  { title: "Conseil en Investissement", desc: "Analyse stratégique et accompagnement dans vos décisions patrimoniales." },
  { title: "Présentation Éditoriale", desc: "Mise en valeur de votre bien avec photographie, vidéo et storytelling de luxe." },
  { title: "Conciergerie", desc: "Services complémentaires : juridique, fiscal, architecture d'intérieur." },
];

const Services = () => (
  <main className="pt-20">
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline="Services" title="Notre Accompagnement" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-4xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-10"
            >
              <h3 className="font-display text-xl text-foreground mb-3">{s.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Services;
