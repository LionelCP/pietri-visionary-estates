import PageHero from "@/components/PageHero";
import heroPhilosophy from "@/assets/hero-philosophy.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Signature = () => {
  const { t } = useLanguage();
  const s = translations.pages.signature;

  return (
    <main>
      <PageHero
        image={heroPhilosophy}
        overline={t(s.overline)}
        title={t(s.title)}
        subtitle={t(s.subtitle)}
        breadcrumbs={[{ label: t(s.overline) }]}
      />

      <section className="py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            {t(s.subtitle)}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signature;
