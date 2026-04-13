import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const About = () => {
  const { t } = useLanguage();
  const a = translations.pages.about;

  return (
    <main className="pt-20">
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(a.overline)} title={t(a.title)} subtitle={t(a.subtitle)} />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto space-y-6 font-body text-sm text-muted-foreground leading-relaxed text-center">
            <p>{t(a.p1)}</p>
            <p>{t(a.p2)}</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
