'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type TextRevealProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  delay?: number
}

/** Reveals each word upward behind a mask as the heading enters the viewport. */
export function TextReveal({ text, as: Tag = 'h2', className, delay = 0 }: TextRevealProps) {
  const container = useRef<HTMLElement>(null)
  const words = text.trim().split(/\s+/)

  useGSAP(() => {
    const media = gsap.matchMedia(container)

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '[data-text-reveal-word]',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          delay,
          stagger: 0.045,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 88%',
            once: true,
          },
        },
      )
    })

    return () => media.revert()
  }, { scope: container, dependencies: [text, delay] })

  return (
    <Tag ref={container as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-[0.12em]">
          <span data-text-reveal-word className="inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </Tag>
  )
}
