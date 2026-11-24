import { antiqueNdwangCatalog, type AntiqueNdwangProduct, type GarmentSize } from '@/data/antiqueNdwangCatalog'

export type ShopifyMoney = { amount: string; currencyCode: string }
export type ShopifyImage = { url: string; altText: string | null; width: number | null; height: number | null }
export type ShopifyConnection<T> = { edges: Array<{ node: T }> }

export type ShopifyVariant = {
  id: string
  title: string
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
  price: ShopifyMoney
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  availableForSale: boolean
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney }
  fabricComposition: { value: string } | null
  careInstructions: { value: string } | null
  images: ShopifyConnection<ShopifyImage>
  variants: ShopifyConnection<ShopifyVariant>
}

export type ShopifyCollection = {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: ShopifyConnection<Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'description' | 'images' | 'priceRange'>>
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: { id: string; title: string; product: { title: string; handle: string } }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney }
  lines: ShopifyConnection<ShopifyCartLine>
}

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> }

const apiVersion = '2025-01'
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim()
const endpoint = storeDomain ? `https://${storeDomain}/api/${apiVersion}/graphql.json` : null
export const isShopifyConfigured = Boolean(endpoint && storefrontToken)

const money = (amount: number): ShopifyMoney => ({ amount: amount.toFixed(2), currencyCode: 'ZAR' })
const toLocalProduct = (product: AntiqueNdwangProduct): ShopifyProduct => {
  const handle = product.id
  const productImages = [product.frontImage, product.backImage].map((url, index) => ({
    url,
    altText: `${product.name}, ${index === 0 ? 'front' : 'back'} view`,
    width: 1024,
    height: 1024,
  }))
  const price = money(product.price)
  const variants = product.sizes.map((size: GarmentSize) => ({
    id: `local:${product.id}:${size}`,
    title: size,
    availableForSale: true,
    selectedOptions: [{ name: 'Size', value: size }],
    price,
  }))

  return {
    id: `local:${product.id}`,
    handle,
    title: product.name,
    description: product.description,
    productType: 'Heavyweight T-shirt',
    availableForSale: true,
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    fabricComposition: { value: `${product.fabric} · ${product.gsm} GSM` },
    careInstructions: { value: 'Wash inside out with similar colours. Do not iron directly over print.' },
    images: { edges: productImages.map((node) => ({ node })) },
    variants: { edges: variants.map((node) => ({ node })) },
  }
}

const localProducts = antiqueNdwangCatalog.map(toLocalProduct)
const localCollections: ShopifyCollection[] = [{
  id: 'local:collection:heavyweight-essentials',
  handle: 'heavyweight-essentials',
  title: 'Heavyweight essentials',
  description: 'Four graphic studies in heavyweight cotton, cut for a drop-shoulder boxy fit.',
  image: localProducts[0]?.images.edges[0]?.node ?? null,
  products: { edges: localProducts.map((product) => ({ node: {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    images: product.images,
    priceRange: product.priceRange,
  } })) },
}]

const localCarts = new Map<string, ShopifyCart>()

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyConfigured || !endpoint || !storefrontToken) {
    throw new Error('Shopify is not configured. Use getProductByHandle/getCollections for local preview data; checkout mutations are simulated in fallback mode.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontToken },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
  if (!response.ok) throw new Error(`Shopify Storefront API request failed (${response.status}).`)
  const result = await response.json() as ShopifyResponse<T>
  if (result.errors?.length) throw new Error(result.errors.map((error) => error.message).join('; '))
  if (!result.data) throw new Error('Shopify returned no data.')
  return result.data
}

const imageFields = `url(transform: { maxWidth: 2400, preferredContentType: WEBP }) altText width height`
const productFields = `
  id handle title description productType availableForSale
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  fabricComposition: metafield(namespace: "details", key: "fabric_composition") { value }
  careInstructions: metafield(namespace: "details", key: "care_instructions") { value }
  images(first: 30) { edges { node { ${imageFields} } } }
  variants(first: 100) { edges { node { id title availableForSale selectedOptions { name value } price { amount currencyCode } } } }
`

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  if (!isShopifyConfigured) return localCollections.slice(0, first)
  const data = await shopifyFetch<{ collections: ShopifyConnection<ShopifyCollection> }>(
    `query Collections($first: Int!) { collections(first: $first, sortKey: UPDATED_AT, reverse: true) { edges { node { id handle title description image { ${imageFields} } products(first: 12) { edges { node { id handle title description priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } images(first: 1) { edges { node { ${imageFields} } } } } } } } } }`,
    { first },
  )
  return data.collections.edges.map(({ node }) => node)
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  if (!isShopifyConfigured) return localCollections.find((collection) => collection.handle === handle) ?? localCollections[0] ?? null
  const data = await shopifyFetch<{ collectionByHandle: ShopifyCollection | null }>(
    `query CollectionByHandle($handle: String!) { collectionByHandle(handle: $handle) { id handle title description image { ${imageFields} } products(first: 50) { edges { node { id handle title description priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } images(first: 1) { edges { node { ${imageFields} } } } } } } } }`,
    { handle },
  )
  return data.collectionByHandle
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!isShopifyConfigured) {
    const product = localProducts.find((item) => item.handle === handle)
    return product ?? (localProducts[0] ? { ...localProducts[0], handle } : null)
  }
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    `query ProductByHandle($handle: String!) { productByHandle(handle: $handle) { ${productFields} } }`,
    { handle },
  )
  return data.productByHandle
}

