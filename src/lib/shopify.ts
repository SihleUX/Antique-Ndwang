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
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const endpoint = storeDomain ? `https://${storeDomain}/api/${apiVersion}/graphql.json` : null

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!endpoint || !token) throw new Error('Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
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
  const data = await shopifyFetch<{ collections: ShopifyConnection<ShopifyCollection> }>(
    `query Collections($first: Int!) { collections(first: $first, sortKey: UPDATED_AT, reverse: true) { edges { node { id handle title description image { ${imageFields} } products(first: 12) { edges { node { id handle title description priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } images(first: 1) { edges { node { ${imageFields} } } } } } } } } }`,
    { first },
  )
  return data.collections.edges.map(({ node }) => node)
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collectionByHandle: ShopifyCollection | null }>(
    `query CollectionByHandle($handle: String!) { collectionByHandle(handle: $handle) { id handle title description image { ${imageFields} } products(first: 50) { edges { node { id handle title description priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } images(first: 1) { edges { node { ${imageFields} } } } } } } } }`,
    { handle },
  )
  return data.collectionByHandle
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    `query ProductByHandle($handle: String!) { productByHandle(handle: $handle) { ${productFields} } }`,
    { handle },
  )
  return data.productByHandle
}

const cartFields = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } } } } } }`

export async function createCart(variantId?: string, quantity = 1): Promise<ShopifyCart> {
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
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { message } } }`,
    { cartId, lines },
  )
  const payload = data.cartLinesUpdate
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((error) => error.message).join('; '))
  if (!payload.cart) throw new Error('Shopify did not return an updated cart.')
  return payload.cart
}
