import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import heroServices from "@/assets/hero-services.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
  overline: { fr: "Acheter", en: "Buying" },
  title: { fr: "Acheter avec Cabinet Pietri Immobilier", en: "Buying with Cabinet Pietri Immobilier" },
  subtitle: {
    fr: "Trouver un lieu qui vous ressemble.",
    en: "Find a place that resembles you.",
  },
  intro: {
    fr: [
      "Acheter un bien immobilier, ce n'est pas seulement choisir une surface, une adresse ou un budget.",
      "C'est se projeter dans un lieu.",
      "Imaginer une manière de vivre.",
      "Préparer un retour aux sources, une installation, un refuge familial ou un nouveau chapitre.",
      "Chez Cabinet Pietri Immobilier, nous accompagnons les acquéreurs avec une approche attentive, humaine et exigeante.",
      "Notre rôle : comprendre votre recherche, sélectionner des biens cohérents avec votre projet et vous aider à reconnaître le lieu juste.",
    ],
    en: [
      "Buying a property is not simply about choosing a surface area, an address or a budget.",
      "It is about projecting yourself into a place.",
      "Imagining a way of living.",
      "Preparing a return to one's roots, a move, a family refuge or a new chapter.",
      "At Cabinet Pietri Immobilier, we accompany buyers with an approach that is attentive, human and demanding.",
      "Our role: understand your search, select properties consistent with your project and help you recognise the right place.",
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
        fr: "Parce qu'aucun projet ne se ressemble, nous commençons par vous donner le temps de raconter le vôtre.",
        en: "Because no two projects are alike, we begin by giving you the time to tell us yours.",
      },
      bullets: {
        fr: [
          "Où souhaitez-vous vivre ?",
          "Quel rythme recherchez-vous ?",
          "Quel lien avez-vous avec le territoire ?",
          "Quel usage imaginez-vous pour ce bien ?",
        ],
        en: [
          "Where would you like to live?",
          "What pace of life are you seeking?",
          "What bond do you have with the territory?",
          "What use do you imagine for this property?",
        ],
      },
      close: {
        fr: "Cette première étape permet de dépasser les critères techniques pour comprendre ce qui compte vraiment.",
        en: "This first step takes us beyond technical criteria to understand what really matters.",
      },
    },
    {
      title: { fr: "Comprendre", en: "Understand" },
      lead: {
        fr: "Nous cherchons à comprendre non seulement ce que vous recherchez, mais surtout pourquoi vous le recherchez.",
        en: "We seek to understand not only what you are looking for, but above all why you are looking for it.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Résidence principale, lieu de famille, pied-à-terre, retour en Corse, projet à l'étranger ou acquisition patrimoniale : chaque recherche porte une intention différente. C'est cette intention qui nous permet de sélectionner les biens les plus cohérents.",
        en: "Main residence, family home, pied-à-terre, return to Corsica, project abroad or patrimonial acquisition: each search carries a different intention. It is this intention that allows us to select the most coherent properties.",
      },
    },
    {
      title: { fr: "Révéler", en: "Reveal" },
      lead: {
        fr: "Un bien ne se résume pas à ses photos ou à sa fiche technique.",
        en: "A property cannot be reduced to its photographs or its technical sheet.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Nous vous aidons à lire ce qu'un lieu permet : son atmosphère, sa lumière, sa distribution, son environnement, son potentiel, mais aussi ses contraintes éventuelles. Notre rôle est de vous aider à voir juste, sans précipitation ni idéalisation excessive.",
        en: "We help you read what a place allows: its atmosphere, light, layout, surroundings, potential and any constraints. Our role is to help you see clearly, without haste or excessive idealisation.",
      },
    },
    {
      title: { fr: "Accompagner", en: "Accompany" },
      lead: {
        fr: "Nous vous guidons avec la même attention du premier échange jusqu'à la concrétisation de votre projet.",
        en: "We guide you with the same attention from our first exchange through to the realisation of your project.",
      },
      bullets: { fr: [], en: [] },
      close: {
        fr: "Recherche, sélection, visites, échanges, négociation, coordination avec les parties et accompagnement jusqu'à la signature : nous restons présents à chaque étape. L'objectif n'est pas simplement de trouver un bien. L'objectif est de trouver celui qui correspond réellement à votre projet de vie.",
        en: "Search, selection, viewings, exchanges, negotiation, coordination with the parties and support through to signing: we remain present at every step. The aim is not simply to find a property. The aim is to find the one that truly matches your life project.",
      },
    },
  ],
  closing: {
    title: { fr: "Acheter avec discernement", en: "Buying with discernment" },
    body: {
      fr: [
        "Un achat réussi n'est pas seulement un achat séduisant.",
        "C'est un lieu cohérent avec votre vie, votre budget, votre rythme, vos envies et vos perspectives.",
      ],
      en: [
        "A successful purchase is not simply an attractive purchase.",
        "It is a place coherent with your life, your budget, your pace, your wishes and your prospects.",
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
    cta: { fr: "Nous parler de votre recherche", en: "Tell us about your search" },
  },
};

const Acheter = () => {
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
            to="/contact?intent=acheter"
            className="inline-flex items-center font-body text-xs tracking-[0.3em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors"
          >
            {t(content.closing.cta)}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Acheter;
