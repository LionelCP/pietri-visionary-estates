import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/properties";
import { useLanguage } from "@/i18n/LanguageContext";

const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
};

const isDirectVideo = (url: string) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);

interface VideoCardProps {
  title: string;
  url: string;
  poster?: string | null;
}

const VideoCard = ({ title, url, poster }: VideoCardProps) => {
  const [active, setActive] = useState(false);
  const embedUrl = getEmbedUrl(url);
  const direct = isDirectVideo(url);
  const canEmbed = embedUrl || direct;

  if (!canEmbed) {
    // External link only
    return (
      <div className="group">
        <h3 className="font-display text-xl text-foreground mb-4">{title}</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-video overflow-hidden bg-secondary border border-border hover:border-primary transition-colors"
        >
          {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase text-foreground bg-background/80 backdrop-blur-sm border border-border px-5 py-3">
              <ExternalLink size={14} /> Voir la vidéo
            </span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-display text-xl text-foreground mb-4">{title}</h3>
      <div className="relative aspect-video overflow-hidden bg-background border border-border">
        {!active ? (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={`Lancer ${title}`}
          >
            {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                <Play size={22} className="fill-current ml-1" />
              </span>
            </div>
          </button>
        ) : embedUrl ? (
          <iframe
            src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={url} controls autoPlay playsInline className="absolute inset-0 w-full h-full object-contain bg-black" />
        )}
      </div>
    </div>
  );
};

interface VirtualTourCardProps {
  title: string;
  property: Property;
}

const VirtualTourCard = ({ title, property }: VirtualTourCardProps) => {
  const [active, setActive] = useState(false);
  const matterportEmbed = property.matterport_id
    ? `https://my.matterport.com/show/?m=${property.matterport_id}&play=1&qs=1&brand=0&dh=1`
    : null;
  const iframeHtml = property.virtual_tour_iframe?.trim() || null;
  const externalUrl = property.virtual_tour_url?.trim() || null;

  // Priority: Matterport > iframe > external link
  if (matterportEmbed) {
    return (
      <div>
        <h3 className="font-display text-xl text-foreground mb-4">{title}</h3>
        <div className="relative aspect-video overflow-hidden bg-background border border-border">
          {!active ? (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 w-full h-full"
              aria-label="Lancer la visite virtuelle"
            >
              {property.main_image_url && (
                <img src={property.main_image_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase text-foreground bg-background/90 backdrop-blur-sm border border-border px-5 py-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Maximize2 size={14} /> Lancer la visite 360°
                </span>
              </div>
            </button>
          ) : (
            <iframe
              src={matterportEmbed}
              title={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
              allow="fullscreen; vr; xr"
              allowFullScreen
            />
          )}
        </div>
      </div>
    );
  }

  if (iframeHtml) {
    // Inject raw iframe (trusted, admin-provided). Add sandbox + lazy if missing.
    const safeHtml = iframeHtml
      .replace(/<iframe(?![^>]*\bloading=)/i, '<iframe loading="lazy"')
      .replace(/<iframe(?![^>]*\bsandbox=)/i, '<iframe sandbox="allow-scripts allow-same-origin allow-popups allow-forms"');
    return (
      <div>
        <h3 className="font-display text-xl text-foreground mb-4">{title}</h3>
        <div className="relative aspect-video overflow-hidden bg-background border border-border [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0">
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
      </div>
    );
  }

  if (externalUrl) {
    return (
      <div>
        <h3 className="font-display text-xl text-foreground mb-4">{title}</h3>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-video overflow-hidden bg-secondary border border-border hover:border-primary transition-colors"
        >
          {property.main_image_url && (
            <img src={property.main_image_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase text-foreground bg-background/90 backdrop-blur-sm border border-border px-5 py-3">
              <ExternalLink size={14} /> Ouvrir la visite virtuelle
            </span>
          </div>
        </a>
      </div>
    );
  }

  return null;
};

interface Props {
  property: Property;
}

const PropertyMediaSection = ({ property: p }: Props) => {
  const { lang } = useLanguage();
  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  const showVideo = p.show_video !== false;
  const showTour = p.show_virtual_tour !== false;

  // Build video list
  const videos: { title: string; url: string }[] = [];
  if (showVideo) {
    if (p.video_url) videos.push({ title: t("Visite vidéo du bien", "Property video tour"), url: p.video_url });
    if (p.video_file_url && p.video_file_url !== p.video_url) {
      videos.push({ title: videos.length === 0 ? t("Visite vidéo du bien", "Property video tour") : t("Vidéo complémentaire", "Additional video"), url: p.video_file_url });
    }
    if (p.video_url_2) videos.push({ title: t("Vidéo complémentaire", "Additional video"), url: p.video_url_2 });
    if (p.drone_video_url) videos.push({ title: t("Vue aérienne · Drone", "Aerial view · Drone"), url: p.drone_video_url });
  }

  const hasVirtualTour = showTour && (p.matterport_id || p.virtual_tour_iframe || p.virtual_tour_url);

  if (videos.length === 0 && !hasVirtualTour) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-20 lg:py-28 border-t border-border"
      aria-labelledby="media-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 lg:mb-16">
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-3">
            {t("Immersion", "Immersion")}
          </span>
          <h2 id="media-heading" className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.1]">
            {t("Découvrir le bien autrement", "Discover the property differently")}
          </h2>
          <div className="line-gold mt-6 w-16" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {videos.map((v, i) => (
            <VideoCard key={`${v.url}-${i}`} title={v.title} url={v.url} poster={p.main_image_url} />
          ))}
          {hasVirtualTour && (
            <VirtualTourCard title={t("Visite virtuelle du bien", "Virtual tour")} property={p} />
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default PropertyMediaSection;
