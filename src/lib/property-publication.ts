import { supabase } from "@/integrations/supabase/client";
import { mapPropertyRow } from "@/lib/property-normalizers";
import type { Property, RpcResult } from "@/types/property";

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

export async function validatePropertyForPublication(id: string): Promise<RpcResult<string[]>> {
  const { data, error } = await supabase.rpc("validate_property_for_publication", { property_id: id } as never);
  return { data: (data as string[] | null) ?? null, error: error?.message ?? null };
}
