import { motion } from "framer-motion";
import { useState } from "react";
import PageHero from "@/components/PageHero";
import heroCollection from "@/assets/hero-collection.jpg";
import { useLanguage } from "@/i18n/LanguageContext";


const content = {
  overline: { fr: "Contact", en: "Contact" },
  title: { fr: "Parlons de votre projet", en: "Let's talk about your project" },
  intro: {
    fr: [
      "Vous souhaitez vendre un bien, acheter un lieu qui vous ressemble, nous confier une recherche ou simplement échanger sur une opportunité ?",
      "Racontez-nous votre projet, vos envies, votre histoire.",
      "Nous prendrons le temps de comprendre votre demande avant de vous orienter.",
    ],
    en: [
      "Would you like to sell a property, buy a place that resembles you, entrust us with a search, or simply discuss an opportunity?",
      "Tell us about your project, your desires, your story.",
      "We will take the time to understand your request before guiding you.",
    ],
  },
  formHeading: { fr: "Écrivez-nous", en: "Write to us" },
  fields: {
    firstName: { fr: "Prénom", en: "First name" },
    lastName: { fr: "Nom", en: "Last name" },
    email: { fr: "Email", en: "Email" },
    phone: { fr: "Téléphone", en: "Phone" },
    iAm: { fr: "Je suis…", en: "I am…" },
    project: { fr: "Mon projet concerne…", en: "My project concerns…" },
    message: { fr: "Votre message", en: "Your message" },
    messagePlaceholder: {
      fr: "Racontez-nous librement votre projet : le type de bien, le lieu recherché, votre calendrier, votre budget si vous souhaitez le préciser, ou les premiers éléments du bien que vous souhaitez vendre.",
      en: "Tell us freely about your project: the type of property, the location sought, your timeline, your budget if you wish to share it, or initial details about the property you would like to sell.",
    },
    send: { fr: "Envoyer", en: "Send" },
  },
  roles: {
    fr: ["Vendeur", "Acquéreur", "Investisseur", "Partenaire", "Autre"],
    en: ["Seller", "Buyer", "Investor", "Partner", "Other"],
  },
  regions: {
    fr: ["Corse", "Continent", "Asie", "Je ne sais pas encore"],
    en: ["Corsica", "Mainland", "Asia", "I don't know yet"],
  },
  directHeading: { fr: "Nous contacter directement", en: "Contact us directly" },
  directIntro: {
    fr: "Vous pouvez également nous écrire ou nous appeler :",
    en: "You can also write to us or call us:",
  },
  directReply: {
    fr: "Nous vous répondrons dans les meilleurs délais.",
    en: "We will reply to you as soon as possible.",
  },
  privacy: {
    fr: "Vos informations sont traitées avec confidentialité et utilisées uniquement pour répondre à votre demande.",
    en: "Your information is handled confidentially and used only to respond to your request.",
  },
} as const;

const Contact = () => {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const arr = <T,>(o: { fr: readonly T[]; en: readonly T[] }) => (lang === "en" ? o.en : o.fr);

  const inputCls =
    "w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <main>
      <PageHero overline={t(content.overline)} title={t(content.title)} />

      <section className="py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto space-y-5 text-center"
          >
            {arr(content.intro).map((p, i) => (
              <p key={i} className="font-body text-base lg:text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-10 text-center">
              {t(content.formHeading)}
            </h2>

            {submitted ? (
              <p className="text-center font-body text-muted-foreground py-12">
                {lang === "en"
                  ? "Thank you. We will get back to you shortly."
                  : "Merci. Nous reviendrons vers vous très prochainement."}
              </p>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input required type="text" placeholder={`${t(content.fields.firstName)} *`} className={inputCls} />
                  <input required type="text" placeholder={`${t(content.fields.lastName)} *`} className={inputCls} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input required type="email" placeholder={`${t(content.fields.email)} *`} className={inputCls} />
                  <input type="tel" placeholder={t(content.fields.phone)} className={inputCls} />
                </div>

                <select required defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    {`${t(content.fields.iAm)} *`}
                  </option>
                  {arr(content.roles).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>

                <select defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    {t(content.fields.project)}
                  </option>
                  {arr(content.regions).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>

                <textarea
                  required
                  rows={6}
                  placeholder={t(content.fields.messagePlaceholder)}
                  className={`${inputCls} resize-none`}
                />

                <button
                  type="submit"
                  className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors duration-300"
                >
                  {t(content.fields.send)}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <div className="w-12 h-px bg-primary mx-auto mb-10" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-5"
          >
            <h2 className="font-display text-2xl lg:text-3xl text-foreground">{t(content.directHeading)}</h2>
            <p className="font-body text-muted-foreground">{t(content.directIntro)}</p>
            <ul className="font-body text-base text-foreground space-y-2">
              <li>
                <a href="mailto:pietriexpertimmo@gmail.com" className="hover:text-primary transition-colors">
                  pietriexpertimmo@gmail.com
                </a>
              </li>
              <li>
                Lionel Pietri :{" "}
                <a href="tel:+33638468401" className="hover:text-primary transition-colors">
                  +33 6 38 46 84 01
                </a>
              </li>
              <li>
                Christelle Pietri :{" "}
                <a href="tel:+33688761951" className="hover:text-primary transition-colors">
                  +33 6 88 76 19 51
                </a>
              </li>
            </ul>
            <p className="font-body text-muted-foreground pt-4">{t(content.directReply)}</p>
            <p className="font-body text-xs text-muted-foreground/80 italic pt-6 max-w-xl mx-auto">
              {t(content.privacy)}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
