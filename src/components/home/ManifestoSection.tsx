import { motion } from "framer-motion";

const ManifestoSection = () => (
  <section className="py-32 lg:py-40">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-body text-[11px] tracking-[0.4em] uppercase text-primary block mb-8"
        >
          Notre Vision
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed italic mb-12"
        >
          "Nous ne vendons pas des propriétés.
          <br className="hidden md:block" />
          Nous révélons des lieux d'exception
          <br className="hidden md:block" />
          à ceux qui savent les voir."
        </motion.blockquote>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="line-gold max-w-32 mx-auto mb-12"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Cabinet Pietri incarne une nouvelle génération de l'immobilier de prestige.
          Notre approche éditoriale et notre réseau international transforment chaque
          transaction en une expérience sur mesure, à la hauteur des biens que nous présentons.
        </motion.p>
      </div>
    </div>
  </section>
);

export default ManifestoSection;
