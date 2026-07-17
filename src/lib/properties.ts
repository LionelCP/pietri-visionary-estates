import { supabase } from "@/integrations/supabase/client";
import { mapPropertyRow, isPublicProperty, sortForPublic } from "@/lib/property-normalizers";
import type { Property, RpcResult } from "@/types/property";

export type {
  GalleryImage,
  Property,
  PropertyFormValues,
  PropertyPublicView,
  PropertyRegion,
  PropertySaveValues,
  PropertyStatus,
  PropertyType,
  PublicationStatus,
  RpcResult,
  TransactionType,
} from "@/types/property";
export type { PropertyCreatePayload, PropertySavePayload } from "@/lib/property-payloads";
export {
  formatLocation,
  formatPrice,
  getPropertyAmenities,
  getPropertyDescription,
  getPropertyReference,
  getPropertySeoDescription,
  getPropertySeoTitle,
  getPropertyTitle,
  isPublicProperty,
  legacyStatusToPublicationStatus,
  mapPropertyRow,
  sortForPublic,
} from "@/lib/property-normalizers";
export { buildPropertyCreatePayload, buildPropertyUpdatePayload } from "@/lib/property-payloads";
export { validatePublicationFields } from "@/lib/property-validation";

export async function fetchPublicProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("publication_status", "published")
    .neq("status", "masque");
  if (error) throw error;
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
  if (error) throw error;
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
  if (error) throw error;
  return data ? mapPropertyRow(data) : null;
}

export async function fetchAllProperties(): Promise<Property[]> {
  // Admin only - RLS lets admins read everything (including 'masque')
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPropertyRow);
}

export async function publishProperty(id: string): Promise<RpcResult> {
  return propertyRpc("publish_property", id);
}

export async function unpublishProperty(id: string): Promise<RpcResult> {
  return propertyRpc("unpublish_property", id);
}

export async function archiveProperty(id: string): Promise<RpcResult> {
  return propertyRpc("archive_property", id);
}

async function propertyRpc(fn: "publish_property" | "unpublish_property" | "archive_property", id: string): Promise<RpcResult> {
  const { data, error } = await supabase.rpc(fn, { property_id: id } as never);
  return { data: data ? mapPropertyRow(data as Record<string, unknown>) : null, error: error?.message ?? null };
}
