type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> }

const endpoint = process.env.SHOPIFY_STORE_DOMAIN
  ? `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`
  : null

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!endpoint || !token) throw new Error('Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.')

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
