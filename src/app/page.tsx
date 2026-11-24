import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <section className="relative flex min-h-[calc(100svh-76px)] items-end overflow-hidden bg-[#81796f] px-6 pb-12 text-alabaster md:min-h-[calc(100svh-88px)] md:px-12 md:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05)_20%,rgba(0,0,0,.45)_100%),url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-[center_35%]" />
        <div className="relative z-10 max-w-3xl">
          <p className="mb-5 text-[10px] uppercase tracking-[.28em]">Collection 01 — 2025</p>
          <h1 className="font-display text-6xl font-normal leading-[.9] tracking-[-.04em] md:text-9xl">The shape<br />of becoming.</h1>
          <Link href="/collections/first-form" className="mt-8 inline-flex border-b border-alabaster/70 pb-2 text-[10px] uppercase tracking-[.2em] transition-opacity hover:opacity-60">Discover the collection <span className="ml-8">↗</span></Link>
        </div>
        <p className="absolute bottom-5 right-6 z-10 hidden text-[9px] uppercase tracking-[.2em] md:block md:right-12">Antique Ndwang · Johannesburg</p>
      </section>
      <section className="grid gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:gap-20 md:px-12 md:py-32">
        <div><p className="text-[10px] uppercase tracking-[.24em] text-stone">A point of view</p><h2 className="mt-6 max-w-md font-display text-5xl leading-[.95] md:text-7xl">Clothing as a quiet kind of knowing.</h2></div>
        <div className="flex max-w-lg flex-col justify-end"><p className="text-sm leading-7 text-[#555]">Antique Ndwang explores the space between structure and softness. Each piece is an invitation to inhabit your own becoming — made with intention, worn with feeling.</p><Link href="/story" className="mt-8 w-fit border-b border-obsidian pb-2 text-[10px] uppercase tracking-[.2em]">Our story <span className="ml-8">↗</span></Link></div>
      </section>
      <section className="grid md:grid-cols-2">
        <Link href="/shop" className="group relative flex min-h-[65vh] items-end overflow-hidden bg-[#b9b1a6] p-8 text-alabaster md:p-12"><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.45)),url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"/><div className="relative"><p className="text-[10px] uppercase tracking-[.24em]">Objects to keep</p><h2 className="mt-3 font-display text-6xl">The collection</h2></div></Link>
        <Link href="/lookbooks" className="group relative flex min-h-[65vh] items-end overflow-hidden bg-[#81776d] p-8 text-alabaster md:p-12"><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.4)),url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"/><div className="relative"><p className="text-[10px] uppercase tracking-[.24em]">Notes on form</p><h2 className="mt-3 font-display text-6xl">The journal</h2></div></Link>
      </section>
      <footer className="flex flex-col gap-6 px-6 py-10 text-[9px] uppercase tracking-[.18em] text-stone md:flex-row md:justify-between md:px-12"><span>© 2025 Antique Ndwang</span><span>Made with intention · Johannesburg, South Africa</span><a href="mailto:studio@antiquendwang.com">Contact the studio ↗</a></footer>
    </div>
  )
}
