import { next } from "@vercel/functions"

/**
 * Instagram's webview used to hand off to Safari when we redirected it to
 * `x-safari-https://`. Meta stopped honoring that scheme in its own apps around
 * March 2026, and because a redirect carries no body, the webview was left
 * holding a URL it refused to load and nothing to render — the page just spun.
 *
 * Meta's replacement scheme is undocumented and every write-up on it disagrees
 * about when it fires, so treat the escape as something that will stop working
 * again: attempt it, but always ship the page underneath it.
 */

type InAppBrowser = "instagram-ios" | "instagram-android"

function detectInAppBrowser(userAgent: string): InAppBrowser | undefined {
  if (!/instagram/i.test(userAgent)) return undefined
  if (/iphone|ipod|ipad/i.test(userAgent)) return "instagram-ios"
  if (/android/i.test(userAgent)) return "instagram-android"
  return undefined
}

/**
 * `instagram://extbrowser/` is Meta's own undocumented handoff — the same one a
 * couple of link-in-bio services ship. `intent://` is Android's documented
 * equivalent, where `browser_fallback_url` lands back here if nothing takes it.
 */
function buildEscapeUrl(browser: InAppBrowser, target: URL): string {
  const url = new URL(target)

  // Bouncing out to a real browser drops the referrer, so these visits would
  // land in PostHog as direct traffic. Tag the source while we still know it.
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "ig")
  }

  if (browser === "instagram-ios") {
    return `instagram://extbrowser/?url=${encodeURIComponent(url.toString())}`
  }

  // Manually assembled because `URL` won't let us manipulate a non-standard protocol.
  const withoutProtocol = `${url.host}${url.pathname}${url.search}`
  const fallback = encodeURIComponent(url.toString())
  return `intent://${withoutProtocol}#Intent;scheme=https;end;S.browser_fallback_url=${fallback}`
}

/**
 * Set whenever we inject an escape attempt, and checked before injecting
 * another. Android's `intent://` fallback navigates straight back here, so
 * without this the page would bounce between the two forever. Short-lived, so
 * a later visit still gets a shot at escaping.
 */
const ESCAPE_COOKIE = "ig_escape"

/** Marks our own request for the page HTML so it isn't rewritten again. */
const PASSTHROUGH_HEADER = "x-skip-middleware"

export default async function middleware(request: Request) {
  if (request.headers.has(PASSTHROUGH_HEADER)) return next()

  const browser = detectInAppBrowser(request.headers.get("user-agent") ?? "")
  if (!browser) return next()

  if (request.headers.get("cookie")?.includes(`${ESCAPE_COOKIE}=`)) {
    return next()
  }

  const html = await fetchPage(request)
  // Never trade the page away for an escape attempt. This is the whole lesson
  // of the redirect this replaced: if the hand-off fails, the visitor is left
  // staring at a spinner.
  if (!html?.includes("<head>")) return next()

  const url = new URL(request.url)
  const host = request.headers.get("host")
  if (host) url.host = host
  url.protocol = "https:"

  /**
   * Meta's webview silently drops a scripted navigation to its own scheme, but
   * is reported to honor a declarative one that arrives while the page is being
   * parsed. That is the only reason this lives at the edge rather than in the
   * app: a `<meta>` tag React appends later would not be parser-inserted.
   */
  const escapeUrl = buildEscapeUrl(browser, url)
  const meta = `<meta http-equiv="refresh" content="0;url=${escapeAttribute(escapeUrl)}">`

  return new Response(html.replace("<head>", `<head>${meta}`), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // This response depends on the user agent, so it must never be shared.
      "cache-control": "private, no-store",
      vary: "user-agent",
      "set-cookie": `${ESCAPE_COOKIE}=1; Path=/; Max-Age=60; SameSite=Lax; Secure`,
    },
  })
}

async function fetchPage(request: Request): Promise<string | undefined> {
  try {
    const response = await fetch(request.url, {
      headers: { [PASSTHROUGH_HEADER]: "1" },
    })
    return response.ok ? await response.text() : undefined
  } catch {
    return undefined
  }
}

/** The escape URL carries the visitor's own path and query, so it is untrusted. */
function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
}
