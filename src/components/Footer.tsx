import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-xl tracking-[0.2em] uppercase text-foreground mb-4">
            Cabinet Pietri
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Une maison immobilière d'exception. Nous réinventons l'art de trouver, 
            présenter et transmettre les propriétés les plus remarquables au monde.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-6">Navigation</h4>
          <div className="flex flex-col gap-3">
            {["Collection", "Destinations", "Services", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-6">Contact</h4>
          <div className="flex flex-col gap-3 font-body text-sm text-muted-foreground">
            <span>Paris — Côte d'Azur — International</span>
            <span>contact@cabinetpietri.com</span>
            <span>+33 (0)1 00 00 00 00</span>
          </div>
        </div>
      </div>
      <div className="line-gold mt-16 mb-8" />
      <p className="font-body text-xs text-muted-foreground tracking-wider text-center">
        © 2026 Cabinet Pietri — Tous droits réservés
      </p>
    </div>
  </footer>
);

export default Footer;
