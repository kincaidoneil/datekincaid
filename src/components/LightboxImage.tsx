import { twMerge } from "tailwind-merge"
import { Image, ImageProps } from "@unpic/react"

type Props = ImageProps & {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: Props) {
  return (
    <a
      href={src}
      data-pswp-width={width}
      data-pswp-height={height}
      className="block">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading="eager"
        draggable={false}
        className={twMerge(
          "cursor-pointer rounded-3xl transition duration-150 active:scale-95",
          className,
        )}
        background="auto"
      />
    </a>
  )
}
