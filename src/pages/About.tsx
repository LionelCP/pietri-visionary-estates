import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const About = () => (
  <main className="pt-20">
    <section className="py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="À Propos"
          title="Cabinet Pietri"
          subtitle="Fondé sur la conviction que l'immobilier d'exception mérite une approche d'exception."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-6 font-body text-sm text-muted-foreground leading-relaxed text-center"
        >
          <p>
            Cabinet Pietri est né d'une vision : transformer la manière dont les propriétés d'exception 
            sont présentées, partagées et transmises. Nous croyons que chaque lieu raconte une histoire, 
            et notre rôle est de la révéler.
          </p>
          <p>
            Notre équipe réunit des experts en immobilier, en architecture et en communication de luxe, 
            unis par la même exigence de qualité et le même sens du détail.
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default About;
