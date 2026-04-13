import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const Philosophy = () => (
  <main className="pt-20">
    <section className="py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="Philosophie"
          title="Une Vision Singulière"
          subtitle="Cabinet Pietri ne suit pas les conventions de l'immobilier traditionnel. Nous les réinventons."
        />
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-muted-foreground leading-relaxed text-center"
          >
            Notre approche repose sur trois piliers fondamentaux : la curation éditoriale des biens, 
            l'excellence dans la présentation, et un réseau international de confiance. Chaque propriété 
            que nous représentons est choisie pour son caractère unique et présentée avec le soin qu'elle mérite.
          </motion.p>
        </div>
      </div>
    </section>
  </main>
);

export default Philosophy;
