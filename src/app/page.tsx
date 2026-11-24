'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pieces = [
  {
    name: 'Sculpted in silence',
    detail: 'Look 01 · Wool, sculpted by hand',
    slug: 'sculpted-wool-coat',
    image: 'photo-1539109136881-3be0616acf4b',
    position: 'center 30%',
    speed: -8,
  },
  {
    name: 'A softer structure',
    detail: 'Look 04 · Cotton voile',
    slug: 'soft-form-dress',
    image: 'photo-1534528741775-53994a69daeb',
    position: 'center 25%',
    speed: 10,
  },
  {
    name: 'The long afternoon',
    detail: 'Look 07 · Tailored suiting',
    slug: 'gathered-cotton-shirt',
    image: 'photo-1529139574466-a303027c1d8b',
    position: 'center 35%',
    speed: -12,
  },
  {
    name: 'Held in light',
    detail: 'Look 09 · Silk, naturally dyed',
    slug: 'the-evening-study',
    image: 'photo-1515886657613-9f3515b0c78f',
    position: 'center 25%',
    speed: 7,
  },
]

function LookbookGallery() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const gallery = section.current
    const strip = track.current
    if (!gallery || !strip) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, strip.scrollWidth - window.innerWidth)
      const trigger = {
        trigger: gallery,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }

      gsap.to(strip, { x: () => -distance(), ease: 'none', scrollTrigger: trigger })
      gsap.utils.toArray<HTMLElement>('[data-lookbook-image]').forEach((image) => {
        const speed = Number(image.dataset.parallaxSpeed ?? 0)
        gsap.fromTo(image, { xPercent: -speed }, {
          xPercent: speed,
          ease: 'none',
          scrollTrigger: { ...trigger, start: 'top top', end: () => `+=${distance()}` },
        })
      })
    })

    return () => mm.revert()
  }, { scope: section })

  return (
    <section ref={section} aria-label="Spring summer 2025 lookbook" className="relative flex h-[100svh] flex-col justify-center overflow-hidden bg-[#e8e5df] text-obsidian">
      <div className="absolute left-6 right-6 top-8 z-10 flex items-center justify-between md:left-12 md:right-12 md:top-10">
        <p className="text-[9px] uppercase tracking-[.22em]">Spring / Summer 2025</p>
        <p className="hidden text-[9px] uppercase tracking-[.22em] text-stone md:block">A study in becoming · 01 — 04</p>
        <Link href="/lookbooks" className="border-b border-obsidian/50 pb-1 text-[9px] uppercase tracking-[.18em]">Full lookbook ↗</Link>
      </div>
      <div ref={track} className="flex w-max items-center gap-5 px-[12vw] pt-8 md:gap-8 md:px-[15vw]">
        {pieces.map((piece, index) => (
          <Link key={piece.slug} href={`/products/${piece.slug}`} data-cursor="view-piece" className={`group block w-[72vw] max-w-[560px] shrink-0 ${index % 2 === 1 ? 'mt-16 md:mt-24' : '-mt-5 md:-mt-8'}`}>
            <div className="relative aspect-[.76] overflow-hidden bg-[#d5d0c8]">
              <Image
                src={`https://images.unsplash.com/${piece.image}?auto=format&fit=crop&w=1400&q=85`}
                alt={`${piece.name}, Antique Ndwang Spring Summer 2025 lookbook`}
                fill
                sizes="(max-width: 768px) 72vw, 560px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                style={{ objectPosition: piece.position }}
                data-lookbook-image
                data-parallax-speed={piece.speed}
              />
              <span className="absolute bottom-4 right-4 text-[9px] uppercase tracking-[.18em] text-white">0{index + 1} / 04</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl md:text-3xl">{piece.name}</h3>
              <p className="whitespace-nowrap text-[8px] uppercase tracking-[.14em] text-stone md:text-[9px]">{piece.detail}</p>
            </div>
          </Link>
        ))}
        <Link href="/lookbooks" className="grid h-44 w-[48vw] max-w-[360px] shrink-0 place-content-center border border-obsidian/20 text-center md:h-64">
          <span className="font-display text-4xl">Continue<br />the story</span>
          <span className="mt-4 text-[9px] uppercase tracking-[.18em]">Explore all lookbooks ↗</span>
        </Link>
      </div>
      <p className="absolute bottom-6 left-6 text-[8px] uppercase tracking-[.2em] text-stone md:bottom-8 md:left-12">Scroll to move through the collection</p>
    </section>
  )
}

