import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function client(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function isAdmin(ctx: ToolContext): Promise<boolean> {
  const sb = client(ctx);
  const { data } = await sb
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.getUserId())
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

export default defineTool({
  name: "update_property_status",
  title: "Update property status",
  description:
    "Change a property status to disponible, sous_offre, reserve, vendu, or masque. Admin only.",
  inputSchema: {
    id: z.string().uuid(),
    status: z.enum(["disponible", "sous_offre", "reserve", "vendu", "masque"]),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    if (!(await isAdmin(ctx)))
      return { content: [{ type: "text", text: "Admin role required" }], isError: true };
    const sb = client(ctx);
    const { data, error } = await sb
      .from("properties")
      .update({ status })
      .eq("id", id)
      .select("id, title, status")
      .maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Status updated: ${JSON.stringify(data)}` }],
      structuredContent: { property: data },
    };
  },
});
