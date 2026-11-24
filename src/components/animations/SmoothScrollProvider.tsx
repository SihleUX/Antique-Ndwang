'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const runLenis = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(runLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(runLenis)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  })

  return <>{children}</>
}
