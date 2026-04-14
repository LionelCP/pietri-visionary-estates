import PageHero from "@/components/PageHero";
import DestinationsSection from "@/components/home/DestinationsSection";
import heroCollection from "@/assets/hero-collection.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Destinations = () => {
  const { t } = useLanguage();
  const d = translations.pages.destinations;

  return (
    <main>
      <PageHero
        image={heroCollection}
        overline={t(d.overline)}
        title={t(d.title)}
        subtitle={t(d.subtitle)}
        breadcrumbs={[{ label: t(d.overline) }]}
      />
      <DestinationsSection />
    </main>
  );
};

export default Destinations;
