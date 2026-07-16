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
  name: "list_properties",
  title: "List properties",
  description:
    "List Cabinet Pietri properties (id, internal_ref, slug, title, status, price, city). Includes hidden ones only if the caller is admin.",
  inputSchema: {
    include_hidden: z
      .boolean()
      .optional()
      .describe("Include properties with status 'masque' (admin only)."),
    limit: z.number().int().min(1).max(200).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ include_hidden, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = client(ctx);
    let q = sb
      .from("properties")
      .select(
        "id, internal_ref, slug, title, status, price_amount, price_display, price_on_request, city, region, property_type, featured, updated_at",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!include_hidden) q = q.neq("status", "masque");
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { properties: data ?? [] },
    };
  },
});
