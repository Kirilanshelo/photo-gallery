<template>
  <div class="container">
    <h1>Galleria Fotografica</h1>
    
    <div class="selector-container">
      <select v-model="selectedAlbum" class="album-selector" aria-label="Seleziona album">
        <option v-for="album in albums" :key="album" :value="album">
          {{ album }}
        </option>
      </select>
    </div>

    <div class="image-grid">
      <div 
        v-for="(media, index) in currentImages" 
        :key="media.id"
        class="image-item"
        @click="openModal(index)"
      >
        <div v-if="erroredImages[media.id]" class="image-error">
          <span>Immagine non disponibile</span>
        </div>
        <template v-else>
          <!-- Foto o video-con-poster: immagine con blur-up -->
          <template v-if="gridPicture(media)">
            <div 
              class="lqip" 
              :style="{ backgroundImage: `url(${gridPicture(media).placeholder})` }"
            ></div>
            <picture>
              <source 
                v-for="(srcset, format) in gridPicture(media).thumb.sources" 
                :key="format" 
                :srcset="srcset" 
                :type="`image/${format}`" 
              />
              <img 
                :src="gridPicture(media).thumb.img.src" 
                :alt="`${selectedAlbum} ${index + 1}`"
                sizes="(max-width: 640px) 45vw, 250px"
                loading="lazy"
                decoding="async"
                @load="onImageLoad(media.id)"
                @error="onImageError(media.id)"
                :class="{ loaded: loadedImages[media.id] }"
              />
            </picture>
          </template>
          <!-- Fallback: video senza poster -->
          <template v-else>
            <div v-if="!loadedImages[media.id]" class="image-placeholder">
              <div class="spinner"></div>
            </div>
            <video 
              :src="media.src"
              preload="metadata"
              muted
              @loadeddata="onImageLoad(media.id)"
              @error="onImageError(media.id)"
              :class="{ loaded: loadedImages[media.id] }"
            />
          </template>
          <!-- Badge play sui video -->
          <div 
            v-if="media.type === 'video' && loadedImages[media.id]" 
            class="play-badge" 
            aria-hidden="true"
          >&#9654;</div>
        </template>
      </div>
    </div>

    <div 
      v-if="modalOpen" 
      class="modal" 
      @click="closeModal"
      ref="modalRef"
      role="dialog"
      aria-modal="true"
      :aria-label="`${selectedAlbum}, immagine ${currentImageIndex + 1} di ${currentImages.length}`"
    >
      <div 
        class="modal-content" 
        @click.stop
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <button class="close-btn" @click="closeModal" aria-label="Chiudi">&times;</button>
        <button class="nav-btn prev" @click="prevImage" v-if="currentImages.length > 1" aria-label="Immagine precedente">&lt;</button>
        <div 
          v-if="currentMedia && currentMedia.type === 'image' && !modalLoaded" 
          class="modal-spinner"
        >
          <div class="spinner"></div>
        </div>
        <picture v-if="currentMedia && currentMedia.type === 'image'">
          <source 
            v-for="(srcset, format) in currentMedia.full.sources" 
            :key="format" 
            :srcset="srcset" 
            :type="`image/${format}`" 
          />
          <img 
            :src="currentMedia.full.img.src" 
            sizes="90vw"
            :alt="`${selectedAlbum} ${currentImageIndex + 1}`" 
            ref="modalImg"
            @load="modalLoaded = true"
            :class="{ loaded: modalLoaded }"
          />
        </picture>
        <video 
          v-else-if="currentMedia"
          :src="currentMedia.src"
          :poster="currentMedia.poster ? currentMedia.poster.url : null"
          controls
          preload="metadata"
          ref="modalVideo"
        />
        <button class="nav-btn next" @click="nextImage" v-if="currentImages.length > 1" aria-label="Immagine successiva">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { albums, getAlbumImages } from './data.js'

