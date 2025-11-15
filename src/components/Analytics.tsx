import posthog from "posthog-js"
import { PostHogProvider } from "@posthog/react"

posthog.init("phc_UgXKojpO7f6ejjL9oytuntkrlABs0Y1eOvCGG0aZbWn", {
  api_host: "/client",
  ui_host: "https://us.posthog.com",
  person_profiles: "always",
})

export function AnalyticsProvider({ children }: React.PropsWithChildren) {
  // TODO Exclude local?
  // const isLocal = ["localhost", "127.0.0.1"].includes(window.location.host)

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
