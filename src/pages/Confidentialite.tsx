import { Link } from "react-router-dom";

const Confidentialite = () => {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 lg:px-12 bg-background">
      <div className="max-w-3xl mx-auto">
        <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-4">
          Mentions
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-10">
          Politique de confidentialité
        </h1>

        <div className="space-y-10 font-body text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Responsable du traitement</h2>
            <p>
              Cabinet Pietri Immobilier est responsable du traitement des données collectées
              sur ce site. Pour toute question relative à vos données personnelles, vous pouvez
              nous écrire à <span className="text-foreground">contact@cabinetpietri.com</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Mesure d'audience anonymisée</h2>
            <p className="mb-4">
              Nous utilisons une mesure d'audience interne, <span className="text-foreground">exemptée
              de consentement</span> selon la recommandation de la CNIL relative aux cookies et
              traceurs (article 82 de la loi Informatique et Libertés).
            </p>
            <p className="mb-4">
              Concrètement&nbsp;:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Aucun cookie n'est déposé sur votre navigateur.</li>
              <li>
                Votre adresse IP est <span className="text-foreground">tronquée immédiatement</span>
                {" "}(le dernier groupe de chiffres est remplacé par zéro) avant tout enregistrement.
                Elle ne permet pas de vous identifier.
              </li>
              <li>
                Nous conservons uniquement&nbsp;: la page visitée, le site d'origine, le type d'appareil,
                le navigateur, le pays approximatif et la durée de visite.
              </li>
              <li>Aucun croisement avec d'autres données, aucun profilage, aucune publicité.</li>
              <li>
                Les statistiques sont conservées <span className="text-foreground">13 mois maximum</span>,
                conformément à la recommandation CNIL, puis supprimées automatiquement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Formulaire de contact</h2>
            <p>
              Lorsque vous nous contactez via le formulaire, les informations que vous nous
              communiquez (nom, email, téléphone, message) sont utilisées uniquement pour
              répondre à votre demande. Elles ne sont jamais transmises à des tiers à des fins
              commerciales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
              d'effacement, d'opposition et de portabilité sur vos données. Pour exercer
              ces droits, écrivez-nous à{" "}
              <span className="text-foreground">contact@cabinetpietri.com</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé sur une infrastructure européenne. Les données collectées
              sont stockées au sein de l'Union européenne.
            </p>
          </section>

          <p className="pt-6">
            <Link to="/" className="text-primary hover:underline">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Confidentialite;
