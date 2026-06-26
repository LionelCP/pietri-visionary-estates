import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import StatusBadge from "@/components/StatusBadge";
import { formatLocation, formatPrice, type Property } from "@/lib/properties";
import placeholder from "@/assets/hero-collection.jpg";

interface Props {
  property: Property;
  onTourClick?: () => void;
}

const PropertyCardDb = ({ property, onTourClick }: Props) => {
  const { lang } = useLanguage();
  const tourLabel = lang === "fr" ? "Visite 3D" : "3D Tour";
  const image = property.main_image_url || placeholder;
  const location = formatLocation(property);
  const price = formatPrice(property, lang);
  const detailHref = `/biens/${property.slug}`;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4, ease: "easeOut" }} className="group">
      <Link to={detailHref} className="block">
        <div className="relative overflow-hidden aspect-[3/4] mb-5">
          <img
            src={image}
            alt={`${property.title}${location ? " — " + location : ""}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <StatusBadge status={property.status} />

          {property.matterport_id && onTourClick && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTourClick(); }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-2 font-body text-[10px] tracking-[0.15em] uppercase text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Play size={12} className="fill-current" />
              {tourLabel}
            </button>
          )}

          {(property.bedrooms || property.bathrooms || property.area_m2) && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 font-body text-[10px] tracking-[0.15em] uppercase text-foreground/80">
              {property.bedrooms ? <span>{property.bedrooms} {lang === "fr" ? "CH" : "BD"}</span> : null}
              {property.bathrooms ? <span>{property.bathrooms} {lang === "fr" ? "SDB" : "BA"}</span> : null}
              {property.area_m2 ? <span>{property.area_m2} m²</span> : null}
            </div>
          )}
        </div>
        <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{property.title}</h3>
        {location && <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{location}</p>}
        <p className="font-body text-sm text-primary">{price}</p>
      </Link>
    </motion.div>
  );
};

export default PropertyCardDb;
