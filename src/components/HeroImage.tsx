import { useSetAtom } from "jotai"
import { motion } from "motion/react"

import Hero from "@/assets/lisbon.jpg?as=metadata"
import { heroAnimationCompleteAtom } from "@/utils"

import { LightboxImage } from "./LightboxImage"

// Hero height based on constrained width and aspect ratio
// max-w-xl => 36rem
// px-5 => 1.25rem * 2 = 2.5rem
const HERO_ASPECT_RATIO = (Hero.height / Hero.width).toFixed(5)
const HERO_HEIGHT = `((min(100vw, 36rem) - 2.5rem) * ${HERO_ASPECT_RATIO})`

const STICKY_END_PERCENT = 0.413
const SPACER_PERCENT = 1 - STICKY_END_PERCENT

export function HeroImage() {
  const setAnimationComplete = useSetAtom(heroAnimationCompleteAtom)
  return (
    // Add clip-path here for rounded corners even while image is sticky
    <div className="relative mx-5" style={{ clipPath: "inset(0 round 24px)" }}>
      {/*
      Scroll effect:
      Hero image is "sticky" as content scrolls over it, up to my eyes, then starts scrolling away.

      Hero image is wrapped in a sticky <div> *shorter* than itself. So, after this scroll distance,
      the hero image starts scrolling away.

      Then, add a spacer <div> so the wrapper is the true height of the hero image.
      */}
      <div
        className="sticky top-8"
        style={{
          height: `calc(${HERO_HEIGHT} * ${STICKY_END_PERCENT})`,
        }}>
        {/* Enter animation is defined here, instead of on root div, so the gray corner overlays aren't brightened */}
        <motion.div
          initial={{ filter: "brightness(2)", opacity: 0 }}
          animate={{ filter: "brightness(1)", opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => setAnimationComplete(true)}>
          <LightboxImage
            src={Hero.src}
            alt="Majestic man staring into the distance in Lisbon"
            width={Hero.width}
            height={Hero.height}
            priority={true}
          />
        </motion.div>
      </div>

      <div
        style={{
          height: `calc(${HERO_HEIGHT} * ${SPACER_PERCENT})`,
        }}></div>
    </div>
  )
}
