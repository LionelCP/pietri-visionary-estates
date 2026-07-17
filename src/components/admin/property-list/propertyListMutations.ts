import { supabase } from "@/integrations/supabase/client";

export async function updatePropertyFeatured(id: string, featured: boolean) {
  const { error } = await supabase.from("properties").update({ featured }).eq("id", id);
  if (error) throw error;
}

export async function updatePropertyDisplayOrder(id: string, displayOrder: number) {
  const { error } = await supabase.from("properties").update({ display_order: displayOrder }).eq("id", id);
  if (error) throw error;
}
