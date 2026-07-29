// Discovery + ottimizzazione dei media a build-time.
// vite-imagetools (via sharp) genera per ogni foto:
//  - thumb: varianti piccole (griglia), formato picture avif/webp/jpg responsive
//  - full:  varianti grandi (lightbox), stesso schema
//  - placeholder: micro-immagine base64 per l'effetto blur-up durante il load
// I video non vengono trasformati: si espone solo l'URL finale.
// NB: import.meta.glob e' analizzato staticamente da Vite: pattern e opzioni
// DEVONO essere letterali (niente variabili o funzioni helper).
const thumbs = import.meta.glob('./assets/images/**/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=400;800&format=avif;webp;jpg&as=picture&withoutEnlargement',
  import: 'default',
})
const fulls = import.meta.glob('./assets/images/**/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=1280;2048&format=avif;webp;jpg&as=picture&withoutEnlargement',
  import: 'default',
})
const placeholders = import.meta.glob('./assets/images/**/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=32&format=webp&inline',
  import: 'default',
})
const videos = import.meta.glob('./assets/images/**/*.{mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Poster dei video (convenzione: "<nome>-poster.jpg" accanto al video).
// Vengono esclusi dalle foto normali e associati al video omonimo.
const posterThumbs = import.meta.glob('./assets/images/**/*-poster.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=400;800&format=avif;webp;jpg&as=picture&withoutEnlargement',
  import: 'default',
})
const posterPlaceholders = import.meta.glob('./assets/images/**/*-poster.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=32&format=webp&inline',
  import: 'default',
})
const posterUrls = import.meta.glob('./assets/images/**/*-poster.{jpg,jpeg,png}', {
  eager: true,
  query: '?w=1080&format=jpg',
  import: 'default',
})

const POSTER_RE = /-poster\.[^.]+$/

// Ordinamento "naturale": kyoto2 prima di kyoto10 (non lessicografico).
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

// Raggruppa i media per nome cartella (= nome album).
const grouped = {}
const addMedia = (path, media) => {
  const match = path.match(/\/images\/([^/]+)\/([^/]+)$/)
  if (!match) return
  const [, album, file] = match
  ;(grouped[album] ||= []).push({ file, id: path, ...media })
}

// Lookup dei poster, indicizzati per "album/base" (base = nome senza -poster).
const posters = {}
for (const path in posterThumbs) {
  const m = path.match(/\/images\/([^/]+)\/(.+)-poster\.[^.]+$/)
  if (!m) continue
  posters[`${m[1]}/${m[2]}`] = {
    thumb: posterThumbs[path],
    placeholder: posterPlaceholders[path],
    url: posterUrls[path],
  }
}

for (const path in thumbs) {
  // I poster non sono foto a se': saltali nella griglia.
  if (POSTER_RE.test(path)) continue
  addMedia(path, {
    type: 'image',
    thumb: thumbs[path],
    full: fulls[path],
    placeholder: placeholders[path],
  })
}
for (const path in videos) {
  const m = path.match(/\/images\/([^/]+)\/(.+)\.[^.]+$/)
  const key = m ? `${m[1]}/${m[2]}` : ''
  addMedia(path, {
    type: 'video',
    src: videos[path],
    poster: posters[key] || null,
  })
}

for (const album in grouped) {
  grouped[album].sort((a, b) => collator.compare(a.file, b.file))
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Nomi album ordinati e capitalizzati per la UI.
export const albums = Object.keys(grouped)
  .sort((a, b) => collator.compare(a, b))
  .map(capitalize)

// Ritorna i media (oggetti) dell'album richiesto (case-insensitive).
export const getAlbumImages = (albumName) => {
  const key = albumName.toLowerCase()
  return grouped[key] || []
}
