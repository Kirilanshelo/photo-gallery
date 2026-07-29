// Genera versioni "web-ready" delle foto a partire dagli originali a piena
// risoluzione. Gli originali stanno in ./originals (fuori da git); le versioni
// web-ready finiscono in ./src/assets/images, da cui vite-imagetools produce
// poi i derivati responsive (avif/webp/jpg) in fase di build.
//
// Uso: npm run images
//
// Nota: i VIDEO non vengono gestiti qui (si ottimizzano a mano con ffmpeg).
// Metti in ./src/assets/images gia' pronti sia il video ottimizzato sia il
// relativo "<nome>-poster.jpg".
import { readdir, mkdir } from 'node:fs/promises'
import { join, extname, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..', 'originals')
const OUT = join(HERE, '..', 'src', 'assets', 'images')

// Lato lungo massimo: coincide con la variante piu' grande servita nel
// lightbox (vedi w=...;2048 in data.js), quindi nessuna perdita visibile.
const MAX_SIDE = 2048
const QUALITY = 80
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const out = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = await walk(SRC)
if (files.length === 0) {
  console.error(`Nessun file trovato in ${SRC}. Metti li' gli originali.`)
  process.exit(1)
}

let done = 0
let skipped = 0
for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!IMAGE_EXT.has(ext)) {
    skipped++
    continue
  }
  const rel = relative(SRC, file)
  // Output sempre .jpg (fallback universale; i formati moderni li fa imagetools).
  const outPath = join(OUT, rel).replace(/\.[^.]+$/, '.jpg')
  await mkdir(dirname(outPath), { recursive: true })
  await sharp(file)
    .rotate() // normalizza l'orientamento EXIF
    .resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath)
  done++
  console.log('->', rel)
}

console.log(`\nFatto: ${done} immagini web-ready generate in src/assets/images` +
  (skipped ? ` (${skipped} non-immagini ignorate, es. video)` : ''))
