import type { LucideIcon } from "lucide-react"

interface Props {
  Icon: LucideIcon
  label: string
  children: React.ReactNode
}

/** One term/value pair. Render inside a <dl>. */
export function Chip({ Icon, label, children }: Props) {
  return (
    <div className="flex h-fit flex-row items-center gap-2.5 rounded-full py-1 font-sans leading-tight subpixel-antialiased ring-0">
      <Icon className="stroke-1.5 h-5.5 self-start" aria-hidden />
      {/* Hidden visually, but kept as text so search snippets and screen readers get the label */}
      <dt className="sr-only">{label}</dt>
      <dd className="mt-0! ps-0!">{children}</dd>
    </div>
  )
}
