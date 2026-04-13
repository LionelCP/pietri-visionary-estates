import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const CTASection = () => {
  const { t } = useLanguage();
  const c = translations.cta;

  const profiles = [
    { title: t(c.investors.title), description: t(c.investors.desc), cta: t(c.investors.cta) },
    { title: t(c.sellers.title), description: t(c.sellers.desc), cta: t(c.sellers.cta) },
    { title: t(c.partners.title), description: t(c.partners.desc), cta: t(c.partners.cta) },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-4">{t(c.overline)}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">{t(c.title)}</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {profiles.map((profile, i) => (
            <motion.div key={profile.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="bg-background p-10 lg:p-14 flex flex-col">
              <h3 className="font-display text-2xl text-foreground mb-4">{profile.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 flex-1">{profile.description}</p>
              <a href="/contact" className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3">
                {profile.cta}
                <span className="w-6 h-px bg-primary transition-all duration-300 group-hover:w-10" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
