import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const sanity = projectId && dataset
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: true })
  : null

const imageBuilder = sanity ? imageUrlBuilder(sanity) : null

export function sanityImageUrl(source: SanityImageSource): string {
  if (!imageBuilder) throw new Error('Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.')
  return imageBuilder.image(source).auto('format').url()
}

export async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanity) throw new Error('Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.')
  return sanity.fetch<T>(query, params)
}

export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  caption?: string
}

export interface LookbookCampaign {
  _id: string
  title: string
  slug: { current: string }
  season?: string
  year?: number
  introduction?: string
  heroImage?: SanityImage
  gallery?: Array<SanityImage & { _key?: string }>
  publishedAt?: string
}

export interface EditorialStory {
  _id: string
  title: string
  slug: { current: string }
  dek?: string
  heroImage?: SanityImage
  body?: Array<{ _key?: string; _type: string; [key: string]: unknown }>
  publishedAt?: string
  author?: string
}
