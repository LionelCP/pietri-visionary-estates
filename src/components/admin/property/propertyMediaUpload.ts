import { supabase } from "@/integrations/supabase/client";

export async function uploadPropertyFile(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}
