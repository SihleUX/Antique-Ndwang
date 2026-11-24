'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClothingRack3D } from '@/components/three/ClothingRack3D'

export default function HomePage() {
  const [videoFailed, setVideoFailed] = useState(false)

  return <div className="bg-alabaster">
    <section className="relative flex min-h-[calc(100svh-76px)] items-end overflow-hidden bg-[#080808] px-6 pb-12 pt-28 text-alabaster md:min-h-[calc(100svh-88px)] md:px-12 md:pb-16">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_38%,rgba(217,35,35,.18),transparent_35%),linear-gradient(135deg,#151515_0%,#050505_58%,#171411_100%)]" />
      {!videoFailed && <video className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen" autoPlay muted loop playsInline preload="metadata" onError={() => setVideoFailed(true)} aria-label="Antique Ndwang runway film"><source src="/videos/runway.mp4" type="video/mp4" /></video>}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.14] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,.16)_3px),repeating-linear-gradient(90deg,transparent,transparent_7px,rgba(255,255,255,.04)_8px)] [background-size:100%_5px,9px_100%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-orbit absolute -right-[20vw] top-[8%] h-[72vw] w-[72vw] rounded-full border border-white/10 md:h-[54vw] md:w-[54vw]" />
        <div className="hero-orbit hero-orbit-delayed absolute -right-[12vw] top-[15%] h-[56vw] w-[56vw] rounded-full border border-[#d92323]/25 md:h-[42vw] md:w-[42vw]" />
      </div>
      <div className="relative z-10 w-full">
        <p className="mb-5 text-[9px] uppercase tracking-[.28em] text-white/65 md:text-[10px]">Independent streetwear · Johannesburg</p>
        <h1 className="hero-title font-display text-[clamp(3.5rem,15.2vw,14rem)] font-normal uppercase leading-[.72] tracking-[-.075em]">ANTIQUE<br /><span className="hero-title-second inline-block">NDWANG</span></h1>
        <div className="mt-8 flex items-end justify-between gap-6">
          <a href="#clothing-rack" className="border-b border-alabaster/70 pb-2 text-[9px] uppercase tracking-[.2em]">Explore the tee study <span className="ml-7">↓</span></a>
          <p className="hidden max-w-[190px] text-right text-[8px] uppercase leading-5 tracking-[.16em] text-white/60 md:block">Heavyweight cotton. Independent spirit.</p>
        </div>
      </div>
      <span className="absolute bottom-6 right-6 z-10 text-[8px] uppercase tracking-[.2em] text-white/60 md:bottom-8 md:right-12">Antique Ndwang · Est. Johannesburg</span>
      <span className="absolute right-6 top-1/3 hidden -rotate-90 text-[8px] uppercase tracking-[.28em] text-white/40 md:block">Raw form / 280 GSM</span>
    </section>

    <ClothingRack3D />

    <section className="grid gap-8 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28"><div><p className="text-[9px] uppercase tracking-[.22em] text-stone">A point of view</p><h2 className="mt-5 max-w-xl font-display text-5xl leading-[.95] md:text-7xl">Made for those who move differently.</h2></div><div className="flex max-w-lg flex-col justify-end"><p className="text-sm leading-7 text-[#555]">Antique Ndwang is an independent streetwear label rooted in self-expression. Every graphic is a reminder to take up space, trust your own instinct, and never dress for the background.</p><Link href="/story" className="mt-7 w-fit border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.18em]">The story behind the label ↗</Link></div></section>
    <footer className="flex flex-col gap-5 border-t border-obsidian/10 px-6 py-8 text-[8px] uppercase tracking-[.18em] text-stone md:flex-row md:justify-between md:px-12"><span>© 2025 Antique Ndwang</span><span>Made in Johannesburg, South Africa</span><a href="mailto:studio@antiquendwang.com">Contact the studio ↗</a></footer>
  </div>
}
