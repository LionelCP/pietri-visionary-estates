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
  name: "get_property",
  title: "Get property",
  description: "Return the full record for one property, by id, slug, or internal_ref.",
  inputSchema: {
    id: z.string().uuid().optional(),
    slug: z.string().optional(),
    internal_ref: z.string().optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, slug, internal_ref }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    if (!id && !slug && !internal_ref)
      return {
        content: [{ type: "text", text: "Provide id, slug, or internal_ref." }],
        isError: true,
      };
    const sb = client(ctx);
    let q = sb.from("properties").select("*");
    if (id) q = q.eq("id", id);
    else if (slug) q = q.eq("slug", slug);
    else if (internal_ref) q = q.eq("internal_ref", internal_ref);
    const { data, error } = await q.maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: "Not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { property: data },
    };
  },
});
