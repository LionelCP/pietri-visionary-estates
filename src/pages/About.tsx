import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import heroAbout from "@/assets/hero-about.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
  overline: { fr: "Notre histoire", en: "Our story" },
  title: { fr: "Trouver sa place.", en: "Finding one's place." },
  subtitle: {
    fr: "De la Corse au continent, de Londres à Bali — un parcours, deux regards, une vocation.",
    en: "From Corsica to the mainland, from London to Bali — one journey, two perspectives, one vocation.",
  },

  // Intro
  introTitle: { fr: "Avant le cabinet, le mouvement", en: "Before the firm, movement" },
  intro: {
    fr: [
      "Avant de créer le Cabinet Pietri, nous avons passé une grande partie de notre vie à déménager.",
      "Entre la Corse, la Bretagne, Paris, Strasbourg, Aix-en-Provence, Rennes, Grenoble, la Haute-Savoie, Londres, Chicago, Miami et d'autres horizons, nous avons connu plus de dix-sept déménagements en une vingtaine d'années.",
      "À chaque départ, il fallait laisser un lieu derrière soi.",
      "À chaque arrivée, reconstruire des repères.",
      "Retrouver une école, un quartier, une lumière, un rythme, une manière d'habiter.",
      "Cette expérience a profondément changé notre regard sur l'immobilier.",
      "Avec le temps, nous avons compris qu'une maison n'est jamais simplement un bien. C'est un refuge, un point d'ancrage, un lieu où l'on construit ses souvenirs, où l'on retrouve ceux que l'on aime, où l'on transmet quelque chose de soi.",
    ],
    en: [
      "Before founding Cabinet Pietri, we spent much of our lives moving.",
      "Between Corsica, Brittany, Paris, Strasbourg, Aix-en-Provence, Rennes, Grenoble, Haute-Savoie, London, Chicago, Miami and other horizons, we made more than seventeen moves in roughly twenty years.",
      "Each departure meant leaving a place behind.",
      "Each arrival meant rebuilding bearings.",
      "Finding a school, a neighbourhood, a quality of light, a pace, a way of inhabiting.",
      "This experience profoundly changed the way we look at real estate.",
      "Over time, we came to understand that a home is never simply a property. It is a refuge, an anchor, a place where memories are built, where we are reunited with those we love, where we pass something of ourselves on.",
    ],
  },

  sections: [
    {
      title: { fr: "Une entreprise familiale", en: "A family business" },
      lead: {
        fr: "Cabinet Pietri est avant tout une entreprise familiale.",
        en: "Cabinet Pietri is, above all, a family business.",
      },
      paragraphs: {
        fr: [
          "Fondé par Lionel et Christelle Pietri, le cabinet réunit deux regards complémentaires.",
          "Lionel Pietri est expert immobilier, formé à l'évaluation, à la lecture technique des biens et à l'analyse de leur valeur. Son parcours d'ingénieur, son expérience dans la finance et sa pratique de terrain apportent au cabinet une exigence de précision, de méthode et de discernement.",
          "Christelle Pietri est agent immobilier depuis plus de quinze ans. Diplômée en sciences sociales et humaines, ancienne assistante sociale, elle apporte une lecture sensible des situations, des familles, des transitions de vie et des projets personnels.",
          "Ensemble, nous avons construit une approche qui associe la rigueur du regard technique et la justesse de l'accompagnement humain.",
        ],
        en: [
          "Founded by Lionel and Christelle Pietri, the firm brings together two complementary perspectives.",
          "Lionel Pietri is a real estate expert trained in valuation, technical reading of properties and analysis of their value. His background as an engineer, his experience in finance and his field practice bring the firm a demand for precision, method and discernment.",
          "Christelle Pietri has been an estate agent for more than fifteen years. A graduate in social and human sciences and a former social worker, she brings a sensitive reading of situations, families, life transitions and personal projects.",
          "Together, we have built an approach that combines the rigour of a technical eye with the rightness of human accompaniment.",
        ],
      },
    },
    {
      title: { fr: "Pourquoi la Corse", en: "Why Corsica" },
      lead: {
        fr: "Lionel est corse. Christelle est bretonne.",
        en: "Lionel is Corsican. Christelle is from Brittany.",
      },
      paragraphs: {
        fr: [
          "Après plusieurs années vécues en France, au Royaume-Uni et aux États-Unis, la Corse s'est imposée comme un retour à l'essentiel : une terre d'ancrage, de famille, de lumière et de transmission.",
          "Revenir en Corse, ce n'était pas seulement changer d'adresse. C'était choisir un territoire, un rythme, une manière de vivre.",
          "La Corse est notre terre de cœur. Nous y accompagnons des projets avec une attention particulière à l'histoire des lieux, aux familles, aux villages, aux biens transmis, aux maisons que l'on garde, que l'on vend parfois, que l'on cherche souvent à préserver dans leur esprit.",
          "Ici, l'immobilier ne peut pas être abordé comme un simple marché. Il demande du respect, de la mesure et une vraie connaissance du territoire.",
        ],
        en: [
          "After several years living in France, the United Kingdom and the United States, Corsica imposed itself as a return to the essential: a land of roots, family, light and transmission.",
          "Returning to Corsica was not simply a change of address. It was choosing a territory, a pace, a way of living.",
          "Corsica is our home ground. We accompany projects there with particular attention to the history of places, to families, to villages, to inherited properties — homes that are kept, sometimes sold, and most often preserved in spirit.",
          "Here, real estate cannot be approached as a mere market. It calls for respect, measure and a genuine knowledge of the territory.",
        ],
      },
    },
    {
      title: { fr: "Pourquoi le continent", en: "Why the mainland" },
      lead: {
        fr: "Notre histoire ne s'est pas construite uniquement en Corse.",
        en: "Our story was not built in Corsica alone.",
      },
      paragraphs: {
        fr: [
          "Ensemble ou séparément, nous avons vécu, étudié et travaillé dans plusieurs régions françaises : Paris et la région parisienne, Strasbourg, Aix-en-Provence, Rennes, la Haute-Savoie, Grenoble.",
          "Ces années de mobilité nous ont donné une compréhension concrète des changements de vie : quitter une ville, s'installer ailleurs, recommencer, chercher un nouvel équilibre, trouver un lieu où se sentir enfin à sa place.",
          "Elles ont aussi construit un réseau de clients, de relations et de partenaires au-delà de la Corse.",
          "Aujourd'hui, nous accompagnons des projets sur le continent lorsque le bien, le client ou l'opportunité s'inscrit dans notre approche : une sélection attentive, une relation de confiance et un accompagnement sur mesure.",
          "Le continent fait partie de notre histoire, de notre réseau et de notre manière de travailler.",
        ],
        en: [
          "Together or separately, we have lived, studied and worked in several French regions: Paris and the Paris area, Strasbourg, Aix-en-Provence, Rennes, Haute-Savoie, Grenoble.",
          "These years of mobility gave us a concrete understanding of life changes: leaving a city, settling elsewhere, starting again, seeking a new balance, finding a place where one finally feels at home.",
          "They also built a network of clients, relationships and partners beyond Corsica.",
          "Today we accompany projects on the mainland whenever the property, the client or the opportunity fits our approach: an attentive selection, a relationship of trust and tailored support.",
          "The mainland is part of our history, our network and our way of working.",
        ],
      },
    },
    {
      title: { fr: "Pourquoi l'Asie", en: "Why Asia" },
      lead: {
        fr: "L'Asie est entrée dans notre histoire par Bali.",
        en: "Asia entered our story through Bali.",
      },
      paragraphs: {
        fr: [
          "Nous avons découvert l'île en 2019, presque par hasard, et ce fut un véritable coup de foudre.",
          "La lumière, la nature, les temples, l'art de vivre, la douceur des relations, cette manière différente d'habiter le monde : quelque chose nous a profondément touchés.",
          "Nous nous étions alors promis d'y revenir. Peut-être même, un jour, d'y vivre.",
          "Aujourd'hui, ce lien se prolonge naturellement dans notre activité. Nous retournons à Bali, nous explorons aussi d'autres destinations comme la Thaïlande, et nous sélectionnons des projets qui correspondent à cette vision : des lieux tournés vers l'équilibre, la beauté, la nature et une autre manière de vivre.",
          "L'Asie n'est pas pour nous une simple destination immobilière. C'est une ouverture vers un autre rapport au lieu, au temps et à la qualité de vie.",
          "Notre rôle reste le même : écouter, vérifier, orienter et accompagner avec clarté celles et ceux qui cherchent un lieu de vie, une respiration, un projet de retraite, un investissement choisi ou un nouveau chapitre à écrire.",
        ],
        en: [
          "We discovered the island in 2019, almost by chance, and it was a true coup de cœur.",
          "The light, the nature, the temples, the art of living, the gentleness of relationships, that other way of inhabiting the world: something moved us deeply.",
          "We promised ourselves we would return. Perhaps even, one day, live there.",
          "Today this bond extends naturally into our work. We return to Bali, we also explore other destinations such as Thailand, and we select projects that match this vision: places oriented toward balance, beauty, nature and a different way of living.",
          "Asia is not, for us, merely a real estate destination. It is an opening onto another relationship to place, time and quality of life.",
          "Our role remains the same: listen, verify, guide and accompany with clarity those seeking a place to live, a breath of air, a retirement project, a chosen investment or a new chapter to write.",
        ],
      },
    },
    {
      title: { fr: "Une autre manière d'accompagner", en: "A different way of accompanying" },
      lead: {
        fr: "Nous ne croyons pas aux transactions impersonnelles.",
        en: "We do not believe in impersonal transactions.",
      },
      paragraphs: {
        fr: [
          "Vendre un bien, acheter une maison, chercher un appartement, transmettre un lieu familial ou préparer un nouveau départ sont des moments qui engagent bien plus qu'un prix.",
          "Il y a des souvenirs, des attentes, des hésitations, parfois des tensions, souvent beaucoup d'espoir.",
          "Notre rôle est d'accompagner ces moments avec justesse : écouter avant de proposer, conseiller sans imposer, valoriser sans dénaturer, négocier sans perdre le sens de la relation.",
        ],
        en: [
          "Selling a property, buying a home, searching for an apartment, passing on a family place or preparing a new beginning are moments that engage far more than a price.",
          "There are memories, expectations, hesitations, sometimes tensions, often much hope.",
          "Our role is to accompany these moments with rightness: listen before proposing, advise without imposing, enhance without distorting, negotiate without losing sight of the relationship.",
        ],
      },
    },
    {
      title: { fr: "Des lieux et des histoires", en: "Places and stories" },
      lead: {
        fr: "Aujourd'hui, Cabinet Pietri Immobilier accompagne des projets en Corse, sur le continent et en Asie.",
        en: "Today, Cabinet Pietri Immobilier accompanies projects in Corsica, on the mainland and in Asia.",
      },
      paragraphs: {
        fr: [
          "Mais quel que soit le territoire, notre exigence reste la même : sélectionner des lieux cohérents, comprendre les histoires qu'ils portent et faciliter la rencontre entre un bien et les personnes qui sauront lui donner une suite.",
        ],
        en: [
          "But whatever the territory, our standard remains the same: select coherent places, understand the stories they carry and make possible the encounter between a property and the people who will give it a future.",
        ],
      },
    },
  ],

  closing: {
    quote: {
      fr: [
        "Nous sommes convaincus que certains lieux nous choisissent autant que nous les choisissons.",
        "Notre métier est d'accompagner des projets immobiliers.",
        "Notre vocation est d'accompagner des projets de vie.",
      ],
      en: [
        "We are convinced that some places choose us as much as we choose them.",
        "Our profession is to accompany real estate projects.",
        "Our vocation is to accompany life projects.",
      ],
    },
    cta: { fr: "Échanger avec nous", en: "Talk with us" },
  },
};

