import type { PublicationStatus } from "@/lib/properties";

const STATUS_LABELS: Record<PublicationStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

const STATUS_CLASSES: Record<PublicationStatus, string> = {
  draft: "border-border text-muted-foreground bg-secondary/40",
  published: "border-primary/40 text-primary bg-primary/5",
  archived: "border-destructive/30 text-destructive bg-destructive/5",
};

type PropertyStatusBadgeProps = {
  status: PublicationStatus | string | null | undefined;
};

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  if (status === "draft" || status === "published" || status === "archived") {
    return (
      <span className={`inline-flex border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] ${STATUS_CLASSES[status]}`} aria-label={`Statut : ${STATUS_LABELS[status]}`}>
        {STATUS_LABELS[status]}
      </span>
    );
  }

  return (
    <span className="inline-flex border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground" aria-label="Statut : inconnu">
      Inconnu
    </span>
  );
}