export default function HomePage() {
  const hero = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!hero.current || !title.current) return
    const mm = gsap.matchMedia(hero)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(title.current, {
        scale: 0.72,
        y: -70,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: hero.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      })
    })
    return () => mm.revert()
  }, { scope: hero })

  return (
    <div>
      <section ref={hero} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#655f59] px-6 pb-12 pt-28 text-alabaster md:px-12 md:pb-16">
        <Image
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=85"
          alt="Runway look from the Antique Ndwang collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=85"
          aria-label="Muted runway film"
        >
          <source src="https://videos.pexels.com/video-files/854454/854454-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
        <div className="relative z-10 w-full">
          <p className="mb-5 text-[9px] uppercase tracking-[.28em] md:text-[10px]">Independent fashion · Johannesburg · 2025</p>
          <h1 ref={title} className="origin-left font-display text-[clamp(4rem,14vw,13rem)] font-normal leading-[.76] tracking-[-.065em]">A study<br />in becoming.</h1>
          <div className="mt-8 flex items-end justify-between gap-6">
            <Link href="/collections/first-form" className="border-b border-alabaster/70 pb-2 text-[9px] uppercase tracking-[.2em] transition-opacity hover:opacity-60">Enter the collection <span className="ml-7">↗</span></Link>
            <p className="hidden max-w-[180px] text-right text-[8px] uppercase leading-5 tracking-[.16em] md:block">Clothing as a quiet kind of knowing.</p>
          </div>
        </div>
        <span className="absolute bottom-6 right-6 z-10 text-[8px] uppercase tracking-[.2em] md:bottom-8 md:right-12">Scroll to explore ↓</span>
      </section>

      <section className="grid gap-10 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:gap-20 md:px-12 md:py-36">
        <div>
          <p className="text-[9px] uppercase tracking-[.24em] text-stone">A point of view</p>
          <h2 className="mt-6 max-w-lg font-display text-5xl leading-[.94] tracking-[-.04em] md:text-7xl">Clothing for the life you are becoming.</h2>
        </div>
        <div className="flex max-w-lg flex-col justify-end md:pb-2">
          <p className="text-sm leading-7 text-[#555]">Antique Ndwang explores the space between structure and softness. Each piece is an invitation to inhabit your own becoming — made with intention, worn with feeling.</p>
          <Link href="/story" className="mt-8 w-fit border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.2em]">The story behind the label <span className="ml-7">↗</span></Link>
        </div>
      </section>

      <LookbookGallery />

      <section className="grid md:grid-cols-2">
        <Link href="/shop" data-cursor="view-piece" className="group relative flex min-h-[68svh] items-end overflow-hidden bg-[#b9b1a6] p-8 text-alabaster md:p-12">
          <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=85" alt="A considered look from the current collection" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <span className="relative"><span className="block text-[9px] uppercase tracking-[.22em]">Objects to keep</span><span className="mt-3 block font-display text-6xl">The collection</span></span>
        </Link>
        <Link href="/story" className="flex min-h-[55svh] flex-col justify-between bg-[#dedbd4] p-8 md:min-h-[68svh] md:p-12">
          <p className="text-[9px] uppercase tracking-[.22em] text-stone">Made with intention · South Africa</p>
          <div><p className="max-w-lg font-display text-5xl leading-[.95] md:text-7xl">“The most meaningful pieces make room for you.”</p><span className="mt-8 inline-block border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.2em]">Meet the studio ↗</span></div>
        </Link>
      </section>

      <footer className="flex flex-col gap-6 px-6 py-10 text-[8px] uppercase tracking-[.18em] text-stone md:flex-row md:justify-between md:px-12"><span>© 2025 Antique Ndwang</span><span>Made with intention · Johannesburg, South Africa</span><a href="mailto:studio@antiquendwang.com">Contact the studio ↗</a></footer>
    </div>
  )
}