const Divider = () => <div className="line-gold max-w-24 mx-auto my-16 lg:my-20" />;

const About = () => {
  const { lang } = useLanguage();
  const t = <T extends { fr: string; en: string }>(o: T) => (lang === "fr" ? o.fr : o.en);
  const arr = <T extends { fr: string[]; en: string[] }>(o: T) => (lang === "fr" ? o.fr : o.en);

  return (
    <main>
      <PageHero
        image={heroAbout}
        overline={t(content.overline)}
        title={t(content.title)}
        subtitle={t(content.subtitle)}
        breadcrumbs={[{ label: t(content.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
              {t(content.introTitle)}
            </h2>
            <div className="space-y-4">
              {arr(content.intro).map((p, i) => (
                <p
                  key={i}
                  className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {content.sections.map((s, i) => (
            <div key={i}>
              <Divider />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                  {t(s.title)}
                </h2>
                <p className="font-body text-lg md:text-xl text-foreground italic mb-6">
                  {t(s.lead)}
                </p>
                <div className="space-y-4">
                  {arr(s.paragraphs).map((p, j) => (
                    <p
                      key={j}
                      className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}

          {/* Closing */}
          <Divider />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="space-y-4 mb-10">
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
              to="/contact"
              className="inline-flex items-center font-body text-xs tracking-[0.3em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors"
            >
              {t(content.closing.cta)}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
