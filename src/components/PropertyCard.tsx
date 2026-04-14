import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  tag?: string;
  beds?: number;
  baths?: number;
  area?: string;
  matterportId?: string;
  onTourClick?: () => void;
}

const PropertyCard = ({ image, title, location, price, tag, beds, baths, area, matterportId, onTourClick }: PropertyCardProps) => {
  const { lang } = useLanguage();
  const tourLabel = lang === "fr" ? "Visite 3D" : "3D Tour";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[3/4] mb-5">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        {tag && (
          <span className="absolute top-4 left-4 font-body text-[10px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-3 py-1.5">
            {tag}
          </span>
        )}

        {/* Virtual Tour Button */}
        {matterportId && onTourClick && (
          <button
            onClick={(e) => { e.stopPropagation(); onTourClick(); }}
            className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-2 font-body text-[10px] tracking-[0.15em] uppercase text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/tour"
          >
            <Play size={12} className="fill-current" />
            {tourLabel}
          </button>
        )}

        {(beds || baths || area) && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 font-body text-[10px] tracking-[0.15em] uppercase text-foreground/80">
            {beds && <span>{beds} BD</span>}
            {baths && <span>{baths} BA</span>}
            {area && <span>{area}</span>}
          </div>
        )}
      </div>
      <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{location}</p>
      <p className="font-body text-sm text-primary">{price}</p>
    </motion.div>
  );
};

export default PropertyCard;
