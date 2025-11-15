import { HeartIcon } from "lucide-react"
import {
  motion,
  stagger,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "motion/react"
import { ReferralButton } from "./ReferButton"
import { useFontsReady } from "@/hooks/use-fonts-ready"

export function ActionBanner() {
  const fontsReady = useFontsReady()

  // Scroll-reactive bounce effect
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  // Transform velocity to Y displacement (inverted for counterweight effect)
  // Clamped to ±12px (roughly 20% of button height) for subtle effect
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

  const childVariants = {
    hidden: {
      transform: `translateY(200%)`,
    },
    visible: {
      transform: `translateY(0%)`,
    },
  }

  return (
    fontsReady && (
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{
          type: "spring",
          delayChildren: stagger(0.2),
          visualDuration: 2,
        }}
        className="sticky inset-x-0 bottom-0 z-30 w-full pb-6">
        <div className="flex max-w-4xl flex-row items-end justify-center gap-6">
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
              <ReferralButton />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  )
}

function DateButton() {
  return (
    <button
      data-tally-width="1000"
      data-tally-height="1000"
      data-tally-layout="modal"
      data-tally-open="wM5APk"
      className="font-leap relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full bg-linear-to-b from-pink-400 to-red-600 px-6 py-4 text-[1.6rem] leading-none tracking-wider text-white uppercase shadow-xl transition active:scale-95">
      <HeartIcon className="animate-float-down absolute top-0 left-1 origin-center stroke-white/70 blur-[1.5px]" />
      <HeartIcon className="animate-float-up absolute right-2 -bottom-2 origin-center stroke-white/70 blur-[1.5px]" />
      Date
    </button>
  )
}
