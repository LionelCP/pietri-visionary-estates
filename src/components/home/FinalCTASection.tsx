import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FinalCTASection = () => {
  const { t } = useLanguage();
  const c = translations.finalCta;

  const cards = [
    { ...c.sellers, href: "/contact?intent=vendre" },
    { ...c.buyers, href: "/contact?intent=acheter" },
    { ...c.investors, href: "/contact?intent=investir" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
        >
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-6">
            {t(c.overline)}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
            {t(c.title)}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {cards.map((card, i) => (
            <motion.article
              key={card.title.fr}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-secondary p-10 lg:p-12 flex flex-col"
            >
              <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-5 leading-tight">
                {t(card.title)}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                {t(card.desc)}
              </p>
              <a
                href={card.href}
                className="inline-flex items-center font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors duration-300 gap-3 self-start"
              >
                {t(card.cta)}
                <span className="w-6 h-px bg-primary" />
              </a>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display italic text-xl lg:text-2xl text-foreground text-center max-w-3xl mx-auto mt-20 lg:mt-24 leading-relaxed"
        >
          {t(c.closing)}
        </motion.p>
      </div>
    </section>
  );
};

export default FinalCTASection;
