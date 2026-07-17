import type { PropertyRegion, PropertyType, TransactionType } from "@/lib/properties";
import { inputCls, labelCls } from "./formStyles";
import type { PropertyFormSet, PropertyFormState } from "./propertyFormState";
import { formatPublicationStatus, slugifyProperty } from "./propertyFormState";

type PropertyFormIdentityProps = {
  form: PropertyFormState;
  onChange: PropertyFormSet;
};

export function PropertyFormIdentity({ form, onChange }: PropertyFormIdentityProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Identité</h2>
      <div>
        <label className={labelCls}>Titre FR *</label>
        <input
          required
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          onBlur={() => {
            if (!form.slug) onChange("slug", slugifyProperty(`${form.title}-${form.city}`));
          }}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Titre EN</label>
        <input value={form.title_en} onChange={(e) => onChange("title_en", e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Slug URL (auto si vide)</label>
        <input
          value={form.slug}
          onChange={(e) => onChange("slug", slugifyProperty(e.target.value))}
          placeholder="villa-vue-mer-monticello"
          className={inputCls}
        />
        <p className="text-xs text-muted-foreground mt-1">/biens/{form.slug || "..."}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Publication</label>
          <input value={formatPublicationStatus(form.publication_status)} disabled className={`${inputCls} opacity-70`} />
          <p className="text-xs text-muted-foreground mt-1">La publication se fait avec les actions dédiées.</p>
        </div>
        <div>
          <label className={labelCls}>Type de bien</label>
          <select value={form.property_type} onChange={(e) => onChange("property_type", e.target.value as PropertyType)} className={inputCls}>
            <option value="">-</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="local_commercial">Local commercial</option>
            <option value="programme">Programme immobilier</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Référence *</label>
          <input value={form.internal_ref} onChange={(e) => onChange("internal_ref", e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Transaction *</label>
        <select value={form.transaction_type} onChange={(e) => onChange("transaction_type", e.target.value as TransactionType)} className={inputCls}>
          <option value="">-</option>
          <option value="sale">Vente</option>
          <option value="rent">Location</option>
          <option value="seasonal_rent">Location saisonnière</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Région</label>
          <select value={form.region} onChange={(e) => onChange("region", e.target.value as PropertyRegion)} className={inputCls}>
            <option value="">-</option>
            <option value="corse">Corse</option>
            <option value="continent">Continent</option>
            <option value="monaco">Monaco</option>
            <option value="bali">Bali</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Ville</label>
          <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Pays</label>
          <input value={form.country} onChange={(e) => onChange("country", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Secteur / quartier</label>
          <input value={form.sector} onChange={(e) => onChange("sector", e.target.value)} className={inputCls} />
        </div>
      </div>
    </section>
  );
}
