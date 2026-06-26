import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import heroPhilosophy from "@/assets/hero-philosophy.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const content = {
  intro: {
    fr: [
      "Nous croyons qu'un lieu n'est jamais seulement un bien.",
      "C'est un ancrage.",
      "Un refuge.",
      "Un terrain de souvenirs.",
      "Parfois un retour aux sources.",
      "Parfois le début d'un nouveau chapitre.",
    ],
    en: [
      "We believe a place is never just a property.",
      "It is an anchor.",
      "A refuge.",
      "A ground for memories.",
      "Sometimes a return to one's roots.",
      "Sometimes the beginning of a new chapter.",
    ],
  },
  introClose: {
    fr: "Chez Cabinet Pietri Immobilier, nous ne considérons pas l'immobilier comme une simple transaction. Nous l'abordons comme une rencontre entre une personne, une histoire et un lieu.",
    en: "At Cabinet Pietri Immobilier, we do not approach real estate as a mere transaction. We approach it as an encounter between a person, a story and a place.",
  },
  sections: [
    {
      title: { fr: "Une approche familiale", en: "A family approach" },
      lead: {
        fr: "Cabinet Pietri est avant tout une entreprise familiale.",
        en: "Cabinet Pietri is, above all, a family business.",
      },
      paragraphs: {
        fr: [
          "Fondé par Lionel et Christelle Pietri, le cabinet s'est construit autour d'une conviction simple : un projet immobilier mérite du temps, de l'écoute et de la justesse.",
          "Vendre un bien, acheter une maison, chercher un pied-à-terre ou transmettre un lieu de famille ne sont jamais des actes neutres. Ce sont souvent des étapes importantes, parfois sensibles, toujours personnelles.",
          "Notre rôle est d'accompagner ces moments avec sérieux, délicatesse et engagement.",
        ],
        en: [
          "Founded by Lionel and Christelle Pietri, the firm was built around a simple conviction: a real estate project deserves time, attentive listening and rightness.",
          "Selling a property, buying a home, looking for a pied-à-terre or passing on a family place is never a neutral act. These are often important moments, sometimes sensitive, always personal.",
          "Our role is to accompany these moments with seriousness, care and commitment.",
        ],
      },
    },
    {
      title: { fr: "Comprendre avant de proposer", en: "Understand before proposing" },
      paragraphs: {
        fr: [
          "Nous ne cherchons pas à présenter le plus grand nombre de biens.",
          "Nous cherchons à comprendre ce qui compte vraiment pour vous : votre rythme de vie, votre lien au territoire, vos contraintes, vos envies, vos projets familiaux ou patrimoniaux.",
          "Un bien peut être juste par son emplacement, sa lumière, sa vue, son potentiel, son silence, son histoire ou la manière dont il répond à une période de vie.",
          "C'est cette justesse que nous recherchons.",
        ],
        en: [
          "We do not seek to present the largest possible number of properties.",
          "We seek to understand what truly matters to you: your pace of life, your bond with a territory, your constraints, your wishes, your family or patrimonial projects.",
          "A property can be the right one through its location, its light, its view, its potential, its quiet, its history or the way it answers a particular moment in life.",
          "It is this rightness that we look for.",
        ],
      },
    },
    {
      title: { fr: "Des lieux choisis, pas simplement affichés", en: "Places chosen, not simply listed" },
      paragraphs: {
        fr: [
          "Chaque bien que nous présentons doit avoir une cohérence.",
          "En Corse, sur le continent ou en Asie, nous privilégions les lieux qui ont une âme, un potentiel ou une qualité de vie réelle.",
          "Cela peut être une maison de famille, un appartement bien situé, une résidence à révéler, un projet de vie à l'étranger ou une opportunité patrimoniale sélectionnée avec soin.",
          "Notre collection n'a pas vocation à être exhaustive. Elle a vocation à être choisie.",
        ],
        en: [
          "Every property we present must have coherence.",
          "In Corsica, on the continent or in Asia, we favour places with a soul, a potential or a genuine quality of life.",
          "It may be a family home, a well-placed apartment, a residence to reveal, a life project abroad or a carefully selected patrimonial opportunity.",
          "Our collection is not meant to be exhaustive. It is meant to be chosen.",
        ],
      },
    },
    {
      title: { fr: "Vendre avec sensibilité", en: "Selling with sensitivity" },
      paragraphs: {
        fr: [
          "Un bien immobilier porte souvent une histoire.",
          "Il a été habité, entretenu, transformé, parfois transmis. Il peut représenter des années de vie, de travail ou de souvenirs.",
          "Lorsque nous accompagnons une vente, nous cherchons à présenter le bien avec justesse : ni le dénaturer, ni le banaliser.",
          "La mise en valeur doit révéler ce qui rend le lieu singulier, tout en respectant son histoire et ses propriétaires.",
        ],
        en: [
          "A property often carries a story.",
          "It has been lived in, cared for, transformed, sometimes passed on. It may represent years of life, work or memories.",
          "When we accompany a sale, we present the property with rightness: neither distorting it, nor making it ordinary.",
          "Our work should reveal what makes a place singular while respecting its history and its owners.",
        ],
      },
    },
    {
      title: { fr: "Acheter avec discernement", en: "Buying with discernment" },
      paragraphs: {
        fr: [
          "Acheter, ce n'est pas seulement comparer des surfaces, des prix et des prestations.",
          "C'est se projeter dans un lieu. Comprendre ce qu'il permet, ce qu'il demande, ce qu'il peut devenir.",
          "Nous accompagnons les acquéreurs dans cette lecture : le cadre de vie, l'emplacement, l'usage, le potentiel, les points de vigilance et la cohérence du projet.",
          "Parce qu'un achat réussi n'est pas seulement un bon achat sur le papier. C'est un lieu dans lequel on se sent à sa place.",
        ],
        en: [
          "Buying is not merely comparing square metres, prices and features.",
          "It is projecting yourself into a place. Understanding what it allows, what it demands, what it can become.",
          "We accompany buyers in this reading: the setting, the location, the use, the potential, the points of caution and the coherence of the project.",
          "Because a successful purchase is not only a good purchase on paper. It is a place in which one feels at home.",
        ],
      },
    },
  ],
  commitments: {
    title: { fr: "Une même exigence", en: "One same standard" },
    intro: {
      fr: "Notre approche repose sur quatre engagements :",
      en: "Our approach rests on four commitments:",
    },
    items: [
      {
        title: { fr: "Écouter", en: "Listen" },
        desc: {
          fr: "Comprendre votre projet avant de parler de biens.",
          en: "Understand your project before talking about properties.",
        },
      },
      {
        title: { fr: "Sélectionner", en: "Select" },
        desc: {
          fr: "Présenter des lieux cohérents, pas multiplier les visites inutiles.",
          en: "Present coherent places rather than multiplying unnecessary viewings.",
        },
      },
      {
        title: { fr: "Valoriser", en: "Reveal" },
        desc: {
          fr: "Révéler l'atmosphère, le potentiel et la singularité d'un bien.",
          en: "Reveal the atmosphere, potential and singularity of a property.",
        },
      },
      {
        title: { fr: "Accompagner", en: "Accompany" },
        desc: {
          fr: "Être présent avec clarté, discrétion et continuité, de la première rencontre jusqu'à la concrétisation du projet.",
          en: "Be present with clarity, discretion and continuity, from the first meeting to the realisation of the project.",
        },
      },
    ],
  },
  closing: {
    title: { fr: "Certains lieux nous choisissent", en: "Some places choose us" },
    paragraphs: {
      fr: [
        "Nous sommes convaincus que certains lieux nous choisissent autant que nous les choisissons.",
        "Notre rôle est simplement de faciliter cette rencontre : avec écoute, exigence et sincérité.",
      ],
      en: [
        "We are convinced that some places choose us as much as we choose them.",
        "Our role is simply to make that encounter possible: with attention, exactness and sincerity.",
      ],
    },
    cta: { fr: "Échanger avec nous", en: "Talk with us" },
  },
};

