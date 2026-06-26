import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const TrustSection = () => {
  const { t } = useLanguage();
  const tr = translations.trust;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading overline={t(tr.overline)} title={t(tr.title)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
          {tr.items.map((item, i) => (
            <motion.div
              key={item.title.fr}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-l border-primary/40 pl-6"
            >
              <h3 className="font-display text-xl lg:text-2xl text-foreground mb-3 leading-snug">
                {t(item.title)}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {t(item.desc)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
