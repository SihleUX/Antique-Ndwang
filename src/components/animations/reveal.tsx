'use client'

import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & { children: ReactNode; delay?: number }

export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} {...props}>{children}</motion.div>
}
