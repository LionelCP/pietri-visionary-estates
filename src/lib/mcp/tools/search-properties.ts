import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function client(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "search_properties",
  title: "Search properties",
  description:
    "Filter properties by city, property_type, status, min/max price. Returns concise cards.",
  inputSchema: {
    city: z.string().optional(),
    property_type: z
      .enum(["appartement", "maison", "villa", "terrain", "local_commercial", "programme", "autre"])
      .optional(),
    status: z.enum(["disponible", "sous_offre", "vendu", "reserve", "masque"]).optional(),
    min_price: z.number().optional(),
    max_price: z.number().optional(),
    limit: z.number().int().min(1).max(100).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ city, property_type, status, min_price, max_price, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = client(ctx);
    let q = sb
      .from("properties")
      .select(
        "id, internal_ref, slug, title, status, price_amount, price_display, city, property_type, area_m2, bedrooms",
      );
    if (city) q = q.ilike("city", `%${city}%`);
    if (property_type) q = q.eq("property_type", property_type);
    if (status) q = q.eq("status", status);
    else q = q.neq("status", "masque");
    if (min_price != null) q = q.gte("price_amount", min_price);
    if (max_price != null) q = q.lte("price_amount", max_price);
    q = q.limit(limit ?? 30);
    const { data, error } = await q;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { results: data ?? [], count: data?.length ?? 0 },
    };
  },
});
