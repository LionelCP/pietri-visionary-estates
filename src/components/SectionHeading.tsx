import { motion } from "framer-motion";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ overline, title, subtitle, align = "center" }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
  >
    {overline && (
      <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-4">
        {overline}
      </span>
    )}
    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="font-body text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className={`line-gold mt-8 max-w-24 ${align === "center" ? "mx-auto" : ""}`} />
  </motion.div>
);

export default SectionHeading;
