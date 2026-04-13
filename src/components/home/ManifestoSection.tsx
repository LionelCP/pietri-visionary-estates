import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const ManifestoSection = () => {
  const { t } = useLanguage();
  const m = translations.manifesto;

  return (
    <section className="py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="font-body text-[11px] tracking-[0.4em] uppercase text-primary block mb-8">
            {t(m.overline)}
          </motion.span>
          <motion.blockquote initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed italic mb-12">
            {t(m.quote)}
          </motion.blockquote>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} className="line-gold max-w-32 mx-auto mb-12" />
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t(m.description)}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
