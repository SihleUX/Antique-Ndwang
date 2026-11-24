import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim()

export const sanity = projectId && dataset
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: true })
  : null

const imageBuilder = sanity ? imageUrlBuilder(sanity) : null

export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  caption?: string
  fallbackUrl?: string
}

export function sanityImageUrl(source: SanityImageSource | SanityImage): string {
  if ('fallbackUrl' in source && source.fallbackUrl) return source.fallbackUrl
  if (!imageBuilder) return '/garments/an-nd-mascot-back.svg'
  return imageBuilder.image(source as SanityImageSource).auto('format').url()
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

const sampleImage = (alt: string, file: string): SanityImage => ({
  _type: 'image',
  asset: { _ref: 'image-local-placeholder-1200x1600-jpg', _type: 'reference' },
  alt,
  fallbackUrl: `/garments/${file}`,
})

export const sampleLookbookCampaigns: LookbookCampaign[] = [{
  _id: 'sample-lookbook-first-form',
  title: 'First form',
  slug: { current: 'first-form' },
  season: 'Spring / Summer',
  year: 2025,
  introduction: 'A study in proportion, character, and the freedom of taking up space.',
  heroImage: sampleImage('Antique Ndwang graphic tee, back view', 'an-nd-mascot-back.svg'),
  gallery: [
    { ...sampleImage('Standing Out tee, back graphic', 'standing-out-back.svg'), _key: 'standing-out' },
    { ...sampleImage('Oversized Character tee, back view', 'character-back-back.svg'), _key: 'character-back' },
    { ...sampleImage('Stretched Type tee, back graphic', 'stretched-type-back.svg'), _key: 'stretched-type' },
  ],
  publishedAt: '2025-03-01T00:00:00Z',
}]

export const sampleEditorialStories: EditorialStory[] = [{
  _id: 'sample-story-own-story',
  title: 'Wear your own story',
  slug: { current: 'wear-your-own-story' },
  dek: 'Independent streetwear for those who move differently.',
  heroImage: sampleImage('Antique Ndwang character emblem', 'character-back-front.svg'),
  author: 'Antique Ndwang Studio',
  publishedAt: '2025-03-01T00:00:00Z',
  body: [{ _key: 'story-intro', _type: 'block', children: [{ _type: 'span', text: 'Made in Johannesburg. Designed to be seen.' }] }],
}]

export async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanity) {
    const normalized = query.toLowerCase()
    if (normalized.includes('lookbookcampaign') || normalized.includes('lookbook')) return sampleLookbookCampaigns as T
    if (normalized.includes('editorialstory') || normalized.includes('editorialstory') || normalized.includes('editorial')) return sampleEditorialStories as T
    return [] as T
  }
  return sanity.fetch<T>(query, params)
}

export async function getLookbookCampaigns(): Promise<LookbookCampaign[]> {
  return sanity
    ? sanity.fetch<LookbookCampaign[]>('*[_type == "lookbookCampaign"] | order(publishedAt desc)')
    : sampleLookbookCampaigns
}

export async function getEditorialStories(): Promise<EditorialStory[]> {
  return sanity
    ? sanity.fetch<EditorialStory[]>('*[_type == "editorialStory"] | order(publishedAt desc)')
    : sampleEditorialStories
}
