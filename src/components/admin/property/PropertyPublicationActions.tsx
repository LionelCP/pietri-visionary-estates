import { archiveProperty, publishProperty, unpublishProperty, validatePropertyForPublication, type Property, type PublicationStatus } from "@/lib/properties";
import { toast } from "@/hooks/use-toast";
import { formatPublicationStatus } from "./propertyFormState";
import { useState } from "react";

type PropertyPublicationActionsProps = {
  propertyId: string | undefined;
  status: PublicationStatus;
  disabled?: boolean;
  onStatusChanged: (property: Property) => void;
};

type ActionName = "publish" | "unpublish" | "archive";

export function PropertyPublicationActions({ propertyId, status, disabled = false, onStatusChanged }: PropertyPublicationActionsProps) {
  const [runningAction, setRunningAction] = useState<ActionName | null>(null);
  const unavailable = disabled || !propertyId || runningAction !== null;

  const runAction = async (action: ActionName) => {
    if (!propertyId) return;
    setRunningAction(action);

    try {
      if (action === "publish") {
        const validation = await validatePropertyForPublication(propertyId);
        if (validation.error) {
          toast({ title: "Publication impossible", description: validation.error, variant: "destructive" });
          return;
        }
        if (validation.data && validation.data.length > 0) {
          toast({ title: "Publication impossible", description: validation.data.join("\n"), variant: "destructive" });
          return;
        }
      }

      const result =
        action === "publish"
          ? await publishProperty(propertyId)
          : action === "unpublish"
            ? await unpublishProperty(propertyId)
            : await archiveProperty(propertyId);

      if (result.error || !result.data) {
        toast({ title: "Action impossible", description: result.error ?? "Aucune donnée retournée.", variant: "destructive" });
        return;
      }

      onStatusChanged(result.data);
      toast({ title: getSuccessTitle(action) });
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Statut éditorial</p>
        <p className="font-display text-2xl text-foreground mt-1">{formatPublicationStatus(status)}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {status !== "published" && status !== "archived" && (
          <button type="button" disabled={unavailable} onClick={() => void runAction("publish")} className="font-body text-xs tracking-[0.2em] uppercase px-5 py-3 border border-border hover:border-primary disabled:opacity-50">
            Publier
          </button>
        )}
        {status === "published" && (
          <button type="button" disabled={unavailable} onClick={() => void runAction("unpublish")} className="font-body text-xs tracking-[0.2em] uppercase px-5 py-3 border border-border hover:border-primary disabled:opacity-50">
            Dépublier
          </button>
        )}
        {status !== "archived" && (
          <button type="button" disabled={unavailable} onClick={() => void runAction("archive")} className="font-body text-xs tracking-[0.2em] uppercase px-5 py-3 border border-border text-destructive hover:border-destructive disabled:opacity-50">
            Archiver
          </button>
        )}
      </div>
      {!propertyId && (
        <p className="text-xs text-muted-foreground">Enregistrez le bien avant d'utiliser les actions de publication.</p>
      )}
    </section>
  );
}

function getSuccessTitle(action: ActionName) {
  if (action === "publish") return "Bien publié";
  if (action === "unpublish") return "Bien dépublié";
  return "Bien archivé";
}
