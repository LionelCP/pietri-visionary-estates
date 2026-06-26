import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VisitRow {
  id: string;
  session_id: string;
  ip_truncated: string | null;
  country: string | null;
  city: string | null;
  page: string;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  duration_seconds: number | null;
  created_at: string;
}

const PERIODS = [
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
  { label: "90 jours", days: 90 },
  { label: "1 an", days: 365 },
] as const;

const AdminAnalytics = () => {
  const [rows, setRows] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    supabase
      .from("visit_logs")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Erreur", description: error.message, variant: "destructive" });
          setRows([]);
        } else {
          setRows((data ?? []) as VisitRow[]);
        }
        setLoading(false);
      });
  }, [days]);

  const stats = useMemo(() => {
    const sessions = new Set(rows.map((r) => r.session_id));
    const durations = rows.map((r) => r.duration_seconds ?? 0).filter((d) => d > 0);
    const avgDuration = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;
    const pageCounts: Record<string, number> = {};
    const refCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    for (const r of rows) {
      pageCounts[r.page] = (pageCounts[r.page] ?? 0) + 1;
      const ref = r.referrer ? new URL(r.referrer, "http://x").hostname || "(direct)" : "(direct)";
      refCounts[ref] = (refCounts[ref] ?? 0) + 1;
      const c = r.country ?? "—";
      countryCounts[c] = (countryCounts[c] ?? 0) + 1;
      const d = r.device ?? "—";
      deviceCounts[d] = (deviceCounts[d] ?? 0) + 1;
    }
    const top = (obj: Record<string, number>, n = 10) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);
    return {
      visitors: sessions.size,
      pageviews: rows.length,
      avgDuration,
      topPages: top(pageCounts),
      topReferrers: top(refCounts),
      topCountries: top(countryCounts),
      topDevices: top(deviceCounts),
    };
  }, [rows]);

  const exportCsv = () => {
    const header = ["date", "session", "ip", "pays", "ville", "page", "referrer", "device", "browser", "durée (s)"];
    const lines = [header.join(",")];
    for (const r of rows) {
      const fields = [
        r.created_at,
        r.session_id,
        r.ip_truncated ?? "",
        r.country ?? "",
        r.city ?? "",
        r.page,
        r.referrer ?? "",
        r.device ?? "",
        r.browser ?? "",
        r.duration_seconds?.toString() ?? "",
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
      lines.push(fields.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audience-${days}j-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-primary block mb-2">Administration</span>
            <h1 className="font-display text-4xl text-foreground">Audience du site</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Mesure anonymisée conforme CNIL — IP tronquées, conservation 13 mois.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link to="/admin/biens" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-3 border border-border text-foreground hover:border-primary transition-colors">
              <ArrowLeft size={14} /> Biens
            </Link>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-background border border-border px-3 py-3 font-body text-xs tracking-[0.2em] uppercase"
            >
              {PERIODS.map((p) => (
                <option key={p.days} value={p.days}>{p.label}</option>
              ))}
            </select>
            <button
              onClick={exportCsv}
              disabled={!rows.length}
              className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-3 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard label="Visiteurs uniques" value={stats.visitors.toString()} />
              <StatCard label="Pages vues" value={stats.pageviews.toString()} />
              <StatCard label="Durée moyenne" value={formatDuration(stats.avgDuration)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <ListCard title="Top pages" rows={stats.topPages} />
              <ListCard title="Sources" rows={stats.topReferrers} />
              <ListCard title="Pays" rows={stats.topCountries} />
              <ListCard title="Appareils" rows={stats.topDevices} />
            </div>

            <h2 className="font-display text-2xl text-foreground mb-4">Dernières visites</h2>
            <div className="border border-border overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead className="bg-secondary">
                  <tr className="text-left">
                    <Th>Date</Th><Th>Pays</Th><Th>Ville</Th><Th>IP</Th><Th>Page</Th><Th>Source</Th><Th>Appareil</Th><Th>Durée</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 200).map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <Td>{formatDate(r.created_at)}</Td>
                      <Td>{r.country ?? "—"}</Td>
                      <Td>{r.city ?? "—"}</Td>
                      <Td className="text-muted-foreground">{r.ip_truncated ?? "—"}</Td>
                      <Td className="text-foreground">{r.page}</Td>
                      <Td className="text-muted-foreground truncate max-w-[200px]">{r.referrer ?? "(direct)"}</Td>
                      <Td>{r.device ?? "—"}<span className="text-muted-foreground"> · {r.browser ?? "—"}</span></Td>
                      <Td>{r.duration_seconds ? formatDuration(r.duration_seconds) : "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 200 && (
                <p className="px-4 py-3 font-body text-xs text-muted-foreground border-t border-border">
                  Affichage des 200 dernières visites sur {rows.length}. Exportez le CSV pour la liste complète.
                </p>
              )}
              {rows.length === 0 && (
                <p className="px-4 py-12 text-center font-body text-sm text-muted-foreground">
                  Aucune visite enregistrée sur cette période.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-border p-6">
    <div className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{label}</div>
    <div className="font-display text-4xl text-foreground">{value}</div>
  </div>
);

const ListCard = ({ title, rows }: { title: string; rows: [string, number][] }) => (
  <div className="border border-border p-6">
    <div className="font-display text-lg text-foreground mb-4">{title}</div>
    {rows.length === 0 ? (
      <p className="font-body text-sm text-muted-foreground">—</p>
    ) : (
      <ul className="space-y-2">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between font-body text-sm">
            <span className="text-foreground truncate pr-3">{k}</span>
            <span className="text-primary tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

export default AdminAnalytics;
