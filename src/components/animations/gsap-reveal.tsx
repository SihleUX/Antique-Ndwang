'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, type ReactNode } from 'react'

gsap.registerPlugin(useGSAP)

export function GsapReveal({ children, className }: { children: ReactNode; className?: string }) {
  const container = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.from('[data-gsap-reveal]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' })
  }, { scope: container })
  return <div ref={container} className={className}>{children}</div>
}
