import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const title = slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')
  return <div className="px-6 pb-20 pt-14 md:px-12 md:pt-20"><Link href="/collections" className="text-[9px] uppercase tracking-[.2em] text-stone">← All collections</Link><p className="mt-14 text-[9px] uppercase tracking-[.2em] text-stone">Collection · 2025</p><h1 className="mt-4 font-display text-6xl tracking-[-.04em] md:text-8xl">{title}</h1><p className="mt-6 max-w-md text-sm leading-7 text-stone">An exploration of quiet structure and considered softness. Discover the pieces in this season’s collection.</p><div className="mt-12 aspect-[16/8] bg-[#d2cbc1] bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85)" }} /><Link href="/shop" className="mt-8 inline-block border-b border-obsidian pb-2 text-[9px] uppercase tracking-[.2em]">Shop the collection <span className="ml-5">↗</span></Link></div>
}
