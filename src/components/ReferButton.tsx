import confetti from "canvas-confetti"
import { usePostHog } from "@posthog/react"
import { useCallback } from "react"

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

export function ReferButton() {
  const posthog = usePostHog()
  const share = useCallback(async () => {
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

  return (
    <button
      className="relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full bg-linear-to-b from-amber-500 to-orange-600 px-1 py-3 font-sans text-lg leading-none font-black tracking-normal text-orange-50 uppercase shadow-xl transition active:scale-95"
      onClick={share}>
      <span className="relative z-10">
        Refer a <br />
        <span className="text-orange-200">hot</span> friend
      </span>
    </button>
  )
}
