import Link from 'next/link'

const pieces = [
  { name: 'Sculpted wool coat', category: 'Outerwear', price: 'R 8,400', image: 'photo-1539109136881-3be0616acf4b' },
  { name: 'Soft form dress', category: 'Ready to wear', price: 'R 5,200', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Gathered cotton shirt', category: 'Essentials', price: 'R 2,600', image: 'photo-1483985988355-763728e1935b' },
  { name: 'The evening study', category: 'Ready to wear', price: 'R 6,800', image: 'photo-1529139574466-a303027c1d8b' },
]

export default function ShopPage() {
  return <div className="px-6 pb-20 pt-14 md:px-12 md:pt-20"><p className="text-[9px] uppercase tracking-[.22em] text-stone">Objects to keep · 01</p><div className="mt-5 flex flex-wrap items-end justify-between gap-6"><h1 className="font-display text-6xl tracking-[-.04em] md:text-8xl">Shop all</h1><p className="max-w-xs text-xs leading-6 text-stone">Considered pieces, made to be lived in and kept close.</p></div><div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-5">{pieces.map((piece) => <Link key={piece.name} href={`/products/${piece.name.toLowerCase().replaceAll(' ', '-')}`} className="group"><div className="aspect-[3/4] overflow-hidden bg-[#e6e2dc]"><div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(https://images.unsplash.com/${piece.image}?auto=format&fit=crop&w=800&q=80)` }} /></div><div className="mt-4 flex justify-between gap-2"><div><p className="font-display text-xl md:text-2xl">{piece.name}</p><p className="mt-1 text-[9px] uppercase tracking-[.15em] text-stone">{piece.category}</p></div><span className="pt-1 text-[10px]">{piece.price}</span></div></Link>)}</div></div>
}
