import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = [
    { label: t(translations.nav.collection), href: "/biens" },
    { label: t(translations.nav.destinations), href: "/destinations" },
    { label: t(translations.nav.services), href: "/services" },
    { label: t(translations.nav.contact), href: "/contact" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-xl tracking-[0.2em] uppercase text-foreground mb-4">
              Cabinet Pietri
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
              {t(translations.footer.description)}
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-6">
              {t(translations.footer.navigation)}
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-6">
              {t(translations.footer.contact)}
            </h4>
            <div className="flex flex-col gap-3 font-body text-sm text-muted-foreground">
              <span>Paris — Côte d'Azur — International</span>
              <span>contact@cabinetpietri.com</span>
              <span>+33 (0)1 00 00 00 00</span>
            </div>
          </div>
        </div>
        <div className="line-gold mt-16 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © 2026 Cabinet Pietri — {t(translations.footer.rights)}
          </p>
          <Link to="/confidentialite" className="font-body text-xs text-muted-foreground hover:text-foreground tracking-wider transition-colors">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
