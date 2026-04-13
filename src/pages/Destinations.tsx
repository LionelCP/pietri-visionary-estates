import SectionHeading from "@/components/SectionHeading";
import DestinationsSection from "@/components/home/DestinationsSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Destinations = () => {
  const { t } = useLanguage();
  const d = translations.pages.destinations;

  return (
    <main className="pt-20">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(d.overline)} title={t(d.title)} subtitle={t(d.subtitle)} />
        </div>
      </section>
      <DestinationsSection />
    </main>
  );
};

export default Destinations;