const selectedAlbum = ref(albums[0])
const currentImages = computed(() => getAlbumImages(selectedAlbum.value))
const currentMedia = computed(() => currentImages.value[currentImageIndex.value])
const modalOpen = ref(false)
const currentImageIndex = ref(0)
const loadedImages = ref({})
const erroredImages = ref({})
const modalLoaded = ref(false)
const modalVideo = ref(null)
const modalImg = ref(null)
const modalRef = ref(null)
// Elemento che aveva il focus prima dell'apertura del modal, per ripristinarlo.
let previouslyFocused = null

// Lo stato di caricamento/errore e' indicizzato per id del media.
const onImageLoad = (id) => {
  loadedImages.value[id] = true
}

const onImageError = (id) => {
  erroredImages.value[id] = true
}

// Immagine da mostrare in griglia: la foto stessa, oppure il poster del video.
// Ritorna null per un video privo di poster (fallback su elemento <video>).
const gridPicture = (media) =>
  media.type === 'image'
    ? { thumb: media.thumb, placeholder: media.placeholder }
    : media.poster

// Al cambio album azzera lo stato di caricamento e chiude il modal.
watch(selectedAlbum, () => {
  loadedImages.value = {}
  erroredImages.value = {}
  modalOpen.value = false
})

const openModal = (index) => {
  previouslyFocused = document.activeElement
  currentImageIndex.value = index
  modalOpen.value = true
  // Sposta il focus dentro il modal dopo il render.
  nextTick(() => {
    modalRef.value?.querySelector('.close-btn')?.focus()
  })
}

// Mette in pausa il video attualmente nel modal (se presente).
const pauseModalVideo = () => {
  if (modalVideo.value) {
    modalVideo.value.pause()
  }
}

const closeModal = () => {
  pauseModalVideo()
  modalOpen.value = false
}

// Precarica l'immagine precedente e successiva per una navigazione fluida.
const preloadAdjacent = () => {
  const list = currentImages.value
  if (list.length < 2) return
  const neighbors = [
    (currentImageIndex.value + 1) % list.length,
    (currentImageIndex.value - 1 + list.length) % list.length,
  ]
  for (const i of neighbors) {
    const media = list[i]
    if (media && media.type === 'image') {
      const img = new Image()
      img.sizes = '90vw'
      // Precarica la variante responsive (webp) usata nel lightbox.
      if (media.full.sources.webp) img.srcset = media.full.sources.webp
      img.src = media.full.img.src
    }
  }
}

// Quando si apre il modal o si cambia slide: azzera lo stato di caricamento
// del lightbox (per rimostrare lo spinner) e precarica i vicini.
watch([modalOpen, currentImageIndex], () => {
  if (modalOpen.value) {
    modalLoaded.value = false
    preloadAdjacent()
    // Se la foto e' gia' in cache, @load potrebbe non riscattare: verifica.
    nextTick(() => {
      if (modalImg.value?.complete && modalImg.value.naturalWidth > 0) {
        modalLoaded.value = true
      }
    })
  }
})

// Blocca lo scroll del body e ripristina il focus alla chiusura.
watch(modalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open && previouslyFocused) {
    previouslyFocused.focus?.()
    previouslyFocused = null
  }
})

// Mantiene il focus dentro il modal (Tab ciclico).
const trapFocus = (event) => {
  const focusables = modalRef.value?.querySelectorAll(
    'button, [href], video[controls]'
  )
  if (!focusables || focusables.length === 0) return
  const list = Array.from(focusables)
  const first = list[0]
  const last = list[list.length - 1]
  const active = document.activeElement
  const inside = modalRef.value.contains(active)
  if (event.shiftKey) {
    if (active === first || !inside) {
      event.preventDefault()
      last.focus()
    }
  } else if (active === last || !inside) {
    event.preventDefault()
    first.focus()
  }
}

const nextImage = () => {
  pauseModalVideo()
  currentImageIndex.value = (currentImageIndex.value + 1) % currentImages.value.length
}

