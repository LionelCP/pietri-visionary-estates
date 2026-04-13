import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => (
  <main className="pt-20">
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="Contact"
          title="Échangeons"
          subtitle="Parlez-nous de votre projet. Nous vous répondrons dans les meilleurs délais."
        />
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Prénom"
              className="bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Nom"
              className="bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <select className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-muted-foreground focus:outline-none focus:border-primary transition-colors">
            <option>Je suis...</option>
            <option>Acheteur</option>
            <option>Vendeur</option>
            <option>Investisseur</option>
            <option>Partenaire</option>
          </select>
          <textarea
            rows={5}
            placeholder="Votre message"
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors duration-300"
          >
            Envoyer
          </button>
        </motion.form>
      </div>
    </section>
  </main>
);

export default Contact;
