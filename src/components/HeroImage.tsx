import { motion } from "motion/react"
import { LightboxImage } from "./LightboxImage"

import Hero from "@/assets/lisbon.jpg?as=metadata"

// Hero height based on constrained width and aspect ratio
// max-w-xl => 36rem
// px-5 => 1.25rem * 2 = 2.5rem
const HERO_WIDTH = Hero.width
const HERO_HEIGHT = Hero.height
const heroAspectRatio = (HERO_HEIGHT / HERO_WIDTH).toFixed(5)
const heroHeight = `((min(100vw, 36rem) - 2.5rem) * ${heroAspectRatio})`

const STICKY_END_PERCENT = 0.413
const SPACER_PERCENT = 1 - STICKY_END_PERCENT

export function HeroImage() {
  return (
    /*
      Scroll effect:
      Hero image is "sticky" as content scrolls over it, up to my eyes, then starts scrolling away.

      Hero image is wrapped in a sticky <div> *shorter* than itself. So, after this scroll distance,
      the hero image starts scrolling away.

      Then, add a spacer <div> so the wrapper is the true height of the hero image.
    */
    <motion.div
      className="relative"
      initial={{ filter: "brightness(2)", opacity: 0 }}
      animate={{ filter: "brightness(1)", opacity: 1 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}>
      <div
        className="sticky top-8 z-0 px-5"
        style={{
          height: `calc(${heroHeight} * ${STICKY_END_PERCENT})`,
        }}>
        <LightboxImage
          src={Hero.src}
          alt="Majestic man staring into the distance in Lisbon"
          width={Hero.width}
          height={Hero.height}
          priority={true}
        />
      </div>

      <div style={{ height: `calc(${heroHeight} * ${SPACER_PERCENT})` }}></div>

      {/*
        Inverted corners overlaid on hero image to maintain rounded corners, even while sticky/"shrinking".
        Refer to this SVG arc reference:
        https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths#arcs

        Negative margins are to prevent a glitch in Safari iOS where a sliver of the underlying image
        is visible while scrolling because it doesn't properly overlap.
      */}
      <svg
        className="absolute bottom-0 left-5 -mb-[0.2px] -ml-[0.2px] h-6 w-6"
        viewBox="0 0 24 24">
        <path
          d="M 0 0 A 24 24, 0, 0, 0, 24 24 L 0 24 Z"
          className="fill-slate-50"></path>
      </svg>

      <svg
        className="absolute right-5 bottom-0 -mr-[0.2px] -mb-[0.2px] h-6 w-6"
        viewBox="0 0 24 24">
        <path
          d="M 24 0 A 24 24, 0, 0, 1, 0 24 L 24 24 Z"
          className="fill-slate-50"></path>
      </svg>
    </motion.div>
  )
}
