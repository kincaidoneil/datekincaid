import { createFileRoute } from "@tanstack/react-router"
import {
  Cake,
  Ruler,
  MapPin,
  House,
  Baby,
  Landmark,
  School,
  Briefcase,
} from "lucide-react"
import { MotionConfig } from "motion/react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import { useLayoutEffect } from "react"

import Cat from "@/assets/cat.png?as=metadata"
import Chow from "@/assets/chow.jpg?as=metadata"
import Fam from "@/assets/fam.jpg?as=metadata"
import Melon from "@/assets/melon.jpg?as=metadata"
import RunningDay from "@/assets/running-day.jpg?as=metadata"
import RunningNight from "@/assets/running-night.jpg?as=metadata"
import RunningRain from "@/assets/running-rain.jpg?as=metadata"
import { ActionBanner } from "@/components/ActionBanner"
import { AnalyticsProvider } from "@/components/Analytics"
import { Chip } from "@/components/Chip"
import { FloatIntoView } from "@/components/FloatIntoView"
import { Header } from "@/components/Header"
import { HeroImage } from "@/components/HeroImage"
import { LightboxImage } from "@/components/LightboxImage"
import { Prose } from "@/components/Prose"
import LookingForCopy from "@/copy/looking-for.mdx"
import ValuesCopy from "@/copy/values.mdx"
import WhyCopy from "@/copy/why.mdx"

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    scripts: [
      {
        defer: true, // Faster & prevents hydration error
        src: "https://tally.so/widgets/embed.js",
      },
    ],
  }),
})

function Home() {
  useLayoutEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "body",
      children: "a[data-pswp-width]",
      pswpModule: () => import("photoswipe"),
      showAnimationDuration: 250,
      hideAnimationDuration: 250,
    })
    lightbox.init()

    return () => lightbox.destroy()
  }, [])

  return (
    <AnalyticsProvider>
      <MotionConfig reducedMotion="user">
        <main className="mx-auto max-w-xl pt-8 pb-12 font-serif @2xs:pt-20">
          <HeroImage />

          <Prose
            Component="article"
            className="relative z-10 bg-slate-50 px-5 pt-12">
            {/* This contains the sticky CTA banner */}
            <section>
              <Header />

              <section className="mb-8! grid grid-cols-2 gap-x-1 gap-y-1">
                <Chip Icon={Cake} alt="Age">
                  27
                </Chip>
                <Chip Icon={Ruler} alt="Height">
                  5' 8.75"
                </Chip>
                <Chip Icon={MapPin} alt="Location">
                  Brooklyn, NY
                </Chip>
                <Chip Icon={House} alt="Hometown">
                  Minneapolis, MN
                </Chip>
                <Chip Icon={Baby} alt="Wants children">
                  In 5+ years
                </Chip>
                <Chip Icon={Landmark} alt="Politics">
                  Liberal
                </Chip>
                <Chip Icon={School} alt="Education">
                  Northeastern University
                </Chip>
                <Chip Icon={Briefcase} alt="Work">
                  <span>
                    Founder at{" "}
                    <a
                      href="https://gathers.social?utm_source=date_kincaid"
                      target="_blank"
                      rel="noopener">
                      Gathers
                    </a>
                  </span>
                </Chip>
              </section>

              <section className="flex flex-col gap-4">
                <FloatIntoView>
                  <LightboxImage
                    src={RunningDay.src}
                    alt="Kincaid in motion, apparently smiling"
                    width={RunningDay.width}
                    height={RunningDay.height}
                  />
                </FloatIntoView>

                <FloatIntoView.Group className="grid grid-cols-2 gap-4">
                  <FloatIntoView.Item>
                    <LightboxImage
                      src={RunningNight.src}
                      alt="Man (shredded), running in the night (run club in Boston)"
                      width={RunningNight.width}
                      height={RunningNight.height}
                    />
                  </FloatIntoView.Item>

                  <FloatIntoView.Item>
                    <LightboxImage
                      src={RunningRain.src}
                      alt="Kincaid finishing a grueling race"
                      width={RunningRain.width}
                      height={RunningRain.height}
                    />
                  </FloatIntoView.Item>
                </FloatIntoView.Group>
              </section>

              <ValuesCopy />

              <h3>Relationships</h3>
              <section>
                <FloatIntoView.Group className="grid grid-cols-2 gap-x-4">
                  <FloatIntoView.Item>
                    <figure>
                      <LightboxImage
                        src={Fam.src}
                        alt="Kincaid smiling with his sister and dad"
                        width={Fam.width}
                        height={Fam.height}
                      />
                      <figcaption className="px-2 py-1 text-sm">
                        The fam 🙂
                      </figcaption>
                    </figure>
                  </FloatIntoView.Item>

                  <FloatIntoView.Item>
                    <LightboxImage
                      src={Chow.src}
                      alt="Kincaid supporting a friend"
                      width={Chow.width}
                      height={Chow.height}
                    />
                  </FloatIntoView.Item>
                </FloatIntoView.Group>

                <FloatIntoView>
                  <LightboxImage
                    src={Melon.src}
                    alt="Kincaid raising a melon"
                    width={Melon.width}
                    height={Melon.height}
                  />
                </FloatIntoView>

                <LookingForCopy />

                <FloatIntoView className="mt-8">
                  <LightboxImage
                    src={Cat.src}
                    alt="Kincaid in the wild"
                    width={Cat.width}
                    height={Cat.height}
                  />
                </FloatIntoView>
              </section>

              <div className="h-8 w-full"></div>

              <ActionBanner />
            </section>

            <section className="pt-64">
              <WhyCopy />
            </section>
          </Prose>
        </main>
      </MotionConfig>
    </AnalyticsProvider>
  )
}
