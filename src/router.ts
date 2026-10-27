import { useEffect, useState } from "react";

/**
 * Minimal hash router: "#/clauses/GS-LG?s=anchor" -> { parts: ["clauses", "GS-LG"], anchor }.
 * Hash routes need no server rewrites and give every page a shareable link.
 */
export interface Route {
  parts: string[];
  anchor: string | null;
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const anchor = new URLSearchParams(query).get("s");
  return { parts, anchor };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

/** Build an href for a route, optionally scrolling to an element id on arrival. */
export function to(path: string, anchor?: string): string {
  return `#/${path.replace(/^\//, "")}${anchor ? `?s=${encodeURIComponent(anchor)}` : ""}`;
}
