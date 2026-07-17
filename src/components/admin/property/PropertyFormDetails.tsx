import { checkCls, inputCls, labelCls } from "./formStyles";
import type { PropertyFormSet, PropertyFormState } from "./propertyFormState";

type PropertyFormDetailsProps = {
  form: PropertyFormState;
  onChange: PropertyFormSet;
};

const featureFields = [
  ["has_terrace", "Terrasse"],
  ["has_garden", "Jardin"],
  ["has_balcony", "Balcon"],
  ["has_sea_view", "Vue mer"],
  ["has_mountain_view", "Vue montagne"],
  ["has_open_view", "Vue dégagée"],
] as const;

export function PropertyFormDetails({ form, onChange }: PropertyFormDetailsProps) {
  return (
    <>
      <section className="space-y-5">
        <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Prix</h2>
        <label className={checkCls}>
          <input type="checkbox" checked={form.price_on_request} onChange={(e) => onChange("price_on_request", e.target.checked)} className="accent-primary" />
          Prix sur demande
        </label>
        {!form.price_on_request && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prix (€) — chiffre</label>
              <input type="number" value={form.price_amount} onChange={(e) => onChange("price_amount", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Devise</label>
              <input value={form.currency} onChange={(e) => onChange("currency", e.target.value.toUpperCase())} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Affichage personnalisé (optionnel)</label>
              <input value={form.price_display} onChange={(e) => onChange("price_display", e.target.value)} placeholder="€ 1 250 000" className={inputCls} />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Caractéristiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><label className={labelCls}>Surface (m²)</label><input type="number" value={form.area_m2} onChange={(e) => onChange("area_m2", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Terrain (m²)</label><input type="number" value={form.land_area_m2} onChange={(e) => onChange("land_area_m2", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Pièces</label><input type="number" value={form.rooms} onChange={(e) => onChange("rooms", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Chambres</label><input type="number" value={form.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Salles de bain</label><input type="number" value={form.bathrooms} onChange={(e) => onChange("bathrooms", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Étage</label><input value={form.floor} onChange={(e) => onChange("floor", e.target.value)} className={inputCls} /></div>
        </div>
        <div className="flex flex-wrap gap-4">
          {featureFields.map(([key, label]) => (
            <label key={key} className={checkCls}>
              <input type="checkbox" checked={form[key]} onChange={(e) => onChange(key, e.target.checked)} className="accent-primary" />
              {label}
            </label>
          ))}
        </div>
        <div>
          <label className={labelCls}>Classe énergie</label>
          <input value={form.energy_class} onChange={(e) => onChange("energy_class", e.target.value)} placeholder="A, B, C..." className={`${inputCls} max-w-[120px]`} />
        </div>
      </section>
    </>
  );
}
