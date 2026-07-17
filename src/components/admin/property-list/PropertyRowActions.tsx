import { Archive, Edit, Eye, Send, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";
import { archiveProperty, publishProperty, unpublishProperty, type Property } from "@/lib/properties";
import { toast } from "@/hooks/use-toast";

type PropertyRowActionsProps = {
  property: Property;
  disabled?: boolean;
  onMutationStart?: (id: string) => void;
  onMutationEnd?: () => void;
  onChanged: () => void;
};

export function PropertyRowActions({ property, disabled = false, onMutationStart, onMutationEnd, onChanged }: PropertyRowActionsProps) {
  const runAction = async (event: React.MouseEvent, action: "publish" | "unpublish" | "archive") => {
    event.stopPropagation();

    if (action === "archive" && !window.confirm("Archiver ce bien ?")) return;

    onMutationStart?.(property.id);
    try {
      const result =
        action === "publish"
          ? await publishProperty(property.id)
          : action === "unpublish"
            ? await unpublishProperty(property.id)
            : await archiveProperty(property.id);

      if (result.error) {
        toast({ title: "Action impossible", description: result.error, variant: "destructive" });
        return;
      }

      toast({ title: getSuccessTitle(action) });
      onChanged();
    } finally {
      onMutationEnd?.();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
      <Link to={`/admin/biens/${property.id}/edit`} className="inline-flex items-center gap-1 font-body text-[11px] tracking-[0.15em] uppercase text-primary hover:underline">
        <Edit size={13} /> Modifier
      </Link>
      {property.publication_status === "published" && (
        <>
          <Link to={`/biens/${property.slug}`} target="_blank" className="inline-flex items-center gap-1 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground">
            <Eye size={13} /> Voir
          </Link>
          <button type="button" disabled={disabled} onClick={(event) => void runAction(event, "unpublish")} className="inline-flex items-center gap-1 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground disabled:opacity-50">
            <Undo2 size={13} /> Dépublier
          </button>
        </>
      )}
      {property.publication_status === "draft" && (
        <button type="button" disabled={disabled} onClick={(event) => void runAction(event, "publish")} className="inline-flex items-center gap-1 font-body text-[11px] tracking-[0.15em] uppercase text-primary hover:underline disabled:opacity-50">
          <Send size={13} /> Publier
        </button>
      )}
      {property.publication_status !== "archived" && (
        <button type="button" disabled={disabled} onClick={(event) => void runAction(event, "archive")} className="inline-flex items-center gap-1 font-body text-[11px] tracking-[0.15em] uppercase text-destructive hover:underline disabled:opacity-50">
          <Archive size={13} /> Archiver
        </button>
      )}
    </div>
  );
}

function getSuccessTitle(action: "publish" | "unpublish" | "archive") {
  if (action === "publish") return "Bien publié";
  if (action === "unpublish") return "Bien repassé en brouillon";
  return "Bien archivé";
}
