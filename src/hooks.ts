import { usePostHog } from "@posthog/react"
import confetti from "canvas-confetti"
import { atom, useAtomValue } from "jotai"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { toast } from "sonner"

import { REF_PARAM, getRefCode } from "@/referral"

export const queryParamsAtom = atom<Record<string, string | undefined>>({})

/** Merged query params from all page visits (latest values override) */
export function useQueryParams(): Record<string, string | undefined> {
  return useAtomValue(queryParamsAtom)
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

export type Age =
  | { status: "loading" }
  | { status: "ready"; age: number }
  | { status: "unavailable" }

/** Fetched rather than hardcoded so the birthday stays out of the repo. See `api/age.ts`. */
export function useAge(): Age {
  const [age, setAge] = useState<Age>({ status: "loading" })
  useEffect(() => {
    fetch("/api/age")
      .then((response) => (response.ok ? response.json() : undefined))
      .then((body: unknown) => {
        const age =
          typeof body === "object" && body !== null && "age" in body
            ? body.age
            : undefined
        setAge(
          typeof age === "number"
            ? { status: "ready", age }
            : { status: "unavailable" },
        )
      })
      .catch(() => setAge({ status: "unavailable" }))
  }, [])
  return age
}

export function useShareReferralLink(): () => Promise<void> {
  const posthog = usePostHog()
  return useCallback(async () => {
    triggerConfetti()

    const refCode = getRefCode()
    const url = new URL("https://datekincaid.com")
    url.searchParams.set(REF_PARAM, refCode)

    posthog.capture("referral_shared", { ref_code: refCode })

    const shareData: ShareData = {
      title: "Date Kincaid",
      text: "i found you a man",
      url: url.toString(),
    }

    const copyInstead = async () => {
      await navigator.clipboard.writeText(url.toString())
      toast("Copied link to clipboard!")
    }

    if ("canShare" in navigator && !navigator.canShare(shareData)) {
      await copyInstead()
      return
    }

    if ("share" in navigator) {
      void navigator.share(shareData).catch(copyInstead)
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
