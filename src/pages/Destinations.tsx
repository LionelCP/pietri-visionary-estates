import SectionHeading from "@/components/SectionHeading";
import DestinationsSection from "@/components/home/DestinationsSection";

const Destinations = () => (
  <main className="pt-20">
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="Destinations"
          title="Nos Territoires"
          subtitle="De la France aux destinations internationales les plus prisées."
        />
      </div>
    </section>
    <DestinationsSection />
  </main>
);

export default Destinations;