const cartFields = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } } } } } }`

function localCart(lines: ShopifyCartLine[] = []): ShopifyCart {
  const total = lines.reduce((sum, line) => {
    const product = localProducts.find((item) => item.id === line.merchandise.product.handle)
    return sum + (product?.priceRange.minVariantPrice.amount ? Number(product.priceRange.minVariantPrice.amount) * line.quantity : 0)
  }, 0)
  return {
    id: 'local:antique-ndwang-cart',
    checkoutUrl: '#demo-checkout',
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    cost: { subtotalAmount: money(total), totalAmount: money(total) },
    lines: { edges: lines.map((node) => ({ node })) },
  }
}

export async function createCart(variantId?: string, quantity = 1): Promise<ShopifyCart> {
  if (!isShopifyConfigured) {
    const variantMatch = variantId?.match(/^local:(.+):(S|M|L|XL|XXL)$/)
    const product = variantMatch ? localProducts.find((item) => item.handle === variantMatch[1]) : null
    const lines: ShopifyCartLine[] = product && variantMatch ? [{
      id: `local:line:${product.id}:${variantMatch[2]}`,
      quantity,
      merchandise: { id: variantId!, title: variantMatch[2], product: { title: product.title, handle: product.handle } },
    }] : []
    const cart = localCart(lines)
    localCarts.set(cart.id, cart)
    return cart
  }
  const lines = variantId ? [{ merchandiseId: variantId, quantity }] : []
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ${cartFields} } userErrors { message } } }`,
    { input: { lines } },
  )
  const payload = data.cartCreate
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((error) => error.message).join('; '))
  if (!payload.cart) throw new Error('Shopify did not return a cart.')
  return payload.cart
}

export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart> {
  if (!isShopifyConfigured) {
    const existing = localCarts.get(cartId) ?? localCart()
    const nextLines = [...existing.lines.edges.map(({ node }) => node)]
    for (const line of lines) {
      const match = line.merchandiseId.match(/^local:(.+):(S|M|L|XL|XXL)$/)
      const product = match ? localProducts.find((item) => item.handle === match[1]) : null
      if (!match || !product) continue
      const lineId = `local:line:${product.id}:${match[2]}`
      const found = nextLines.find((item) => item.id === lineId)
      if (found) found.quantity += line.quantity
      else nextLines.push({ id: lineId, quantity: line.quantity, merchandise: { id: line.merchandiseId, title: match[2], product: { title: product.title, handle: product.handle } } })
    }
    const cart = localCart(nextLines)
    localCarts.set(cart.id, cart)
    return cart
  }
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { message } } }`,
    { cartId, lines },
  )
  const payload = data.cartLinesAdd
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((error) => error.message).join('; '))
  if (!payload.cart) throw new Error('Shopify did not return an updated cart.')
  return payload.cart
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<ShopifyCart> {
  if (!isShopifyConfigured) {
    const current = localCarts.get(cartId) ?? localCart()
    const updated = current.lines.edges.map(({ node }) => {
      const change = lines.find((line) => line.id === node.id)
      return change ? { ...node, quantity: change.quantity } : node
    }).filter((line) => line.quantity > 0)
    const cart = localCart(updated)
    localCarts.set(cart.id, cart)
    return cart
  }
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { message } } }`,
    { cartId, lines },
  )
  const payload = data.cartLinesUpdate
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((error) => error.message).join('; '))
  if (!payload.cart) throw new Error('Shopify did not return an updated cart.')
  return payload.cart
}
