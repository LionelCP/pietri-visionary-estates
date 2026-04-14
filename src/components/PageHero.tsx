import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  image: string;
  overline?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const PageHero = ({ image, overline, title, subtitle, breadcrumbs }: PageHeroProps) => {
  const { lang } = useLanguage();
  const home = lang === "fr" ? "Accueil" : "Home";

  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" width={1920} height={800} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-16 lg:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          {breadcrumbs && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">{home}</Link>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-border">›</span>
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                    ) : (
                      <span className="text-foreground">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}

          {overline && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-body text-[11px] tracking-[0.4em] uppercase text-primary block mb-4"
            >
              {overline}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-4"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-body text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="line-gold-left mt-8 max-w-32 origin-left"
          />
        </div>
      </div>
    </section>
  );
};

export default PageHero;
