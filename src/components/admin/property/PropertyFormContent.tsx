import { inputCls, labelCls } from "./formStyles";
import type { PropertyFormSet, PropertyFormState } from "./propertyFormState";

type PropertyFormContentProps = {
  form: PropertyFormState;
  onChange: PropertyFormSet;
};

export function PropertyFormContent({ form, onChange }: PropertyFormContentProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Descriptions</h2>
      <div><label className={labelCls}>Description courte (FR)</label><textarea rows={2} value={form.short_description} onChange={(e) => onChange("short_description", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>Description longue (FR)</label><textarea rows={6} value={form.long_description} onChange={(e) => onChange("long_description", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>Short description (EN)</label><textarea rows={2} value={form.short_description_en} onChange={(e) => onChange("short_description_en", e.target.value)} className={inputCls} /></div>
      <div><label className={labelCls}>Long description (EN)</label><textarea rows={6} value={form.long_description_en} onChange={(e) => onChange("long_description_en", e.target.value)} className={inputCls} /></div>
      <div>
        <label className={labelCls}>Équipements / points forts (un par ligne)</label>
        <textarea
          rows={4}
          value={form.highlights}
          onChange={(e) => onChange("highlights", e.target.value)}
          placeholder={"Vue panoramique\nProche commerces\nÉtat impeccable"}
          className={inputCls}
        />
      </div>
    </section>
  );
}
