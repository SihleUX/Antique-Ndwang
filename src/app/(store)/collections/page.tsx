import Link from 'next/link'

const collections = [{ name: 'First form', slug: 'first-form', season: 'Spring / Summer 2025', image: 'photo-1515886657613-9f3515b0c78f' }, { name: 'Soft architecture', slug: 'soft-architecture', season: 'Autumn / Winter 2024', image: 'photo-1529139574466-a303027c1d8b' }]

export default function CollectionsPage() {
  return <div className="px-6 pb-20 pt-14 md:px-12 md:pt-20"><p className="text-[9px] uppercase tracking-[.22em] text-stone">A study in seasons</p><h1 className="mt-5 font-display text-6xl tracking-[-.04em] md:text-8xl">Collections</h1><div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2">{collections.map((collection) => <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group"><div className="aspect-[4/5] overflow-hidden bg-[#d6d0c8]"><div className="h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(https://images.unsplash.com/${collection.image}?auto=format&fit=crop&w=1400&q=85)` }} /></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-stone">{collection.season}</p><h2 className="mt-2 font-display text-4xl">{collection.name}</h2></div><span className="text-sm">↗</span></div></Link>)}</div></div>
}
