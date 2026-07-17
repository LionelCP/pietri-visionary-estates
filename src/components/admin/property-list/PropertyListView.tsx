import { formatPrice, getPropertyReference, type Property } from "@/lib/properties";
import { PropertyRowActions } from "./PropertyRowActions";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { getPropertyDisplayTitle, getPropertyLocation } from "./propertyListState";

type PropertyListViewProps = {
  properties: Property[];
  mutatingId: string | null;
  onEdit: (id: string) => void;
  onReload: () => void;
  onMutationStart: (id: string) => void;
  onMutationEnd: () => void;
  onFeaturedChange: (id: string, value: boolean) => void;
  onDisplayOrderChange: (id: string, value: number, currentValue: number) => void;
};

export function PropertyListView({
  properties,
  mutatingId,
  onEdit,
  onReload,
  onMutationStart,
  onMutationEnd,
  onFeaturedChange,
  onDisplayOrderChange,
}: PropertyListViewProps) {
  return (
    <>
      <div className="hidden lg:block border border-border overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead className="bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ordre</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Titre</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Localisation</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Prix</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Publication</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Accueil</th>
              <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} onClick={() => onEdit(property.id)} tabIndex={0} className="border-t border-border cursor-pointer hover:bg-secondary/30 focus:bg-secondary/30 outline-none">
                <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="number"
                    defaultValue={property.display_order}
                    onBlur={(event) => onDisplayOrderChange(property.id, Number(event.target.value), property.display_order)}
                    className="w-16 bg-background border border-border px-2 py-1 text-sm"
                    aria-label={`Ordre d'affichage ${getPropertyDisplayTitle(property)}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-display text-base text-foreground">{getPropertyDisplayTitle(property)}</div>
                  <div className="text-xs text-muted-foreground">{getPropertyReference(property) ?? property.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{getPropertyLocation(property) || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatPrice(property, "fr")}</td>
                <td className="px-4 py-3"><PropertyStatusBadge status={property.publication_status} /></td>
                <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={property.featured}
                    onChange={(event) => onFeaturedChange(property.id, event.target.checked)}
                    className="accent-primary"
                    aria-label={`Afficher ${getPropertyDisplayTitle(property)} en page d'accueil`}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PropertyRowActions
                    property={property}
                    disabled={mutatingId === property.id}
                    onChanged={onReload}
                    onMutationStart={onMutationStart}
                    onMutationEnd={onMutationEnd}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {properties.map((property) => (
          <article key={property.id} onClick={() => onEdit(property.id)} tabIndex={0} className="border border-border p-4 cursor-pointer hover:border-primary focus:border-primary outline-none">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-display text-xl text-foreground">{getPropertyDisplayTitle(property)}</h2>
                <p className="font-body text-xs text-muted-foreground mt-1">{getPropertyReference(property) ?? property.slug}</p>
              </div>
              <PropertyStatusBadge status={property.publication_status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 font-body text-sm mb-4">
              <div>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Localisation</dt>
                <dd className="text-foreground">{getPropertyLocation(property) || "-"}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Prix</dt>
                <dd className="text-foreground">{formatPrice(property, "fr")}</dd>
              </div>
              <div onClick={(event) => event.stopPropagation()}>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ordre</dt>
                <dd><input type="number" defaultValue={property.display_order} onBlur={(event) => onDisplayOrderChange(property.id, Number(event.target.value), property.display_order)} className="w-20 bg-background border border-border px-2 py-1 text-sm" /></dd>
              </div>
              <div onClick={(event) => event.stopPropagation()}>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Accueil</dt>
                <dd><input type="checkbox" checked={property.featured} onChange={(event) => onFeaturedChange(property.id, event.target.checked)} className="accent-primary" /></dd>
              </div>
            </dl>
            <PropertyRowActions
              property={property}
              disabled={mutatingId === property.id}
              onChanged={onReload}
              onMutationStart={onMutationStart}
              onMutationEnd={onMutationEnd}
            />
          </article>
        ))}
      </div>
    </>
  );
}
