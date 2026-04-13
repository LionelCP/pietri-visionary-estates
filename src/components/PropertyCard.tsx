import { motion } from "framer-motion";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  tag?: string;
}

const PropertyCard = ({ image, title, location, price, tag }: PropertyCardProps) => (
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
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      {tag && (
        <span className="absolute top-4 left-4 font-body text-[10px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-3 py-1.5">
          {tag}
        </span>
      )}
    </div>
    <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
    <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{location}</p>
    <p className="font-body text-sm text-primary">{price}</p>
  </motion.div>
);

export default PropertyCard;
