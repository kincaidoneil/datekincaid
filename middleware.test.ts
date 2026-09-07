import assert from "node:assert/strict"
import { test } from "node:test"

import middleware from "./middleware.ts"

const PAGE = `<!doctype html>
<html lang="en">
  <head></head>
  <body class="antialiased">
    <div id="root"></div>
    <script type="module" src="/assets/main-abc123.js"></script>
  </body>
</html>`

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) Instagram 385.0.0.44.87"
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) Instagram 385.0.0.44.87 Android"
const SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) Version/18.5 Mobile Safari/604.1"

/** Stands in for the deployment serving its own page HTML back to the edge. */
function stubOrigin(response: () => Response) {
  const original = globalThis.fetch
  globalThis.fetch = async () => response()
  return () => {
    globalThis.fetch = original
  }
}

async function request(
  userAgent: string,
  { path = "/", cookie }: { path?: string; cookie?: string } = {},
) {
  const restore = stubOrigin(
    () => new Response(PAGE, { headers: { "content-type": "text/html" } }),
  )
  try {
    return await middleware(
      new Request(`https://datekincaid.com${path}`, {
        headers: {
          "user-agent": userAgent,
          host: "datekincaid.com",
          ...(cookie ? { cookie } : {}),
        },
      }),
    )
  } finally {
    restore()
  }
}

/** `next()` hands the request on rather than producing a page of its own. */
function assertPassthrough(response: Response) {
  assert.equal(response.headers.get("x-middleware-next"), "1")
}

function metaRefreshTarget(html: string): string {
  const match = html.match(/content="0;url=([^"]*)"/)
  assert.ok(match, `no meta refresh in: ${html}`)
  return match[1]
}

test("leaves a normal browser alone", async () => {
  assertPassthrough(await request(SAFARI))
})

test("serves the page itself, not just an escape attempt", async () => {
  const html = await (await request(IPHONE)).text()

  // The bug this replaces: a bodyless redirect to a scheme Instagram refuses
  // leaves the webview with nothing to render, so it spins forever.
  assert.match(html, /<div id="root"><\/div>/)
  assert.match(html, /assets\/main-abc123\.js/)
})

test("asks Instagram for a real browser on iOS", async () => {
  const html = await (
    await request(IPHONE, { path: "/?ref=swift-otter" })
  ).text()
  const target = metaRefreshTarget(html)

  assert.match(target, /^instagram:\/\/extbrowser\/\?url=/)

  const escaped = new URL(decodeURIComponent(target.split("url=")[1]))
  assert.equal(escaped.origin + escaped.pathname, "https://datekincaid.com/")
  assert.equal(escaped.searchParams.get("ref"), "swift-otter")
  // Escaping drops the referrer, so the visit has to carry its own source.
  assert.equal(escaped.searchParams.get("utm_source"), "ig")
})

test("uses an intent with a fallback on Android", async () => {
  const target = metaRefreshTarget(await (await request(ANDROID)).text())

  assert.match(target, /^intent:\/\/datekincaid\.com\//)
  assert.match(target, /S\.browser_fallback_url=https%3A%2F%2Fdatekincaid\.com/)
})

test("only attempts the escape once", async () => {
  // Android's intent fallback navigates straight back here; without the cookie
  // the page would bounce between the two forever.
  const response = await request(ANDROID, { cookie: "ig_escape=1; other=x" })
  assertPassthrough(response)

  assert.match(
    (await request(ANDROID)).headers.get("set-cookie") ?? "",
    /^ig_escape=1;/,
  )
})

test("serves the page when the origin fetch fails", async () => {
  const restore = stubOrigin(() => new Response("nope", { status: 500 }))
  try {
    assertPassthrough(
      await middleware(
        new Request("https://datekincaid.com/", {
          headers: { "user-agent": IPHONE, host: "datekincaid.com" },
        }),
      ),
    )
  } finally {
    restore()
  }
})

test("does not let a crafted URL break out of the meta tag", async () => {
  const html = await (
    await request(ANDROID, { path: '/?x="><script>alert(1)</script>' })
  ).text()

  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/)
  assert.match(metaRefreshTarget(html), /^intent:/)
})

test("never lets a rewritten page be cached for everyone", async () => {
  const response = await request(IPHONE)
  assert.match(response.headers.get("cache-control") ?? "", /no-store/)
  assert.equal(response.headers.get("vary"), "user-agent")
})
