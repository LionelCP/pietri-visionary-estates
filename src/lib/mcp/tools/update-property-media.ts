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
  name: "update_property_media",
  title: "Update property media",
  description:
    "Update video / virtual tour fields on a property (video_url, video_url_2, drone_video_url, hero_video_url, virtual_tour_url, virtual_tour_iframe, matterport_id, show_video, show_virtual_tour). Only provided fields are updated. Admin only.",
  inputSchema: {
    id: z.string().uuid(),
    video_url: z.string().nullable().optional(),
    video_url_2: z.string().nullable().optional(),
    drone_video_url: z.string().nullable().optional(),
    hero_video_url: z.string().nullable().optional(),
    virtual_tour_url: z.string().nullable().optional(),
    virtual_tour_iframe: z.string().nullable().optional(),
    matterport_id: z.string().nullable().optional(),
    show_video: z.boolean().optional(),
    show_virtual_tour: z.boolean().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    if (!(await isAdmin(ctx)))
      return { content: [{ type: "text", text: "Admin role required" }], isError: true };
    const { id, ...patch } = input;
    const cleanPatch = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(cleanPatch).length === 0)
      return { content: [{ type: "text", text: "No fields to update" }], isError: true };
    const sb = client(ctx);
    const { data, error } = await sb
      .from("properties")
      .update(cleanPatch)
      .eq("id", id)
      .select("id, title, video_url, video_url_2, drone_video_url, virtual_tour_url, show_video, show_virtual_tour")
      .maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Media updated: ${JSON.stringify(data)}` }],
      structuredContent: { property: data },
    };
  },
});
