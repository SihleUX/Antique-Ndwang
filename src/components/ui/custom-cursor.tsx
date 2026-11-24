'use client'

import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const element = cursor.current
    if (!element || !window.matchMedia('(pointer: fine)').matches) return

    const moveX = gsap.quickTo(element, 'x', { duration: 0.32, ease: 'power3.out' })
    const moveY = gsap.quickTo(element, 'y', { duration: 0.32, ease: 'power3.out' })
    const move = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)
    }
    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor="view-piece"]') : null
      setActive(Boolean(target))
      setLabel(target ? (target.dataset.cursorLabel ?? 'VIEW PIECE') : '')
    }
    const leave = () => setActive(false)

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', over)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', over)
      document.removeEventListener('mouseleave', leave)
      gsap.killTweensOf(element)
    }
  }, [])

  return (
    <div
      ref={cursor}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[70] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-alabaster text-[8px] font-medium uppercase tracking-[.12em] text-obsidian mix-blend-difference transition-[width,height,background-color] duration-300 md:flex ${active ? 'h-24 w-24' : ''}`}
    >
      {active && <span className="whitespace-nowrap">{label}</span>}
    </div>
  )
}
