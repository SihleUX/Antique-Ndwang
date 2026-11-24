import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProductByHandle, isShopifyConfigured, type ShopifyProduct } from '@/lib/shopify'

type Props = { params: Promise<{ slug: string }> }

const editorialFallback = (slug: string): ShopifyProduct => {
  const title = slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return {
    id: '', handle: slug, title,
    description: 'A considered expression of form and feeling. Crafted in a limited run with care in every detail.',
    productType: 'Ready to wear', availableForSale: true,
    priceRange: { minVariantPrice: { amount: '5200.00', currencyCode: 'ZAR' }, maxVariantPrice: { amount: '5200.00', currencyCode: 'ZAR' } },
    fabricComposition: null, careInstructions: null,
    images: { edges: [
      { node: { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85', altText: `${title} full garment`, width: 1200, height: 1600 } },
      { node: { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85', altText: `${title} fabric detail`, width: 1200, height: 1600 } },
    ] },
    variants: { edges: [] },
  }
}

function formatPrice(product: ShopifyProduct) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductByHandle(slug) ?? (!isShopifyConfigured ? editorialFallback(slug) : null)
  if (!product) notFound()

  const images = product.images.edges.map(({ node }) => node)
  const sizes = [...new Set(product.variants.edges.flatMap(({ node }) => node.selectedOptions.filter((option) => option.name.toLowerCase() === 'size').map((option) => option.value)))]

  return (
    <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
      <section aria-label={`${product.title} garment photography`} className="space-y-1 bg-[#e8e5df] md:space-y-2">
        {images.length ? images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="relative min-h-[72svh] overflow-hidden bg-[#d6d1c9] md:min-h-[100svh]">
            <Image src={image.url} alt={image.altText || `${product.title} — ${index === 0 ? 'front view' : 'back view'}`} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 65vw" className="object-contain" />
            <span className="absolute bottom-5 left-5 text-[8px] uppercase tracking-[.18em] text-white mix-blend-difference md:bottom-8 md:left-8">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
          </div>
        )) : <div className="flex min-h-[70svh] items-center justify-center text-sm text-stone">Images coming soon</div>}
      </section>

      <aside className="h-fit px-6 pb-16 pt-10 md:sticky md:top-0 md:flex md:min-h-screen md:flex-col md:justify-center md:px-12 md:py-16">
        <Link href="/shop" className="text-[9px] uppercase tracking-[.18em] text-stone">← Shop all</Link>
        <p className="mt-12 text-[9px] uppercase tracking-[.2em] text-stone">Antique Ndwang · {product.productType || 'Ready to wear'}</p>
        <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.04em] md:text-6xl">{product.title}</h1>
        <p className="mt-5 text-sm">{formatPrice(product)}</p>
        <p className="mt-8 max-w-md text-xs leading-6 text-[#666]">{product.description}</p>
        {sizes.length > 0 && <div className="mt-10"><p className="mb-4 text-[9px] uppercase tracking-[.18em]">Select size</p><div className="flex flex-wrap gap-2">{sizes.map((size) => <button key={size} type="button" className="min-w-12 border border-obsidian/20 px-4 py-3 text-[10px] transition-colors hover:border-obsidian">{size}</button>)}</div></div>}
        {product.fabricComposition?.value && <div className="mt-10 border-t border-obsidian/15 pt-5"><h2 className="text-[9px] uppercase tracking-[.18em]">Fabric composition</h2><p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#666]">{product.fabricComposition.value}</p></div>}
        {product.careInstructions?.value && <div className="mt-6 border-t border-obsidian/15 pt-5"><h2 className="text-[9px] uppercase tracking-[.18em]">Care</h2><p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#666]">{product.careInstructions.value}</p></div>}
        <button type="button" disabled={!product.availableForSale} className="mt-10 w-full bg-obsidian py-4 text-[9px] uppercase tracking-[.2em] text-alabaster transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40">{product.availableForSale ? `Add to bag — ${formatPrice(product)}` : 'Sold out'}</button>
        <p className="mt-4 text-[8px] uppercase tracking-[.15em] text-stone">Complimentary shipping · Made with intention</p>
      </aside>
    </div>
  )
}
