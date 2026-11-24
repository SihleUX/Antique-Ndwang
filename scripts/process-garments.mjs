#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const inputDir = path.join(root, 'raw-mockups')
const outputDir = path.join(root, 'public', 'garments')
const targetSize = 1024

const garments = [
  { source: 'an-nd-tee.png', slug: 'an-nd-tee' },
  { source: 'dont-be-afraid-tee.png', slug: 'dont-be-afraid-tee' },
  { source: 'mascot-tee.png', slug: 'mascot-tee' },
  { source: 'stretched-logo-tee.png', slug: 'stretched-logo-tee' },
]

// Checkerboard pixels are usually neutral and light. The flood-fill is seeded
// only at the image edges, so white ink surrounded by the dark shirt is kept.
function isBackground(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const luminance = (r * 0.2126) + (g * 0.7152) + (b * 0.0722)
  return luminance >= 168 && max - min <= 32
}

function removeEdgeBackground(data, width, height, channels) {
  if (channels < 3) throw new Error('Expected an RGB or RGBA source image.')
  const pixelCount = width * height
  const background = new Uint8Array(pixelCount)
  const queue = new Int32Array(pixelCount)
  let head = 0
  let tail = 0

  const enqueueIfBackground = (index) => {
    if (background[index]) return
    const offset = index * channels
    if (!isBackground(data[offset], data[offset + 1], data[offset + 2])) return
    background[index] = 1
    queue[tail++] = index
  }

  for (let x = 0; x < width; x++) {
    enqueueIfBackground(x)
    enqueueIfBackground((height - 1) * width + x)
  }
  for (let y = 1; y < height - 1; y++) {
    enqueueIfBackground(y * width)
    enqueueIfBackground(y * width + width - 1)
  }

  while (head < tail) {
    const index = queue[head++]
    const x = index % width
    const y = Math.floor(index / width)
    if (x > 0) enqueueIfBackground(index - 1)
    if (x + 1 < width) enqueueIfBackground(index + 1)
    if (y > 0) enqueueIfBackground(index - width)
    if (y + 1 < height) enqueueIfBackground(index + width)
  }

  // Anti-alias a one-pixel neutral fringe around the keyed region. This makes
  // the cutout smoother without touching disconnected artwork inside the tee.
  const output = Buffer.alloc(pixelCount * 4)
  const backgroundLevel = 220
  for (let index = 0; index < pixelCount; index++) {
    const sourceOffset = index * channels
    const outputOffset = index * 4
    const r = data[sourceOffset]
    const g = data[sourceOffset + 1]
    const b = data[sourceOffset + 2]
    const sourceAlpha = channels >= 4 ? data[sourceOffset + 3] : 255

    if (background[index]) {
      output[outputOffset] = r
      output[outputOffset + 1] = g
      output[outputOffset + 2] = b
      output[outputOffset + 3] = 0
      continue
    }

    let touchesBackground = false
    const x = index % width
    const y = Math.floor(index / width)
    if (x > 0 && background[index - 1]) touchesBackground = true
    if (x + 1 < width && background[index + 1]) touchesBackground = true
    if (y > 0 && background[index - width]) touchesBackground = true
    if (y + 1 < height && background[index + width]) touchesBackground = true

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const luminance = (r * 0.2126) + (g * 0.7152) + (b * 0.0722)
    const neutralFringe = touchesBackground && max - min <= 38 && luminance > 24
    const alpha = neutralFringe
      ? Math.round(sourceAlpha * Math.max(0, Math.min(1, 1 - luminance / backgroundLevel)))
      : sourceAlpha

    output[outputOffset] = r
    output[outputOffset + 1] = g
    output[outputOffset + 2] = b
    output[outputOffset + 3] = alpha
  }
  return output
}

async function processGarment({ source, slug }) {
  const sourcePath = path.join(inputDir, source)
  const { data: raw, info } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const rgba = removeEdgeBackground(raw, info.width, info.height, info.channels)
  const cleanPng = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  const halfWidth = Math.floor(info.width / 2)
  const outputs = []

  for (const [view, left] of [['front', 0], ['back', halfWidth]]) {
    const cropWidth = view === 'back' ? info.width - halfWidth : halfWidth
    const half = await sharp(cleanPng)
      .extract({ left, top: 0, width: cropWidth, height: info.height })
      .png()
      .toBuffer()
    const square = await sharp(half)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
      .resize(targetSize, targetSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        withoutEnlargement: false,
      })
      .png()
      .toBuffer()

    const outputPath = path.join(outputDir, `${slug}-${view}.png`)
    await sharp(square).toFile(outputPath)
    const metadata = await sharp(outputPath).metadata()
    outputs.push({ file: path.relative(root, outputPath), dimensions: `${metadata.width}x${metadata.height}`, view })
  }
  return outputs
}

await fs.mkdir(outputDir, { recursive: true })
const missing = []
for (const garment of garments) {
  try {
    const results = await processGarment(garment)
    for (const result of results) console.log(`${result.file}  ${result.dimensions}`)
  } catch (error) {
    if (error?.code === 'ENOENT') missing.push(garment.source)
    else throw error
  }
}

if (missing.length) {
  console.error(`\nMissing source mockup${missing.length === 1 ? '' : 's'} in raw-mockups/: ${missing.join(', ')}`)
  process.exitCode = 1
} else {
  console.log('\nProcessed 4 mockups into 8 transparent 1024x1024 PNG textures.')
}
