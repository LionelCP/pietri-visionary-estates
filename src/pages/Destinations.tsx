import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import heroCollection from "@/assets/hero-collection.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
  overline: { fr: "Destinations", en: "Destinations" },
  title: {
    fr: "Des territoires choisis, une approche sur mesure",
    en: "Chosen territories, a tailored approach",
  },
  subtitle: {
    fr: "Corse, continent, Asie — nous accompagnons des projets cohérents avec une exigence commune.",
    en: "Corsica, mainland, Asia — we accompany coherent projects with one same standard.",
  },
  intro: {
    fr: [
      "Cabinet Pietri Immobilier intervient sur des territoires que nous connaissons, que nous aimons ou que nous sélectionnons pour la qualité des projets qu'ils permettent.",
      "Notre approche n'est pas de multiplier les destinations, mais d'accompagner des lieux cohérents avec notre vision : qualité de vie, justesse du projet, potentiel du bien et relation de confiance.",
    ],
    en: [
      "Cabinet Pietri Immobilier operates in territories we know, that we love, or that we select for the quality of the projects they allow.",
      "Our approach is not to multiply destinations, but to accompany places consistent with our vision: quality of life, rightness of the project, potential of the property and a relationship of trust.",
    ],
  },
  territories: [
    {
      name: { fr: "Corse", en: "Corsica" },
      tagline: { fr: "Notre ancrage", en: "Our anchor" },
      paragraphs: {
        fr: [
          "La Corse est notre territoire de cœur.",
          "Nous y accompagnons des projets de vie, de retour aux sources, de transmission familiale, d'installation ou de changement de rythme.",
          "Bastia, Balagne, littoral, villages, propriétés familiales, appartements de ville ou lieux à révéler : chaque bien demande une lecture attentive du territoire, de son environnement et de son histoire.",
          "En Corse, nous privilégions une approche respectueuse : comprendre le lieu avant de le présenter, valoriser sans dénaturer, accompagner sans précipiter.",
        ],
        en: [
          "Corsica is our home ground.",
          "We accompany life projects, returns to one's roots, family transmissions, settlements and changes of pace.",
          "Bastia, Balagne, coastline, villages, family properties, city apartments or places to reveal: each property calls for an attentive reading of the territory, its surroundings and its history.",
          "In Corsica, we favour a respectful approach: understand the place before presenting it, enhance without distorting, accompany without rushing.",
        ],
      },
    },
    {
      name: { fr: "Continent", en: "Mainland" },
      tagline: { fr: "Une sélection confidentielle", en: "A confidential selection" },
      paragraphs: {
        fr: [
          "Sur le continent, nous intervenons sur des projets choisis : adresses patrimoniales, opportunités ciblées, biens de caractère ou dossiers nécessitant un accompagnement discret.",
          "Monaco, Côte d'Azur, grandes villes ou adresses plus confidentielles : notre rôle est d'apporter une sélection claire, un regard exigeant et une relation de confiance.",
          "Nous n'avons pas vocation à couvrir tous les marchés. Nous accompagnons les projets dans lesquels notre réseau, notre regard et notre méthode apportent une vraie valeur.",
        ],
        en: [
          "On the mainland, we work on chosen projects: patrimonial addresses, targeted opportunities, properties of character or files requiring discreet support.",
          "Monaco, the Côte d'Azur, major cities or more confidential addresses: our role is to bring a clear selection, a demanding eye and a relationship of trust.",
          "We do not aim to cover every market. We accompany projects where our network, our view and our method add real value.",
        ],
      },
    },
    {
      name: { fr: "Asie", en: "Asia" },
      tagline: { fr: "L'ouverture", en: "An opening" },
      paragraphs: {
        fr: [
          "Notre lien avec l'Asie a commencé à Bali, découvert en 2019 comme un véritable coup de foudre.",
          "Depuis, cette destination est restée dans notre horizon : pour son art de vivre, sa lumière, sa relation à la nature et cette autre manière d'habiter le monde.",
          "De Bali à la Thaïlande, nous sélectionnons des projets cohérents, portés par des partenaires fiables, pour celles et ceux qui cherchent un lieu de vie, une respiration, un projet de retraite ou un investissement choisi.",
          "Notre approche reste la même : comprendre l'intention, vérifier la cohérence du projet et accompagner avec clarté.",
        ],
        en: [
          "Our bond with Asia began in Bali, discovered in 2019 as a genuine coup de cœur.",
          "Since then, this destination has stayed in our horizon: for its art de vivre, its light, its relationship with nature and that other way of inhabiting the world.",
          "From Bali to Thailand, we select coherent projects, carried by reliable partners, for those seeking a place to live, a breath of air, a retirement project or a chosen investment.",
          "Our approach remains the same: understand the intention, verify the coherence of the project and accompany with clarity.",
        ],
      },
    },
  ],
  closing: {
    title: { fr: "Une même exigence", en: "One same standard" },
    body: {
      fr: [
        "Quel que soit le territoire, nous ne cherchons pas à proposer le plus grand nombre de biens.",
        "Nous cherchons les projets justes : ceux qui correspondent à une histoire, un usage, une destination et une manière d'habiter.",
      ],
      en: [
        "Whatever the territory, we do not seek to offer the largest number of properties.",
        "We seek the right projects: those that match a story, a use, a destination and a way of inhabiting.",
      ],
    },
  },
};

const Destinations = () => {
  const { lang } = useLanguage();
  const t = <T extends { fr: string; en: string }>(o: T) => (lang === "fr" ? o.fr : o.en);
  const arr = <T extends { fr: string[]; en: string[] }>(o: T) => (lang === "fr" ? o.fr : o.en);

  return (
    <main>
      <PageHero
        image={heroCollection}
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

      {/* Territories */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 space-y-24 lg:space-y-32">
          {content.territories.map((ter, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
            >
              <div className="md:col-span-4">
                <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">
                  0{i + 1}
                </span>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3">
                  {t(ter.name)}
                </h2>
                <p className="font-display italic text-lg md:text-xl text-primary">
                  {t(ter.tagline)}
                </p>
              </div>
              <div className="md:col-span-8 space-y-4 border-l border-border pl-6 md:pl-10">
                {arr(ter.paragraphs).map((p, j) => (
                  <p
                    key={j}
                    className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12 text-center">
          <div className="line-gold max-w-24 mx-auto mb-10" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-foreground mb-8"
          >
            {t(content.closing.title)}
          </motion.h2>
          <div className="space-y-4">
            {arr(content.closing.body).map((line, i) => (
              <p
                key={i}
                className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Destinations;
