import { next } from "@vercel/functions"

export default function middleware(request: Request) {
  // Escape the Instagram webview on iOS and Android!
  // Manually construct URL because `URL` doesn't allow maniuplation of non-standard protocols, annoyingly
  const url = new URL(request.url)
  const userAgent = request.headers.get("user-agent")?.toLowerCase()
  if (userAgent?.includes("instagram")) {
    const host = request.headers.get("host")

    // Bouncing out to a real browser drops the referrer, so these visits would
    // land in PostHog as direct traffic. Tag the source while we still know it.
    // `set` on the parsed URL keeps any existing params, notably `ref`.
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "ig")
    }

    const urlWithoutProtocol = `${host}${url.pathname}${url.search}`

    if (userAgent.match(/(iPhone|iPod|iPad)/i)) {
      const redirectUrl = `x-safari-https://${urlWithoutProtocol}`
      return Response.redirect(redirectUrl, 302)
    }

    if (userAgent.includes("android")) {
      // Example: "intent://gathers.social#Intent;scheme=https;end;S.browser_fallback_url=https%3A%2F%2Fgathers.social"
      const fallbackUrl = `https://${urlWithoutProtocol}`
      const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;end;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
      return Response.redirect(intentUrl, 302)
    }
  }

  return next()
}
