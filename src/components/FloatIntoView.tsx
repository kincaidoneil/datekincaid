import { motion } from "motion/react"

function Group({
  children,
  staggerDelay = 0.15,
  ...props
}: React.ComponentProps<typeof motion.div> & { staggerDelay?: number }) {
  return (
    <motion.div
      {...props}
      transition={{
        ease: "easeOut",
        duration: 0.5,
        staggerChildren: staggerDelay,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "1000px 0px -100px 0px", amount: 0.35 }}>
      {children}
    </motion.div>
  )
}

function Item({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  const item = {
    hidden: { opacity: 0, y: 30, position: "relative", z: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div {...props} variants={item}>
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
