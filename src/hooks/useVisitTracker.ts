import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// CNIL-compliant anonymous audience measurement hook.
// - No cookie; session id lives in sessionStorage (cleared when tab closes)
// - Sends page + referrer + duration to the log-visit edge function
// - Does not capture IP client-side; the edge function truncates server IP

const SESSION_KEY = "cp_visit_session";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-visit`;

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

interface PendingVisit {
  session_id: string;
  page: string;
  referrer: string | null;
  arrivedAt: number;
}

const useVisitTracker = () => {
  const location = useLocation();
  const pending = useRef<PendingVisit | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip admin routes from tracking
    if (location.pathname.startsWith("/admin")) {
      pending.current = null;
      return;
    }

    const sessionId = getOrCreateSessionId();
    const page = location.pathname + location.search;
    const referrer = pending.current ? null : document.referrer || null;

    // Flush previous visit duration if any
    const prev = pending.current;
    if (prev) {
      const duration = Math.round((Date.now() - prev.arrivedAt) / 1000);
      // fire-and-forget update for previous page duration
      fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: prev.session_id,
          page: prev.page,
          referrer: prev.referrer,
          duration_seconds: duration,
        }),
        keepalive: true,
      }).catch(() => {});
    } else {
      // First page of session: log arrival without duration
      fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          page,
          referrer,
          duration_seconds: null,
        }),
        keepalive: true,
      }).catch(() => {});
    }

    pending.current = { session_id: sessionId, page, referrer, arrivedAt: Date.now() };
  }, [location.pathname, location.search]);

  // Flush on tab close / hide
  useEffect(() => {
    const flush = () => {
      const cur = pending.current;
      if (!cur) return;
      const duration = Math.round((Date.now() - cur.arrivedAt) / 1000);
      const payload = JSON.stringify({
        session_id: cur.session_id,
        page: cur.page,
        referrer: cur.referrer,
        duration_seconds: duration,
      });
      try {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(FUNCTION_URL, blob);
      } catch {
        fetch(FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);
};

export default useVisitTracker;
