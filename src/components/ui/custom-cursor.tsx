'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const move = (event: MouseEvent) => { setPosition({ x: event.clientX, y: event.clientY }); setVisible(true) }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave) }
  }, [])
  return <div aria-hidden="true" className={`pointer-events-none fixed left-0 top-0 z-[60] hidden h-3 w-3 rounded-full bg-obsidian mix-blend-difference transition-opacity duration-200 md:block ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transform: `translate3d(${position.x - 6}px, ${position.y - 6}px, 0)` }} />
}
