import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Contact = () => {
  const { t } = useLanguage();
  const c = translations.pages.contact;

  return (
    <main className="pt-20">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(c.overline)} title={t(c.title)} subtitle={t(c.subtitle)} />
          <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input type="text" placeholder={t(c.firstName)} className="bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder={t(c.lastName)} className="bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>
            <input type="email" placeholder={t(c.email)} className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            <select className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-muted-foreground focus:outline-none focus:border-primary transition-colors">
              <option>{t(c.iAm)}</option>
              <option>{t(c.buyer)}</option>
              <option>{t(c.seller)}</option>
              <option>{t(c.investor)}</option>
              <option>{t(c.partner)}</option>
            </select>
            <textarea rows={5} placeholder={t(c.message)} className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
            <button type="submit" className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors duration-300">
              {t(c.send)}
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
