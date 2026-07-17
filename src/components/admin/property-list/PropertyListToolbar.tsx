import { Search, X } from "lucide-react";
import type { PropertySortKey, PropertyStatusCounts, PropertyStatusFilter } from "./propertyListState";

type PropertyListToolbarProps = {
  query: string;
  status: PropertyStatusFilter;
  sort: PropertySortKey;
  counts: PropertyStatusCounts;
  resultCount: number;
  totalCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: PropertyStatusFilter) => void;
  onSortChange: (value: PropertySortKey) => void;
  onReset: () => void;
};

const statusOptions: Array<{ value: PropertyStatusFilter; label: string }> = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillons" },
  { value: "published", label: "Publiés" },
  { value: "archived", label: "Archivés" },
];

const sortOptions: Array<{ value: PropertySortKey; label: string }> = [
  { value: "default", label: "Ordre actuel" },
  { value: "newest", label: "Plus récents" },
  { value: "oldest", label: "Plus anciens" },
  { value: "title-asc", label: "Titre A-Z" },
  { value: "title-desc", label: "Titre Z-A" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export function PropertyListToolbar({
  query,
  status,
  sort,
  counts,
  resultCount,
  totalCount,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onReset,
}: PropertyListToolbarProps) {
  return (
    <section className="border border-border p-4 mb-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
        <div>
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Recherche</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Titre, ville, pays, adresse, slug..."
              className="w-full bg-background border border-border pl-10 pr-10 py-3 font-body text-sm text-foreground focus:border-primary outline-none"
            />
            {query && (
              <button type="button" onClick={() => onQueryChange("")} aria-label="Effacer la recherche" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Tri</label>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as PropertySortKey)} className="w-full bg-background border border-border px-3 py-3 font-body text-sm text-foreground focus:border-primary outline-none">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={`font-body text-[11px] tracking-[0.16em] uppercase px-3 py-2 border transition-colors ${
                status === option.value
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {option.label} <span className="tracking-normal">({counts[option.value]})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p className="font-body text-xs text-muted-foreground">{resultCount} / {totalCount} biens</p>
          {(query || status !== "all" || sort !== "default") && (
            <button type="button" onClick={onReset} className="font-body text-[11px] tracking-[0.16em] uppercase text-primary hover:underline">
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
