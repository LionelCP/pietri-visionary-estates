import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import StatusBadge from "@/components/StatusBadge";
import PropertyMediaSection from "@/components/PropertyMediaSection";
import {
  fetchPropertyBySlug,
  formatLocation,
  formatPrice,
  getPropertyDescription,
  getPropertyReference,
  getPropertySeoDescription,
  getPropertySeoTitle,
  getPropertyTitle,
  type Property,
} from "@/lib/properties";
import { useLanguage } from "@/i18n/LanguageContext";
import placeholder from "@/assets/hero-collection.jpg";

const getEmbedUrl = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
};

const BienDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const [p, setP] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchPropertyBySlug(slug)
      .then((data) => { setP(data); setActiveImage(data?.main_image_url ?? null); })
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center"><p className="font-body text-sm text-muted-foreground">{t("Chargement…", "Loading…")}</p></main>;
  }

  if (!p) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t("Bien introuvable", "Property not found")}</h1>
        <Link to="/biens" className="font-body text-xs tracking-[0.2em] uppercase text-primary">{t("Voir tous les biens", "View all properties")}</Link>
      </main>
    );
  }

  const title = getPropertyTitle(p, lang);
  const location = formatLocation(p);
  const price = formatPrice(p, lang);
  const desc = getPropertyDescription(p, lang);
  const shortDesc = lang === "fr" ? (p.short_description ?? p.description_fr) : (p.short_description_en ?? p.description_en ?? p.short_description ?? p.description_fr);
  const mainImage = activeImage || p.main_image_url || placeholder;
  const allImages = [p.main_image_url, ...p.gallery.map((g) => g.url)].filter(Boolean) as string[];

  const seoTitle = getPropertySeoTitle(p, lang) || `${title}${location ? ` — ${location}` : ""} | Cabinet Pietri Immobilier`;
  const seoDesc = getPropertySeoDescription(p, lang) || shortDesc || `${title}${location ? ` à ${location}` : ""} — Cabinet Pietri Immobilier.`;
  const canonical = `https://cabinet-pietri-immobilier.com/biens/${p.slug}`;

  // Contextual CTA per status
  const ctaPrefill = encodeURIComponent(t(`Demande d'information — ${title}${location ? ` (${location})` : ""}`, `Information request — ${title}${location ? ` (${location})` : ""}`));
  let ctaLabel = t("Demander plus d'informations", "Request more information");
  const ctaHref = `/contact?bien=${encodeURIComponent(p.slug)}&sujet=${ctaPrefill}`;
  let statusNote: string | null = null;
  if (p.status === "sous_offre") {
    ctaLabel = t("Être alerté si le bien redevient disponible", "Be notified if this property becomes available again");
    statusNote = t("Ce bien est actuellement sous offre.", "This property is currently under offer.");
  } else if (p.status === "vendu") {
    ctaLabel = t("Nous consulter pour un bien similaire", "Contact us for a similar property");
    statusNote = t("Ce bien a été vendu. Nous pouvons vous accompagner sur un projet équivalent.", "This property has been sold. We can guide you on a similar project.");
  } else if (p.status === "reserve") {
    ctaLabel = t("Nous contacter", "Contact us");
    statusNote = t("Ce bien est réservé.", "This property is reserved.");
  }

  const features: { label: string; value: string | number }[] = [];
  if (p.area_m2) features.push({ label: t("Surface", "Area"), value: `${p.area_m2} m²` });
  if (p.rooms) features.push({ label: t("Pièces", "Rooms"), value: p.rooms });
  if (p.bedrooms) features.push({ label: t("Chambres", "Bedrooms"), value: p.bedrooms });
  if (p.bathrooms) features.push({ label: t("Salles de bain", "Bathrooms"), value: p.bathrooms });
  if (p.floor) features.push({ label: t("Étage", "Floor"), value: p.floor });
  if (p.energy_class) features.push({ label: t("Classe énergie", "Energy class"), value: p.energy_class });

  const attributes: string[] = [];
  if (p.has_sea_view) attributes.push(t("Vue mer", "Sea view"));
  if (p.has_mountain_view) attributes.push(t("Vue montagne", "Mountain view"));
  if (p.has_open_view) attributes.push(t("Vue dégagée", "Open view"));
  if (p.has_terrace) attributes.push(t("Terrasse", "Terrace"));
  if (p.has_garden) attributes.push(t("Jardin", "Garden"));
  if (p.has_balcony) attributes.push(t("Balcon", "Balcony"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description: seoDesc,
    url: canonical,
    image: mainImage,
    address: location || undefined,
    ...(p.price_amount && !p.price_on_request ? { offers: { "@type": "Offer", price: p.price_amount, priceCurrency: "EUR" } } : {}),
  };

  return (
    <main>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {mainImage && <meta property="og:image" content={mainImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {p.hero_video_url && (
        <section className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden bg-background">
          <video
            src={p.hero_video_url}
            autoPlay
            muted
            loop
            playsInline
            poster={p.main_image_url ?? undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          <div className="absolute bottom-10 left-0 right-0 max-w-[1400px] mx-auto px-6 lg:px-12">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">{location}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05]">{title}</h1>
          </div>
        </section>
      )}

      <section className={p.hero_video_url ? "pb-12 pt-12" : "pt-32 pb-12 lg:pt-40"}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Link to="/biens" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> {t("Retour aux biens", "Back to properties")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={`${title}${location ? " — " + location : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4"><StatusBadge status={p.status} /></div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  {p.matterport_id && (
                    <button onClick={() => setTourOpen(true)} className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-2 font-body text-[10px] tracking-[0.15em] uppercase text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <Play size={12} className="fill-current" /> {t("Visite 3D", "3D Tour")}
                    </button>
                  )}
                  {(p.video_url || p.video_file_url) && (
                    <button onClick={() => setVideoOpen(true)} className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-2 font-body text-[10px] tracking-[0.15em] uppercase text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <Play size={12} className="fill-current" /> {t("Vidéo", "Video")}
                    </button>
                  )}
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((url) => (
                    <button key={url} onClick={() => setActiveImage(url)} className={`aspect-[4/3] overflow-hidden border ${activeImage === url ? "border-primary" : "border-transparent"} transition-colors`}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Infos */}
            <div>
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">{location || t("Localisation à préciser", "Location to be confirmed")}</span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.1] mb-4">{title}</h1>
              <p className="font-display text-2xl text-primary mb-6">{price}</p>

              {statusNote && (
                <p className="font-body text-sm text-muted-foreground italic mb-6 border-l border-primary/40 pl-4">{statusNote}</p>
              )}

              {shortDesc && <p className="font-body text-base text-foreground/90 leading-relaxed mb-8">{shortDesc}</p>}

              {features.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 border-y border-border mb-8">
                  {features.map((f) => (
                    <div key={f.label}>
                      <dt className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">{f.label}</dt>
                      <dd className="font-display text-lg text-foreground">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {attributes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {attributes.map((a) => (
                    <span key={a} className="font-body text-[10px] tracking-[0.2em] uppercase border border-border px-3 py-1.5 text-foreground/80">{a}</span>
                  ))}
                </div>
              )}

              <a href={ctaHref} className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors">
                {ctaLabel}
              </a>

              {getPropertyReference(p) && (
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-6">{t("Réf.", "Ref.")} {getPropertyReference(p)}</p>
              )}
            </div>
          </div>

          {/* Long description + highlights */}
          {(desc || p.highlights.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20 lg:mt-28">
              {desc && (
                <div className="lg:col-span-2">
                  <h2 className="font-display text-2xl text-foreground mb-6">{t("Description", "Description")}</h2>
                  <div className="font-body text-base text-foreground/90 leading-relaxed whitespace-pre-line">{desc}</div>
                </div>
              )}
              {p.highlights.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-foreground mb-6">{t("Points forts", "Highlights")}</h2>
                  <ul className="space-y-3">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="font-body text-sm text-foreground/90 leading-relaxed pl-4 border-l border-primary/40">{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <PropertyMediaSection property={p} />



      {p.matterport_id && (
        <VirtualTourViewer matterportId={p.matterport_id} title={title} isOpen={tourOpen} onClose={() => setTourOpen(false)} />
      )}

      {videoOpen && (p.video_url || p.video_file_url) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-6" onClick={() => setVideoOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoOpen(false)} aria-label="Fermer" className="absolute -top-10 right-0 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:text-primary">
              {t("Fermer", "Close")} ✕
            </button>
            {p.video_url && getEmbedUrl(p.video_url) ? (
              <iframe src={getEmbedUrl(p.video_url)!} title={title} className="w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            ) : p.video_file_url ? (
              <video src={p.video_file_url} controls autoPlay className="w-full h-full object-contain bg-black" />
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
};

export default BienDetail;
