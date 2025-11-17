import { useState } from "react"
import { Typewriter } from "./Typewriter"
import { useAtomValue, useSetAtom } from "jotai"
import { useDebounce, useSearchParams } from "@/hooks"
import {
  heroAnimationCompleteAtom,
  typingAnimationsCompleteAtom,
} from "@/utils"

export function Header() {
  const heroAnimationComplete = useAtomValue(heroAnimationCompleteAtom)

  const [animation1Complete, setAnimation1Complete] = useState(false)
  const readyForAnimation2 = useDebounce(animation1Complete, 200)

  const [animation2Complete, setAnimation2Complete] = useState(false)
  const readyForAnimation3 = useDebounce(animation2Complete, 200)

  const setTypingAnimationsComplete = useSetAtom(typingAnimationsCompleteAtom)

  const searchParams = useSearchParams()
  const vip = searchParams.get("vip")

  return (
    <header className="flex flex-col gap-4">
      <h1 className="mb-4!">
        <Typewriter
          play={heroAnimationComplete}
          onComplete={() => setAnimation1Complete(true)}
          charDelay={60}>
          Hey! <br /> I’m Kincaid.
        </Typewriter>
      </h1>

      <h4 className="mt-0! mb-4!">
        <Typewriter
          play={readyForAnimation2}
          onComplete={() => setAnimation2Complete(true)}
          charDelay={30}
          punctuationDelay={200}>
          {vip
            ? "If you’re reading this, you caught my eye."
            : "I’m looking for a woman in NYC. "}
        </Typewriter>
      </h4>

      <h4 className="mt-0! mb-4!">
        <Typewriter
          play={readyForAnimation3}
          charDelay={30}
          punctuationDelay={250}
          onComplete={() => setTypingAnimationsComplete(true)}>
          {vip
            ? "Want to grab a drink, build a pillow fort, and plot our political power couple ascension?"
            : "Let’s grab a drink, build a pillow fort, and plot our political power couple ascension."}
        </Typewriter>
      </h4>
    </header>
  )
}
