import { checkCls, inputCls, labelCls } from "./formStyles";
import type { PropertyFormSet, PropertyFormState } from "./propertyFormState";

type PropertyFormSeoProps = {
  form: PropertyFormState;
  onChange: PropertyFormSet;
};

export function PropertyFormSeo({ form, onChange }: PropertyFormSeoProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Extras & SEO</h2>
      <div>
        <label className={labelCls}>URL du plan PDF</label>
        <input value={form.plan_pdf_url} onChange={(e) => onChange("plan_pdf_url", e.target.value)} className={inputCls} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className={checkCls}>
          <input type="checkbox" checked={form.featured} onChange={(e) => onChange("featured", e.target.checked)} className="accent-primary" />
          Afficher en page d'accueil
        </label>
        <label className={checkCls}>
          <input type="checkbox" checked={form.coup_de_coeur} onChange={(e) => onChange("coup_de_coeur", e.target.checked)} className="accent-primary" />
          Coup de cœur
        </label>
        <div className="flex items-center gap-2">
          <label className="font-body text-xs uppercase tracking-wider text-foreground">Ordre d'affichage</label>
          <input type="number" value={form.display_order} onChange={(e) => onChange("display_order", e.target.value)} className="w-20 bg-background border border-border px-2 py-1 text-sm" />
        </div>
      </div>
      <div><label className={labelCls}>SEO title FR (optionnel)</label><input value={form.seo_title} onChange={(e) => onChange("seo_title", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>SEO description FR (optionnel)</label><textarea rows={2} value={form.seo_description} onChange={(e) => onChange("seo_description", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>SEO title EN (optionnel)</label><input value={form.seo_title_en} onChange={(e) => onChange("seo_title_en", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>SEO description EN (optionnel)</label><textarea rows={2} value={form.seo_description_en} onChange={(e) => onChange("seo_description_en", e.target.value)} className={inputCls} /></div>
    </section>
  );
}
