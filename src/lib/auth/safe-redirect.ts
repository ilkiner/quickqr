/**
 * Same-origin path only — prevents open redirects via ?next=
 */
export function safeRedirectTarget(next: string | null, request: Request): string {
  const fallback = "/dashboard";
  const base = new URL(request.url);

  if (next == null) return fallback;

  const raw = next.trim();
  if (!raw || raw.length > 2048) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (raw.includes("\\") || raw.includes("\0")) return fallback;
  if (raw.includes("@")) return fallback;

  let resolved: URL;
  try {
    resolved = new URL(raw, base.origin);
  } catch {
    return fallback;
  }

  if (resolved.host !== base.host) return fallback;
  if (!resolved.pathname.startsWith("/")) return fallback;

  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}
