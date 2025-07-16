import * as Dialog from "@radix-ui/react-dialog"
import confetti from "canvas-confetti"
import { Radiation } from "lucide-react"
import type { JSX } from "react"

interface FriendZoneDialogProps {
  children: JSX.Element
}

export default function FriendZoneDialog({ children }: FriendZoneDialogProps) {
  const triggerConfetti = () => {
    // More elaborate confetti effect
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full bg-gradient-to-b from-amber-500 to-orange-600 px-3 py-3 font-sans text-xl leading-none font-black tracking-normal text-white uppercase shadow-xl transition active:scale-95"
          onClick={triggerConfetti}>
          <Radiation className="animate-alert absolute top-1/2 left-1 h-7 w-7 -translate-y-1/2 rounded-full stroke-white/60 stroke-1" />
          <Radiation className="animate-alert absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full stroke-white/60 stroke-1" />
          <span className="relative z-10">
            Friend
            <br />
            <span className="text-orange-200">zone</span>
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Title>Congrats! You’ve friendzoned Kincaid.</Dialog.Title>
        <Dialog.Content className="animate-scale-in fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-xl">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
