import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import heroPhilosophy from "@/assets/hero-philosophy.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Philosophy = () => {
  const { t } = useLanguage();
  const p = translations.pages.philosophy;

  return (
    <main>
      <PageHero
        image={heroPhilosophy}
        overline={t(p.overline)}
        title={t(p.title)}
        subtitle={t(p.subtitle)}
        breadcrumbs={[{ label: t(p.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              {t(p.body)}
            </p>
            <div className="line-gold max-w-24 mx-auto" />
            <blockquote className="font-display text-xl md:text-2xl italic text-foreground text-center leading-relaxed">
              {t(translations.manifesto.quote)}
            </blockquote>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Philosophy;
