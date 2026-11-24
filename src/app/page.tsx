'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClothingRack3D } from '@/components/three/ClothingRack3D'

export default function HomePage() {
  const [videoFailed, setVideoFailed] = useState(false)

  return <div className="bg-alabaster">
    <section className="relative flex min-h-[calc(100svh-76px)] items-end overflow-hidden bg-[#282725] px-6 pb-12 pt-28 text-alabaster md:min-h-[calc(100svh-88px)] md:px-12 md:pb-16">
      <img src="/garments/an-nd-mascot-back.svg" alt="Antique Ndwang graphic tee collection" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      {!videoFailed && <video className="absolute inset-0 h-full w-full object-cover opacity-50" autoPlay muted loop playsInline preload="metadata" onError={() => setVideoFailed(true)} aria-label="Runway film"><source src="https://videos.pexels.com/video-files/854454/854454-hd_1920_1080_25fps.mp4" type="video/mp4" /></video>}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/65" />
      <div className="relative z-10 w-full"><p className="mb-5 text-[9px] uppercase tracking-[.28em] md:text-[10px]">Independent streetwear · Johannesburg</p><h1 className="font-display text-[clamp(4rem,14vw,13rem)] font-normal leading-[.76] tracking-[-.065em]">Wear your<br />own story.</h1><div className="mt-8 flex items-end justify-between gap-6"><a href="#clothing-rack" className="border-b border-alabaster/70 pb-2 text-[9px] uppercase tracking-[.2em]">Explore the tee study <span className="ml-7">↓</span></a><p className="hidden max-w-[190px] text-right text-[8px] uppercase leading-5 tracking-[.16em] md:block">Heavyweight cotton. Independent spirit.</p></div></div>
      <span className="absolute bottom-6 right-6 z-10 text-[8px] uppercase tracking-[.2em] md:bottom-8 md:right-12">Antique Ndwang · Est. Johannesburg</span>
    </section>

    <ClothingRack3D />

    <section className="grid gap-8 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28"><div><p className="text-[9px] uppercase tracking-[.22em] text-stone">A point of view</p><h2 className="mt-5 max-w-xl font-display text-5xl leading-[.95] md:text-7xl">Made for those who move differently.</h2></div><div className="flex max-w-lg flex-col justify-end"><p className="text-sm leading-7 text-[#555]">Antique Ndwang is an independent streetwear label rooted in self-expression. Every graphic is a reminder to take up space, trust your own instinct, and never dress for the background.</p><Link href="/story" className="mt-7 w-fit border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.18em]">The story behind the label ↗</Link></div></section>
    <footer className="flex flex-col gap-5 border-t border-obsidian/10 px-6 py-8 text-[8px] uppercase tracking-[.18em] text-stone md:flex-row md:justify-between md:px-12"><span>© 2025 Antique Ndwang</span><span>Made in Johannesburg, South Africa</span><a href="mailto:studio@antiquendwang.com">Contact the studio ↗</a></footer>
  </div>
}
