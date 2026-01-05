import { cva, VariantProps } from "class-variance-authority"
import { useAtomValue } from "jotai"
import { HeartIcon, MessageCircleHeartIcon } from "lucide-react"
import {
  motion,
  stagger,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValueEvent,
} from "motion/react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

import {
  useDebounce,
  useFontsReady,
  useQueryParams,
  useShareReferralLink,
} from "@/hooks"
import { typingAnimationsCompleteAtom } from "@/utils"

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
  const readyAfterTypingAnimation = useDebounce(typingAnimationsComplete, 400)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const [hasScrolled, setHasScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hasScrolled && latest >= 400) {
      setHasScrolled(true)
    }
  })

  const shouldAnimate = fontsReady && (hasScrolled || readyAfterTypingAnimation)

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

  const { phone } = useQueryParams()

  return (
    <motion.div
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      transition={{
        type: "spring",
        delayChildren: stagger(0.2),
        visualDuration: 1,
      }}
      // Required so buttons are not visible under the translucent iOS bottom navbar until they animate in
      variants={{
        visible: {
          opacity: 1,
        },
        hidden: { opacity: 0 },
      }}
      /**
       * Safari on iOS 26 is incredibly buggy with fixed/sticky position elements and
       * there's almost zero documentation on its behavior.
       *
       * Depending upon the positioning of fixed elements and their translucency,
       * Safari automatically changes whether the bottom navbar is translucent
       * or opaque (cropping the viewport).
       *
       * Any tweaks here *require* manual testing.
       */
      className="sticky inset-x-0 bottom-7 z-30 w-full">
      <div className="relative z-30 flex flex-row items-end justify-center gap-6">
        <motion.div variants={childVariants}>
          <motion.div style={{ y: y1 }}>
            <DateButton />
          </motion.div>
        </motion.div>

        <motion.div variants={childVariants}>
          <motion.div style={{ y: y2 }}>
            {phone ? <TextMeButton phone={phone} /> : <ReferButton />}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const button = cva(
  [
    "relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full px-2 py-3 shadow-xl transition",
  ],
  {
    variants: {
      variant: {
        date: "font-leap bg-linear-to-b from-pink-400 to-red-600 text-[1.6rem] leading-none tracking-wider text-white uppercase",
        secondary:
          "bg-linear-to-b from-amber-500 to-orange-600 font-sans text-lg leading-none font-black text-orange-50 uppercase",
      },
    },
  },
)

function Button({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<typeof motion.button> & VariantProps<typeof button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={twMerge(button({ variant }), className)}
      {...props}>
      {children}
    </motion.button>
  )
}

function DateButton() {
  const { vip } = useQueryParams()
  const tallyFormId = vip ? "3NPp5l" : "wM5APk"

  return (
    <Button
      variant="date"
      data-tally-width="1000"
      data-tally-height="1000"
      data-tally-layout="modal"
      data-tally-open={tallyFormId}>
      <HeartIcon className="animate-float absolute top-0 left-1 origin-center stroke-white/70 blur-[1.5px]" />
      <HeartIcon
        className="animate-float absolute right-1 bottom-0 origin-center stroke-white/70 blur-[1.5px]"
        style={
          {
            "--float-direction": -1,
          } as React.CSSProperties
        }
      />
      <div className="-mr-1.5">Date?</div>
    </Button>
  )
}

function ReferButton() {
  const share = useShareReferralLink()
  return (
    <Button variant="secondary" onClick={share}>
      <span>
        Refer a <br />
        <span className="text-orange-200">hot</span> friend
      </span>
    </Button>
  )
}

// For privacy (without requiring SSR), my phone number is passed as a search parameter embedded in the QR code URL
function TextMeButton({ phone }: { phone: string }) {
  return (
    <a href={`sms:${phone}`} className="no-underline">
      <Button
        variant="secondary"
        className="text-lg/none font-normal normal-case">
        <MessageCircleHeartIcon className="absolute right-2 bottom-3 scale-125 text-orange-200/50 blur-[1px]" />
        Here’s my number
      </Button>
    </a>
  )
}
