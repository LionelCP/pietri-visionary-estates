import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import heroAbout from "@/assets/hero-about.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const About = () => {
  const { t } = useLanguage();
  const a = translations.pages.about;

  return (
    <main>
      <PageHero
        image={heroAbout}
        overline={t(a.overline)}
        title={t(a.title)}
        subtitle={t(a.subtitle)}
        breadcrumbs={[{ label: t(a.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 font-body text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            <p>{t(a.p1)}</p>
            <div className="line-gold max-w-16" />
            <p>{t(a.p2)}</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
