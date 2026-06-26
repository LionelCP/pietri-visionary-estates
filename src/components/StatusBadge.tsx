import { useLanguage } from "@/i18n/LanguageContext";
import type { PropertyStatus } from "@/lib/properties";

const LABELS: Record<PropertyStatus, { fr: string; en: string }> = {
  disponible: { fr: "Disponible", en: "Available" },
  sous_offre: { fr: "Sous offre", en: "Under offer" },
  reserve: { fr: "Réservé", en: "Reserved" },
  vendu: { fr: "Vendu", en: "Sold" },
  masque: { fr: "Masqué", en: "Hidden" },
};

interface Props {
  status: PropertyStatus;
  variant?: "card" | "inline";
}

const StatusBadge = ({ status, variant = "card" }: Props) => {
  const { lang } = useLanguage();
  const label = LABELS[status][lang];

  // Discreet, premium styling — no garish colors. Subtle gold accent for available, muted tones for others.
  const styles: Record<PropertyStatus, string> = {
    disponible: "border-primary/40 text-primary bg-background/80",
    sous_offre: "border-foreground/30 text-foreground bg-background/80",
    reserve: "border-foreground/30 text-foreground bg-background/80",
    vendu: "border-muted-foreground/30 text-muted-foreground bg-background/80",
    masque: "border-destructive/40 text-destructive bg-background/80",
  };

  const base = variant === "card"
    ? "absolute top-4 left-4 z-10"
    : "inline-flex";

  return (
    <span
      className={`${base} items-center font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border backdrop-blur-sm ${styles[status]}`}
    >
      <span className="w-1 h-1 bg-current mr-2 opacity-70" />
      {label}
    </span>
  );
};

export default StatusBadge;
