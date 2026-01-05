import { PostHogProvider } from "@posthog/react"
import { getDefaultStore } from "jotai"
import posthog from "posthog-js"
import { useEffect } from "react"

import { queryParamsAtom } from "@/hooks"

const LOCAL_STORAGE_KEY = "queryParams"

let paramsInitialized = false

export function AnalyticsProvider({ children }: React.PropsWithChildren) {
  useEffect(() => {
    const isLocal = ["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    )
    if (!isLocal) {
      posthog.init("phc_UgXKojpO7f6ejjL9oytuntkrlABs0Y1eOvCGG0aZbWn", {
        api_host: "/client",
        ui_host: "https://us.posthog.com",
        person_profiles: "always",
        defaults: "2025-11-30",
      })
    }

    /**
     * Prevent sharing of *personalized* query params.
     * QR codes include VIP code & phone number. Ensure users don't share these if they copy the URL.
     *
     * 1) Merge current search params into localStorage (latest values win)
     * 2) Remove all search params from URL
     * 3) Add `ref` (PostHog distinct ID) param to attribute shared visits to this session
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
      if (key !== "ref") {
        params[key] = value
      }
    }

    if (Object.keys(params).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(params))
    }

    for (const param of Object.keys(params)) {
      urlParams.delete(param)
    }

    const distinctId = posthog.get_distinct_id() as string | undefined
    if (distinctId) {
      urlParams.set("ref", distinctId)
    }

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
