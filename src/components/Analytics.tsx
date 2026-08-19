import { PostHogProvider } from "@posthog/react"
import { getDefaultStore } from "jotai"
import posthog, { type CaptureResult, type Properties } from "posthog-js"
import { useEffect } from "react"

import { queryParamsAtom } from "@/hooks"
import { REF_PARAM, getRefCode, parseInboundRef } from "@/referral"

const LOCAL_STORAGE_KEY = "queryParams"

/** Matches `$current_url` and `$initial_current_url`. */
const URL_PROPERTY = /current_url$/

function withoutQueryString(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.search = ""
    return parsed.toString()
  } catch {
    return url
  }
}

function isPropertyBag(value: unknown): value is Properties {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Recurses because person properties arrive nested under `$set` and `$set_once`. */
function sanitizeUrls(properties: Properties | undefined): void {
  if (!properties) return
  for (const key of Object.keys(properties)) {
    const value: unknown = properties[key]
    if (URL_PROPERTY.test(key) && typeof value === "string") {
      properties[key] = withoutQueryString(value)
    } else if (isPropertyBag(value)) {
      sanitizeUrls(value)
    }
  }
}

const analyticsEnabled =
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)

if (analyticsEnabled) {
  posthog.init("phc_UgXKojpO7f6ejjL9oytuntkrlABs0Y1eOvCGG0aZbWn", {
    api_host: "/client",
    ui_host: "https://us.posthog.com",
    person_profiles: "always",
    defaults: "2025-11-30",
    /**
     * Events are captured before the effect below rewrites the URL, so the
     * query string still holds the VIP code and phone number from a QR card.
     * `ref` is unique per visitor and would splinter URL-based reports too.
     * PostHog reads utm params into their own properties, so dropping the
     * whole query string here costs nothing.
     */
    before_send: (event: CaptureResult | null) => {
      if (!event) return event
      sanitizeUrls(event.properties)
      sanitizeUrls(event.$set)
      sanitizeUrls(event.$set_once)
      return event
    },
  })
}

let paramsInitialized = false

export function AnalyticsProvider({ children }: React.PropsWithChildren) {
  useEffect(() => {
    /**
     * Prevent sharing of *personalized* query params.
     * QR codes include VIP code & phone number. Ensure users don't share these if they copy the URL.
     *
     * 1) Merge current search params into localStorage (latest values win)
     * 2) Remove all search params from URL
     * 3) Record who referred this visit, then swap `ref` for this visitor's own
     *    code so anything they share onward is attributed to them
     * 4) Do client navigation
     * 5) Save merged params to Jotai atom for rendering
     */

    if (paramsInitialized) return
    paramsInitialized = true

    const urlParams = new URLSearchParams(window.location.search)
    const params: Record<string, string | undefined> = {}

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      Object.assign(params, JSON.parse(stored))
    }

    for (const [key, value] of urlParams.entries()) {
      if (key !== REF_PARAM) {
        params[key] = value
      }
    }

    if (Object.keys(params).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(params))
    }

    for (const param of Object.keys(params)) {
      urlParams.delete(param)
    }

    const refCode = getRefCode()
    const referredBy = parseInboundRef(urlParams.get(REF_PARAM))

    if (analyticsEnabled) {
      posthog.setPersonProperties({ ref_code: refCode })

      if (referredBy && referredBy !== refCode) {
        // Set once, so the first referrer keeps credit across repeat visits.
        posthog.setPersonProperties(undefined, { referred_by: referredBy })
        posthog.capture("referral_landed", { referred_by: referredBy })
      }
    }

    urlParams.set(REF_PARAM, refCode)

    const newSearch = urlParams.toString()
    const newUrl = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname
    window.history.replaceState({}, "", newUrl)

    const store = getDefaultStore()
    store.set(queryParamsAtom, params)
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
