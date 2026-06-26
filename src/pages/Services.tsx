import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import heroServices from "@/assets/hero-services.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
  overline: { fr: "Vendre", en: "Selling" },
  title: { fr: "Vendre avec Cabinet Pietri Immobilier", en: "Selling with Cabinet Pietri Immobilier" },
  subtitle: {
    fr: "Confier un bien, c'est confier une histoire.",
    en: "To entrust a property is to entrust a story.",
  },
  intro: {
    fr: [
      "Vendre un bien immobilier n'est jamais un acte neutre.",
      "Il y a souvent des années de vie, des souvenirs, des choix familiaux, parfois une transmission, un changement de cap ou une nouvelle étape à préparer.",
      "Chez Cabinet Pietri Immobilier, nous accompagnons les propriétaires avec une approche à la fois sensible, structurée et exigeante.",
      "Notre rôle : comprendre votre bien, révéler ce qui le rend unique et le présenter aux bons acquéreurs, avec justesse et discrétion.",
    ],
    en: [
      "Selling a property is never a neutral act.",
      "There are often years of life, memories, family choices, sometimes a transmission, a change of direction or a new chapter to prepare.",
      "At Cabinet Pietri Immobilier, we accompany owners with an approach that is at once sensitive, structured and demanding.",
      "Our role: understand your property, reveal what makes it unique and present it to the right buyers, with rightness and discretion.",
    ],
  },
  stepsHeading: {
    overline: { fr: "Notre accompagnement", en: "Our guidance" },
    title: { fr: "À vos côtés, à chaque étape", en: "By your side, at every step" },
  },
  steps: [
    {
      title: { fr: "Écouter", en: "Listen" },
      lead: {
        fr: "Parce qu'aucun bien ne ressemble à un autre, nous commençons par comprendre votre histoire, votre situation et vos attentes.",
        en: "Because no two properties are alike, we begin by understanding your story, your situation and your expectations.",
      },
      bullets: {
        fr: [
          "Pourquoi vendez-vous ?",
          "Quel est votre calendrier ?",
          "Quels sont les enjeux familiaux, patrimoniaux ou personnels liés à cette vente ?",
        ],
        en: [
          "Why are you selling?",
          "What is your timeline?",
          "What are the family, patrimonial or personal stakes attached to this sale?",
        ],
      },
      close: {
        fr: "Cette première étape permet de poser les bases d'un accompagnement juste.",
        en: "This first step lays the foundations for a fair and considered guidance.",
      },
    },
    {
      title: { fr: "Comprendre", en: "Understand" },
      lead: {
        fr: "Nous analysons le bien dans sa réalité : son emplacement, son état, sa lumière, sa distribution, son environnement, son potentiel et les éléments qui peuvent influencer sa perception.",
        en: "We analyse the property in its full reality: location, condition, light, layout, surroundings, potential and the elements that may influence its perception.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Il ne s'agit pas seulement de regarder une surface ou un prix au mètre carré. Il s'agit de comprendre ce qui fait la valeur du lieu, ce qui le distingue et la manière dont il doit être présenté.",
        en: "This is not simply about looking at a surface area or a price per square metre. It is about understanding what gives the place its value, what sets it apart and how it should be presented.",
      },
    },
    {
      title: { fr: "Révéler", en: "Reveal" },
      lead: {
        fr: "Chaque bien possède une qualité particulière : une vue, une atmosphère, un jardin, une terrasse, une histoire, une adresse, un potentiel de transformation ou une manière d'habiter.",
        en: "Each property has a particular quality: a view, an atmosphere, a garden, a terrace, a story, an address, a potential for transformation or a way of inhabiting space.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Nous travaillons sa mise en valeur avec soin : textes, photos, présentation, sélection des angles forts, cohérence du positionnement et qualité du discours. L'objectif n'est pas d'en faire trop. L'objectif est de montrer juste.",
        en: "We craft its presentation with care: copy, photography, layout, the choice of strong angles, coherence of positioning and quality of voice. The aim is not to overdo it. The aim is to show it rightly.",
      },
    },
    {
      title: { fr: "Accompagner", en: "Accompany" },
      lead: {
        fr: "Nous vous accompagnons tout au long du processus : présentation du bien, échanges avec les acquéreurs, organisation des visites, suivi des offres, coordination avec les parties et accompagnement jusqu'à la concrétisation de la vente.",
        en: "We accompany you throughout the process: presentation of the property, exchanges with buyers, viewings, follow-up of offers, coordination with the parties involved and support through to completion of the sale.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Notre approche privilégie la qualité des échanges, la sélection des interlocuteurs et la continuité de la relation.",
        en: "Our approach favours the quality of exchanges, the selection of interlocutors and the continuity of the relationship.",
      },
    },
  ],
  closing: {
    title: {
      fr: "Une vente réussie ne se limite pas à trouver un acquéreur",
      en: "A successful sale is more than finding a buyer",
    },
    body: {
      fr: [
        "Une vente réussie, c'est une rencontre juste entre un bien, un propriétaire et un acquéreur.",
        "C'est un prix cohérent.",
        "Une présentation soignée.",
        "Des échanges clairs.",
        "Une transaction menée avec sérieux.",
        "Et le sentiment d'avoir respecté l'histoire du lieu.",
      ],
      en: [
        "A successful sale is the right encounter between a property, an owner and a buyer.",
        "A coherent price.",
        "A careful presentation.",
        "Clear exchanges.",
        "A transaction conducted with seriousness.",
        "And the feeling of having respected the story of the place.",
      ],
    },
    quote: {
      fr: [
        "Notre métier est d'accompagner des projets immobiliers.",
        "Notre vocation est d'accompagner des projets de vie.",
      ],
      en: [
        "Our profession is to accompany real estate projects.",
        "Our vocation is to accompany life projects.",
      ],
    },
    cta: { fr: "Confier mon bien", en: "Entrust my property" },
  },
};

