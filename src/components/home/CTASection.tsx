import { motion } from "framer-motion";

const profiles = [
  {
    title: "Investisseurs",
    description: "Accédez à des opportunités off-market et à une analyse stratégique de chaque actif.",
    cta: "Espace Investisseur",
  },
  {
    title: "Vendeurs",
    description: "Confiez votre bien à une maison qui sublimera sa présentation et trouvera l'acquéreur idéal.",
    cta: "Estimer Mon Bien",
  },
  {
    title: "Partenaires",
    description: "Rejoignez un réseau international de professionnels partageant notre vision de l'excellence.",
    cta: "Devenir Partenaire",
  },
];

const CTASection = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-4">
          Votre Projet
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
          Comment pouvons-nous vous accompagner ?
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-background p-10 lg:p-14 flex flex-col"
          >
            <h3 className="font-display text-2xl text-foreground mb-4">{profile.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
              {profile.description}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3"
            >
              {profile.cta}
              <span className="w-6 h-px bg-primary transition-all duration-300 group-hover:w-10" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CTASection;
