import { usePostHog } from "@posthog/react"
import confetti from "canvas-confetti"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"

export function useSearchParams(): URLSearchParams {
  const [params, setParams] = useState(new URLSearchParams())

  useLayoutEffect(() => {
    setParams(new URLSearchParams(window.location.search))
  }, [])

  return params
}

export function useFontsReady(): boolean {
  const [fontsReady, setFontsReady] = useState(false)
  useLayoutEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  return fontsReady
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function useShareReferralLink(): () => Promise<void> {
  const posthog = usePostHog()
  return useCallback(async () => {
    triggerConfetti()

    const url = new URL("https://datekincaid.com")
    url.searchParams.set("ref", posthog.get_distinct_id())

    try {
      await navigator.share({
        title: "Date Kincaid",
        text: "i found you a man",
        url: url.toString(),
      })
    } catch {
      await navigator.clipboard.writeText(url.toString())
      // TODO Show toast - copied link to clipboard. Use sonner?
    }
  }, [posthog])
}

function fire(particleRatio: number, opts: confetti.Options) {
  confetti({
    origin: { y: 0.7 },
    zIndex: 9999,
    ...opts,
    particleCount: Math.floor(200 * particleRatio),
  })
}

function triggerConfetti() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}
