// Billing actions started from our own pages only. Browsers send Origin on
// every POST; a form or fetch from another site carries that site's origin.
// (The session cookie is SameSite=Lax as well, so it isn't sent on such a
// POST anyway.)
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  return origin !== null && origin === new URL(req.url).origin;
}