const prevImage = () => {
  pauseModalVideo()
  currentImageIndex.value = (currentImageIndex.value - 1 + currentImages.value.length) % currentImages.value.length
}

// Swipe orizzontale su mobile per navigare tra i media.
let touchStartX = 0
let touchStartY = 0
const SWIPE_THRESHOLD = 50

const onTouchStart = (event) => {
  const touch = event.changedTouches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

const onTouchEnd = (event) => {
  if (currentImages.value.length < 2) return
  const touch = event.changedTouches[0]
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  // Considera solo swipe prevalentemente orizzontali oltre la soglia.
  if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextImage()
    else prevImage()
  }
}

const handleKeydown = (event) => {
  if (!modalOpen.value) return
  
  if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'Escape') {
    closeModal()
  } else if (event.key === 'Tab') {
    trapFocus(event)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.container {
  background-color: rgb(51, 29, 29);
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: rgb(225, 180, 134);
  text-align: center;
  margin-bottom: 2rem;
}

.selector-container {
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
}

.album-selector {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 2px solid rgb(159, 52, 52);
  background-color: rgb(51, 29, 29);
  color: rgb(225, 180, 134);
  cursor: pointer;
}

.album-selector:focus {
  outline: none;
  border-color: rgb(225, 180, 134);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1400px;
}

.image-item {
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1;
  background-color: rgb(51, 29, 29);
  border: 2px solid rgb(159, 52, 52);
  position: relative;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(51, 29, 29);
}

/* Placeholder sfocato (LQIP) mostrato mentre carica la foto reale. */
.lqip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  z-index: 0;
}

.image-item picture {
  display: block;
  width: 100%;
  height: 100%;
  /* La foto reale deve stare SOPRA il placeholder sfocato (.lqip). */
  position: relative;
  z-index: 1;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  background-color: rgb(51, 29, 29);
  color: rgb(225, 180, 134);
  font-size: 0.85rem;
}

.play-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
  border-radius: 50%;
  background-color: rgba(51, 29, 29, 0.6);
  border: 2px solid rgb(225, 180, 134);
  color: rgb(225, 180, 134);
  font-size: 1.4rem;
  pointer-events: none;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgb(159, 52, 52);
  border-top-color: rgb(225, 180, 134);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.image-item img,
.image-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.image-item img.loaded,
.image-item video.loaded {
  opacity: 1;
}

.image-item:hover img.loaded,
.image-item:hover video.loaded {
  transform: scale(1.05);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 29, 29, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(51, 29, 29);
  border: 3px solid rgb(159, 52, 52);
  border-radius: 8px;
  padding: 3rem;
  max-width: 95vw;
  max-height: 95vh;
  /* Dimensioni minime cosi' la cornice e' visibile subito, mentre carica. */
  min-width: min(240px, 80vw);
  min-height: min(240px, 60vh);
  box-sizing: border-box;
}

/* picture non deve creare un box proprio: l'img diventa figlio diretto
   del flex container e resta centrata. */
.modal-content picture {
  display: contents;
}

/* Spinner di caricamento del lightbox, centrato nella cornice. */
.modal-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* La foto sfuma in ingresso quando ha finito di caricare. */
.modal-content img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-content img.loaded {
  opacity: 1;
}

/* Il media mantiene le proporzioni reali: il contenitore si adatta a lui,
   entro i limiti del viewport (spazio dedotto per padding e frecce). */
.modal-content img,
.modal-content video {
  display: block;
  width: auto;
  height: auto;
  max-width: min(calc(90vw - 6rem), 1600px);
  max-height: calc(90vh - 6rem);
  object-fit: contain;
  border-radius: 4px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: rgb(225, 180, 134);
  font-size: 2rem;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
  line-height: 1;
}

.close-btn:hover {
  color: rgb(159, 52, 52);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgb(225, 180, 134);
  font-size: 2rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1001;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  color: rgb(159, 52, 52);
}

.nav-btn.prev {
  left: 10px;
}

.nav-btn.next {
  right: 10px;
}
</style>
