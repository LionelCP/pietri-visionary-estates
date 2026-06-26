import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const ServicesSection = () => {
  const { t } = useLanguage();
  const s = translations.services;

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(s.overline)} title={t(s.title)} subtitle={t(s.subtitle)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {s.items.map((item, i) => (
            <motion.article
              key={item.title.fr}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-background p-10 lg:p-12 flex flex-col"
            >
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-6">
                0{i + 1}
              </span>
              <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-5 leading-tight">
                {t(item.title)}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                {t(item.desc)}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3"
              >
                {t(item.cta)}
                <span className="w-6 h-px bg-primary" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
