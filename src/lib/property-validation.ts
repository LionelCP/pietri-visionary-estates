import type { Property } from "@/types/property";

export function validatePublicationFields(p: Pick<Property, "reference" | "internal_ref" | "slug" | "title_fr" | "title" | "description_fr" | "long_description" | "short_description" | "city" | "region" | "country" | "property_type" | "transaction_type" | "price_amount" | "price_on_request" | "currency">): string[] {
  const errors: string[] = [];
  if (!(p.reference || p.internal_ref)) errors.push("La référence est obligatoire.");
  if (!p.slug) errors.push("Le slug est obligatoire.");
  if (!(p.title_fr || p.title)) errors.push("Le titre FR est obligatoire.");
  if (!(p.description_fr || p.long_description || p.short_description)) errors.push("La description FR est obligatoire.");
  if (!p.city) errors.push("La ville est obligatoire.");
  if (!p.region) errors.push("La région est obligatoire.");
  if (!p.country) errors.push("Le pays est obligatoire.");
  if (!p.property_type) errors.push("Le type de bien est obligatoire.");
  if (!p.transaction_type) errors.push("Le type de transaction est obligatoire.");
  if (!p.currency) errors.push("La devise est obligatoire.");
  if (!p.price_on_request && p.price_amount == null) errors.push("Le prix est obligatoire, sauf si prix sur demande.");
  return errors;
}
