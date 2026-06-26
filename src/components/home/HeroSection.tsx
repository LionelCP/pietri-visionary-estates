import { motion } from "framer-motion";
import heroImage from "@/assets/hero-villa.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const HeroSection = () => {
  const { t } = useLanguage();
  const h = translations.hero;

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Villa de prestige en Balagne, Corse — Cabinet Pietri Immobilier" width={1920} height={1080} className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="max-w-2xl">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="font-body text-[11px] tracking-[0.4em] uppercase text-primary block mb-6">
              {t(h.overline)}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="font-display text-4xl md:text-5xl lg:text-7xl text-foreground leading-[1.1] mb-8">
              {t(h.title1)}<br /><span className="italic text-primary">{t(h.title2)}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="font-body text-base md:text-lg text-cream-muted leading-relaxed mb-10 max-w-lg">
              {t(h.description)}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="flex flex-col sm:flex-row gap-4">
              <a href="/contact" className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors duration-300">
                {t(h.cta1)}
              </a>
              <a href="/collection" className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-foreground/30 text-foreground hover:border-primary hover:text-primary transition-colors duration-300">
                {t(h.cta2)}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{t(h.scroll)}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
