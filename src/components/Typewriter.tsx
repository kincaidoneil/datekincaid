import { motion } from "motion/react"
import React, { useMemo } from "react"

import { useFontsReady } from "@/hooks"

interface CharToken {
  char: string
  delay: number // Cumulative delay in seconds
}

type WordGroup =
  | { type: "word"; chars: CharToken[] }
  | { type: "element"; element: React.ReactNode }

const charVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { delay, duration: 0 },
  }),
}

interface TypewriterProps {
  children: React.ReactNode
  play?: boolean
  onComplete?: () => void
  charDelay?: number
  punctuationDelay?: number
  margin?: string
}

export function Typewriter({
  children,
  play = true,
  onComplete,
  charDelay = 50,
  punctuationDelay = 400,
  margin,
}: TypewriterProps) {
  const fontsReady = useFontsReady()
  const shouldAnimate = play && fontsReady

  // Tokenize children into word groups (so words wrap correctly) -> then into characters
  const wordGroups = useMemo(() => {
    const childArray = React.Children.toArray(children)
    const groups: WordGroup[] = []
    let cumulative = 0
    let charsInSentence = 0

    childArray.forEach((child) => {
      if (typeof child === "string") {
        const words = child.split(" ")

        words.forEach((word) => {
          if (word.length === 0) return

          const wordChars: CharToken[] = []
          for (let i = 0; i < word.length; i++) {
            const char = word[i]
            const baseDelay = [",", ".", "!", "?"].includes(char)
              ? punctuationDelay
              : charDelay

            // Gradual slowdown: longer sentence = slower typing, up to 1.6x
            // 2% slower every character, up to 1.6x
            const slowdownFactor = Math.min(1 + 0.02 * charsInSentence, 1.6)
            const modifiedDelay = baseDelay * slowdownFactor

            wordChars.push({
              char,
              delay: cumulative / 1000,
            })

            cumulative += modifiedDelay

            // Reset sentence counter on sentence-ending punctuation
            if ([".", "!", "?"].includes(char)) {
              charsInSentence = 0
            } else {
              charsInSentence++
            }
          }

          groups.push({ type: "word", chars: wordChars })
        })
      } else {
        groups.push({ type: "element", element: child })
      }
    })

    return groups
  }, [children, charDelay, punctuationDelay])

  return (
    <motion.span
      initial="hidden"
      whileInView={shouldAnimate ? "visible" : "hidden"}
      viewport={{ once: true, amount: 0.5, margin }}
      onAnimationComplete={(definition) =>
        definition === "visible" && onComplete?.()
      }>
      {wordGroups.map((group, groupIdx) => (
        <React.Fragment key={groupIdx}>
          {group.type === "element" ? (
            group.element
          ) : (
            <>
              <span className="inline-block">
                {group.chars.map((token, charIdx) => (
                  <motion.span
                    key={charIdx}
                    custom={token.delay}
                    variants={charVariants}>
                    {token.char}
                  </motion.span>
                ))}
              </span>{" "}
            </>
          )}
        </React.Fragment>
      ))}
    </motion.span>
  )
}
