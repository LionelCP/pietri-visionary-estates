import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Signature = () => {
  const { t } = useLanguage();
  const s = translations.pages.signature;

  return (
    <main className="pt-20">
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading overline={t(s.overline)} title={t(s.title)} subtitle={t(s.subtitle)} />
        </div>
      </section>
    </main>
  );
};

export default Signature;
