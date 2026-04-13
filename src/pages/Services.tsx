import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Services = () => {
  const { t } = useLanguage();
  const s = translations.pages.services;

  return (
    <main className="pt-20">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(s.overline)} title={t(s.title)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-4xl mx-auto">
            {s.items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background p-10">
                <h3 className="font-display text-xl text-foreground mb-3">{t(item.title)}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{t(item.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
