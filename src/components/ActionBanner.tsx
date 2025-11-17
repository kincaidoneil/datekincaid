import { HeartIcon } from "lucide-react"
import {
  motion,
  stagger,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValueEvent,
} from "motion/react"
import { ReferButton } from "./ReferButton"
import { useFontsReady } from "@/hooks"
import { useState } from "react"
import { useAtomValue } from "jotai"
import { typingAnimationsCompleteAtom } from "./Header"

const childVariants = {
  hidden: {
    transform: `translateY(200%)`,
  },
  visible: {
    transform: `translateY(0%)`,
  },
}

export function ActionBanner() {
  const fontsReady = useFontsReady()

  const typingAnimationsComplete = useAtomValue(typingAnimationsCompleteAtom)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const [hasScrolled, setHasScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hasScrolled && latest >= 400) {
      setHasScrolled(true)
    }
  })

  const shouldAnimate = fontsReady && (hasScrolled || typingAnimationsComplete)

  // Transform velocity to Y displacement (inverted for counterweight effect)
  const scrollBounce = useTransform(
    scrollVelocity,
    [-1000, 0, 1000],
    [12, 0, -12],
  )

  // Staggered spring physics for each button (different response times)
  const y1 = useSpring(scrollBounce, {
    stiffness: 180,
    damping: 12,
    mass: 0.8,
  })

  const y2 = useSpring(scrollBounce, {
    stiffness: 120,
    damping: 8,
    mass: 1.2,
  })

  return (
    shouldAnimate && (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{
          type: "spring",
          delayChildren: stagger(0.2),
          visualDuration: 2,
        }}
        className="sticky inset-x-0 bottom-0 z-30 w-full pb-6">
        <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-linear-to-b from-transparent to-slate-50/60" />

        <div className="relative z-30 flex max-w-4xl flex-row items-end justify-center gap-6">
          <motion.div
            variants={childVariants}
            transition={{ type: "spring", visualDuration: 1 }}>
            <motion.div style={{ y: y1 }}>
              <DateButton />
            </motion.div>
          </motion.div>

          <motion.div
            variants={childVariants}
            transition={{ type: "spring", visualDuration: 1 }}>
            <motion.div style={{ y: y2 }}>
              <ReferButton />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  )
}

function DateButton() {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      data-tally-width="1000"
      data-tally-height="1000"
      data-tally-layout="modal"
      data-tally-open="wM5APk"
      className="font-leap relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full bg-linear-to-b from-pink-400 to-red-600 px-6 py-4 text-[1.6rem] leading-none tracking-wider text-white uppercase shadow-xl transition">
      <HeartIcon className="animate-float absolute top-0 left-1 origin-center stroke-white/70 blur-[1.5px]" />
      <HeartIcon
        className="animate-float absolute right-1 bottom-0 origin-center stroke-white/70 blur-[1.5px]"
        style={
          {
            "--float-direction": -1,
          } as React.CSSProperties
        }
      />
      Date
    </motion.button>
  )
}
