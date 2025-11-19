import { PostHogProvider } from "@posthog/react"
import posthog from "posthog-js"
import { useEffect } from "react"

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
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
