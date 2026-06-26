// Edge function: log-visit
// CNIL-compliant anonymous audience measurement.
// - Truncates IP immediately (IPv4: last octet -> 0; IPv6: keep /48)
// - Stores no cookie, no identifying data
// - 13-month retention enforced via purge_old_visit_logs()

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface VisitPayload {
  session_id: string;
  page: string;
  referrer?: string | null;
  duration_seconds?: number | null;
}

function truncateIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const clean = ip.trim();
  if (!clean) return null;
  if (clean.includes(".")) {
    const parts = clean.split(".");
    if (parts.length === 4) {
      parts[3] = "0";
      return parts.join(".");
    }
    return null;
  }
  if (clean.includes(":")) {
    // IPv6: keep first 3 hextets (/48), zero the rest
    const parts = clean.split(":");
    const kept = parts.slice(0, 3);
    while (kept.length < 8) kept.push("0");
    return kept.join(":");
  }
  return null;
}

function getClientIp(req: Request): string | null {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return null;
}

function parseDevice(ua: string): string {
  if (!ua) return "unknown";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return "mobile";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (!ua) return "unknown";
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/opr\//i.test(ua)) return "Opera";
  return "Other";
}

function isValidString(v: unknown, max = 2048): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= max;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: VisitPayload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!isValidString(body.session_id, 64) || !isValidString(body.page, 1024)) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const referrer =
    body.referrer && isValidString(body.referrer, 2048) ? body.referrer : null;
  const duration =
    typeof body.duration_seconds === "number" &&
    Number.isFinite(body.duration_seconds) &&
    body.duration_seconds >= 0 &&
    body.duration_seconds < 86400
      ? Math.round(body.duration_seconds)
      : null;

  const ua = req.headers.get("user-agent") ?? "";
  const ipRaw = getClientIp(req);
  const ipTruncated = truncateIp(ipRaw);
  const country = req.headers.get("cf-ipcountry") ?? req.headers.get("x-vercel-ip-country") ?? null;
  const city = req.headers.get("cf-ipcity") ?? req.headers.get("x-vercel-ip-city") ?? null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase.from("visit_logs").insert({
    session_id: body.session_id,
    ip_truncated: ipTruncated,
    country,
    city,
    page: body.page,
    referrer,
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    duration_seconds: duration,
  });

  if (error) {
    console.error("insert error", error);
    return new Response(JSON.stringify({ error: "Insert failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Best-effort purge: ~1% chance per request to keep load minimal
  if (Math.random() < 0.01) {
    await supabase.rpc("purge_old_visit_logs").catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
