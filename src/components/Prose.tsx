import { twMerge } from "tailwind-merge"

interface Props {
  Component?: keyof React.JSX.IntrinsicElements
  className?: string
  children: React.ReactNode
}

export function Prose({ Component = "article", className, children }: Props) {
  return (
    <Component
      style={{ fontVariantLigatures: "no-common-ligatures" }}
      className={twMerge(
        "prose prose-h1:text-6xl prose-h2:mb-12! prose-h2:text-2xl prose-h2:font-leap prose-h3:text-4xl prose-h4:text-2xl prose-a:text-indigo-800 prose-a:underline-offset-3 prose-headings:font-normal prose-p:leading-[1.75] prose-img:rounded-xl prose-p:text-lg font-serif",
        className,
      )}>
      {children}
    </Component>
  )
}