const Divider = () => <div className="line-gold max-w-24 mx-auto my-16" />;

const Philosophy = () => {
  const { t, lang } = useLanguage();
  const p = translations.pages.philosophy;
  const arr = <T extends { fr: string[]; en: string[] }>(o: T) => o[lang] ?? o.fr;

  return (
    <main>
      <PageHero
        image={heroPhilosophy}
        overline={t(p.overline)}
        title={t(p.title)}
        subtitle={t(p.subtitle)}
        breadcrumbs={[{ label: t(p.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {t(content.intro).map((line, i) => (
              <p
                key={i}
                className="font-display text-2xl md:text-3xl text-foreground leading-snug"
              >
                {line}
              </p>
            ))}
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed pt-6">
              {t(content.introClose)}
            </p>
          </motion.div>

          {content.sections.map((s, idx) => (
            <div key={idx}>
              <Divider />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                  {t(s.title)}
                </h2>
                {"lead" in s && s.lead && (
                  <p className="font-body text-lg text-foreground italic">
                    {t(s.lead)}
                  </p>
                )}
                {t(s.paragraphs).map((para, i) => (
                  <p
                    key={i}
                    className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </motion.div>
            </div>
          ))}

          {/* Commitments */}
          <Divider />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              {t(content.commitments.title)}
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              {t(content.commitments.intro)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {content.commitments.items.map((it, i) => (
                <div key={i} className="border-l border-primary pl-5">
                  <h3 className="font-display text-xl text-foreground mb-2">{t(it.title)}</h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t(it.desc)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Closing */}
          <Divider />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              {t(content.closing.title)}
            </h2>
            {t(content.closing.paragraphs).map((para, i) => (
              <p
                key={i}
                className="font-display text-xl md:text-2xl italic text-foreground leading-relaxed max-w-[680px] mx-auto"
              >
                {para}
              </p>
            ))}
            <div className="pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center font-body text-xs tracking-[0.3em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors"
              >
                {t(content.closing.cta)}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Philosophy;
