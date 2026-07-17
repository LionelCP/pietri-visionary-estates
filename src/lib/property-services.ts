import { supabase } from "@/integrations/supabase/client";
import { buildPropertyCreatePayload, buildPropertyUpdatePayload } from "@/lib/property-payloads";
import { isPublicProperty, mapPropertyRow, sortForPublic } from "@/lib/property-normalizers";
import type { Property, PropertySaveValues } from "@/types/property";

type PropertyIdResult = { id: string };
type SupabaseErrorLike = { message: string };

function throwOnSupabaseError(error: SupabaseErrorLike | null | undefined): asserts error is null | undefined {
  if (error) throw error;
}

export async function fetchPublicProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("publication_status", "published")
    .neq("status", "masque");
  throwOnSupabaseError(error);
  return sortForPublic((data ?? []).map(mapPropertyRow).filter(isPublicProperty));
}

export async function fetchFeaturedProperties(limit = 4): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .eq("publication_status", "published")
    .neq("status", "masque")
    .order("display_order", { ascending: true })
    .limit(limit);
  throwOnSupabaseError(error);
  return (data ?? []).map(mapPropertyRow).filter(isPublicProperty);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("publication_status", "published")
    .neq("status", "masque")
    .maybeSingle();
  throwOnSupabaseError(error);
  return data ? mapPropertyRow(data) : null;
}

export async function fetchAllProperties(): Promise<Property[]> {
  // Admin only - RLS lets admins read everything (including 'masque')
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  throwOnSupabaseError(error);
  return (data ?? []).map(mapPropertyRow);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error);
  return data ? mapPropertyRow(data) : null;
}

export async function createProperty(values: PropertySaveValues, slug: string): Promise<PropertyIdResult> {
  const payload = buildPropertyCreatePayload(values, slug);
  const dbPayload = { ...payload, gallery: payload.gallery as unknown as never };
  const { data, error } = await supabase
    .from("properties")
    .insert(dbPayload)
    .select("id")
    .single();
  throwOnSupabaseError(error);
  return data as PropertyIdResult;
}

export async function updateProperty(id: string, values: PropertySaveValues, slug: string): Promise<PropertyIdResult> {
  const payload = buildPropertyUpdatePayload(values, slug);
  const dbPayload = { ...payload, gallery: payload.gallery as unknown as never };
  const { data, error } = await supabase
    .from("properties")
    .update(dbPayload)
    .eq("id", id)
    .select("id")
    .single();
  throwOnSupabaseError(error);
  return data as PropertyIdResult;
}
