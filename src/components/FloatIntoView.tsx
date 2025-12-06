import { motion } from "motion/react"

function Group({
  children,
  staggerDelay = 0.25,
  ...props
}: React.ComponentProps<typeof motion.div> & { staggerDelay?: number }) {
  return (
    <motion.div
      {...props}
      transition={{
        staggerChildren: staggerDelay,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "100% 0% 0% 0%", amount: 0.35 }}>
      {children}
    </motion.div>
  )
}

function Item({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  // Use manual transforms for hardware acceleration - 120fps in Safari iOS
  const item = {
    hidden: { opacity: 0, transform: `translateY(30px)` },
    visible: {
      opacity: 1,
      transform: `translateY(0)`,
    },
  }

  return (
    <motion.div
      {...props}
      variants={item}
      transition={{
        ease: "easeOut", // Accelerate at beginning, finish gracefully
        duration: 0.3,
      }}>
      {children}
    </motion.div>
  )
}

function Single({ children, ...props }: React.ComponentProps<typeof Group>) {
  return (
    <Group {...props}>
      <Item>{children}</Item>
    </Group>
  )
}

export const FloatIntoView = Object.assign(Single, {
  Group,
  Item,
})
