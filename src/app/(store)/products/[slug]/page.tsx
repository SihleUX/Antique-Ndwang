import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const title = slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')
  return <div className="grid min-h-[70vh] md:grid-cols-2"><div className="min-h-[65vh] bg-[#ded9d1] bg-cover bg-center md:min-h-[calc(100vh-88px)]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85)" }} /><div className="flex flex-col justify-center px-6 py-14 md:px-16"><Link href="/shop" className="text-[9px] uppercase tracking-[.2em] text-stone">← Shop all</Link><p className="mt-14 text-[9px] uppercase tracking-[.2em] text-stone">Antique Ndwang · Ready to wear</p><h1 className="mt-4 font-display text-5xl md:text-7xl">{title}</h1><p className="mt-5 text-sm">R 5,200</p><p className="mt-8 max-w-sm text-xs leading-6 text-stone">A considered expression of form and feeling. Crafted in a limited run with care in every detail.</p><button className="mt-10 w-full max-w-sm bg-obsidian py-4 text-[9px] uppercase tracking-[.2em] text-alabaster transition-opacity hover:opacity-75">Add to bag — R 5,200</button><p className="mt-4 text-[9px] uppercase tracking-[.15em] text-stone">Complimentary shipping · Made with intention</p></div></div>
}