const Services = () => {
  const { lang } = useLanguage();
  const t = <T extends { fr: string; en: string }>(o: T) => (lang === "fr" ? o.fr : o.en);
  const arr = <T extends { fr: string[]; en: string[] }>(o: T) => (lang === "fr" ? o.fr : o.en);

  return (
    <main>
      <PageHero
        image={heroServices}
        overline={t(content.overline)}
        title={t(content.title)}
        subtitle={t(content.subtitle)}
        breadcrumbs={[{ label: t(content.overline) }]}
      />

      {/* Intro */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12 space-y-5">
          {arr(content.intro).map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">
              {t(content.stepsHeading.overline)}
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              {t(content.stepsHeading.title)}
            </h2>
            <div className="line-gold max-w-24 mx-auto mt-6" />
          </div>

          <div className="space-y-16">
            {content.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
              >
                <div className="md:col-span-3">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-2">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
                    {t(step.title)}
                  </h3>
                </div>
                <div className="md:col-span-9 space-y-4 border-l border-border pl-6 md:pl-10">
                  <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
                    {t(step.lead)}
                  </p>
                  {arr(step.bullets).length > 0 && (
                    <ul className="space-y-2 pl-4">
                      {arr(step.bullets).map((b, j) => (
                        <li
                          key={j}
                          className="font-body text-base text-muted-foreground leading-relaxed relative before:content-['—'] before:absolute before:-left-4 before:text-primary"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="font-body text-base text-muted-foreground leading-relaxed">
                    {t(step.close)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-foreground mb-8"
          >
            {t(content.closing.title)}
          </motion.h2>
          <div className="space-y-3 mb-12">
            {arr(content.closing.body).map((line, i) => (
              <p key={i} className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <div className="line-gold max-w-24 mx-auto mb-10" />
          <div className="space-y-3 mb-12">
            {arr(content.closing.quote).map((line, i) => (
              <p
                key={i}
                className="font-display italic text-xl md:text-2xl text-foreground leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
          <Link
            to="/contact?intent=vendre"
            className="inline-flex items-center font-body text-xs tracking-[0.3em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors"
          >
            {t(content.closing.cta)}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;
