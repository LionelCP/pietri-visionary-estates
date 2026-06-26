import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FinalCTASection = () => {
  const { t } = useLanguage();
  const c = translations.finalCta;

  const ctas = [
    { label: t(c.project), href: "/contact", primary: true },
    { label: t(c.estimate), href: "/contact?intent=estimation" },
    { label: t(c.browse), href: "/collection" },
    { label: t(c.callback), href: "/contact?intent=callback" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-6">
            {t(c.overline)}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            {t(c.title)}
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-12">
            {t(c.subtitle)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                className={`inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-300 ${
                  cta.primary
                    ? "bg-primary text-primary-foreground hover:bg-gold-light"
                    : "border border-foreground/30 text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
