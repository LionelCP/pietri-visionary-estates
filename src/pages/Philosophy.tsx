import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Philosophy = () => {
  const { t } = useLanguage();
  const p = translations.pages.philosophy;

  return (
    <main className="pt-20">
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(p.overline)} title={t(p.title)} subtitle={t(p.subtitle)} />
          <div className="max-w-3xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-body text-muted-foreground leading-relaxed text-center">
              {t(p.body)}
            </motion.p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Philosophy;
