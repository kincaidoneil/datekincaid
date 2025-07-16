import { Heart } from "lucide-react"
import { motion } from "motion/react"
import FriendZoneDialog from "./FriendZoneDialog"
import { JSX } from "astro/jsx-runtime"

export default function ActionBanner({ children }: { children: JSX.Element }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: {
          transform: `translateY(100%)`,
        },
        visible: {
          transform: `translateY(0%)`,
        },
      }}
      className="sticky inset-x-0 bottom-0 z-30 w-full pb-6">
      <div className="mx-auto flex max-w-4xl flex-row items-end justify-around px-5">
        <button
          data-tally-width="500"
          data-tally-layout="modal"
          data-tally-open="wM5APk"
          className="relative grid h-14 w-36 cursor-pointer place-content-center overflow-clip rounded-full bg-linear-to-b from-pink-400 to-red-600 px-6 py-4 font-[Leap] text-[1.6rem] leading-none tracking-wider text-white uppercase shadow-xl transition active:scale-95">
          <Heart className="animate-float-down absolute top-0 left-1 origin-center stroke-white/70 blur-[1.5px]" />
          <Heart className="animate-float-up absolute right-2 -bottom-2 origin-center stroke-white/70 blur-[1.5px]" />
          Date
        </button>

        <FriendZoneDialog>{children}</FriendZoneDialog>
      </div>
    </motion.div>
  )
}
