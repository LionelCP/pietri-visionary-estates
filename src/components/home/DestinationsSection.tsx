import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const DestinationsSection = () => {
  const { t } = useLanguage();
  const d = translations.destinations;

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(d.overline)} title={t(d.title)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mt-4">
          {d.items.map((item, i) => (
            <motion.div
              key={item.name.fr}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-background p-10 lg:p-12 flex flex-col"
            >
              <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-3">
                {t(item.name)}
              </h3>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-primary mb-6">
                {t(item.tagline)}
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {t(item.desc)}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mt-16 lg:mt-20"
        >
          {t(d.closing)}
        </motion.p>
      </div>
    </section>
  );
};

export default DestinationsSection;
