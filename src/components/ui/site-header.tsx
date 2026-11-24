'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

type BagItem = { id: string; title: string; size: string; price: number; image: string; quantity: number }
type AddBagDetail = Omit<BagItem, 'quantity'>

const links = [
  { label: 'Shop all', href: '/shop', note: 'Objects to keep' },
  { label: 'Collections', href: '/collections', note: 'The current season' },
  { label: 'Lookbooks', href: '/lookbooks', note: 'Notes on form' },
  { label: 'Runway archive', href: '/runway', note: 'In motion' },
  { label: 'Our story', href: '/story', note: 'A point of view' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [items, setItems] = useState<BagItem[]>([])
  const count = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, cartOpen])

  useEffect(() => {
    const addItem = (event: Event) => {
      const detail = (event as CustomEvent<AddBagDetail>).detail
      if (!detail) return
      setItems((current) => {
        const existing = current.find((item) => item.id === detail.id && item.size === detail.size)
        return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...detail, quantity: 1 }]
      })
      setCartOpen(true)
      setMenuOpen(false)
    }
    window.addEventListener('antique:add-to-bag', addItem)
    return () => window.removeEventListener('antique:add-to-bag', addItem)
  }, [])

  function closeOverlays() { setMenuOpen(false); setCartOpen(false) }

  return <>
    <header className="relative z-40 flex h-[76px] items-center justify-between bg-alabaster px-6 md:h-[88px] md:px-12">
      <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => { setMenuOpen(!menuOpen); setCartOpen(false) }} className="flex w-20 flex-col gap-[6px] text-left text-[9px] uppercase tracking-[.2em]"><span className={`h-px w-5 bg-obsidian transition-transform ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} /><span className={`h-px w-5 bg-obsidian transition-transform ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} /><span className="mt-1">{menuOpen ? 'Close' : 'Menu'}</span></button>
      <Link href="/" onClick={closeOverlays} className="absolute left-1/2 -translate-x-1/2 font-display text-[25px] tracking-[-.055em] md:text-[30px]">ANTIQUE NDWANG</Link>
      <button onClick={() => { setCartOpen(true); setMenuOpen(false) }} aria-label="Open shopping bag" className="w-20 text-right text-[9px] uppercase tracking-[.2em]">Bag <span className="ml-1">({count})</span></button>
    </header>
    <AnimatePresence>{menuOpen && <motion.nav aria-label="Main navigation" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-30 flex flex-col justify-center bg-alabaster px-6 pt-16 md:px-16"><div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1fr_260px] md:items-end"><div>{links.map((link, index) => <motion.div key={link.href} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .12 + index * .07, duration: .45 }}><Link onClick={closeOverlays} href={link.href} className="group flex items-baseline justify-between border-b border-obsidian/15 py-3 font-display text-5xl tracking-[-.04em] hover:text-stone md:py-2 md:text-7xl"><span>{link.label}</span><span className="text-xs opacity-0 transition-opacity group-hover:opacity-100">↗</span></Link></motion.div>)}</div><div className="hidden pb-4 text-[9px] uppercase leading-6 tracking-[.18em] text-stone md:block"><p>Antique Ndwang</p><p>Independent fashion<br/>Johannesburg, South Africa</p><a className="mt-5 inline-block text-obsidian" href="mailto:studio@antiquendwang.com">Contact the studio ↗</a></div></div></motion.nav>}</AnimatePresence>
    <AnimatePresence>{cartOpen && <><motion.button aria-label="Close shopping bag" className="fixed inset-0 z-40 cursor-default bg-obsidian/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} /><motion.aside role="dialog" aria-modal="true" aria-label="Shopping bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .4, ease: [0.76, 0, 0.24, 1] }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-alabaster p-6 md:p-8"><div className="flex items-center justify-between border-b border-obsidian/15 pb-6"><p className="text-[10px] uppercase tracking-[.2em]">Your bag <span className="text-stone">({count})</span></p><button aria-label="Close shopping bag" onClick={() => setCartOpen(false)} className="text-2xl font-light">×</button></div>{items.length ? <div className="flex-1 overflow-y-auto py-5">{items.map((item) => <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-obsidian/10 py-4"><img src={item.image} alt="" className="h-28 w-20 bg-[#e7e4de] object-contain"/><div className="flex flex-1 flex-col justify-between"><div><p className="font-display text-xl">{item.title}</p><p className="mt-1 text-[9px] uppercase tracking-[.14em] text-stone">Size {item.size} · Qty {item.quantity}</p></div><p className="text-[10px]">R {(item.price * item.quantity).toLocaleString('en-ZA')}</p></div></div>)}</div> : <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="font-display text-4xl">A little room for something?</p><p className="mt-3 text-xs text-stone">Your bag is currently empty.</p><Link onClick={() => setCartOpen(false)} href="/shop" className="mt-8 border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.2em]">Explore the collection ↗</Link></div>}<div className="border-t border-obsidian/15 pt-5"><div className="mb-5 flex justify-between text-[10px] uppercase tracking-[.15em]"><span>Subtotal</span><span>R {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-ZA')}</span></div><p className="text-[9px] uppercase tracking-[.18em] text-stone">Complimentary shipping · Made with intention</p></div></motion.aside></>}</AnimatePresence>
  </>
}
