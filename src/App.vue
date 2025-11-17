<template>
  <div class="container">
    <h1>Galleria Fotografica</h1>
    
    <div class="selector-container">
      <select v-model="selectedAlbum" @change="onAlbumChange" class="album-selector">
        <option v-for="album in albums" :key="album" :value="album">
          {{ album }}
        </option>
      </select>
    </div>

    <div class="image-grid">
      <div 
        v-for="(media, index) in currentImages" 
        :key="index"
        class="image-item"
        @click="openModal(index)"
      >
        <div v-if="!loadedImages[index]" class="image-placeholder">
          <div class="spinner"></div>
        </div>
        <video 
          v-if="isVideo(media)"
          :src="media"
          @loadeddata="onImageLoad(index)"
          :class="{ loaded: loadedImages[index] }"
          muted
        />
        <img 
          v-else
          :src="media" 
          :alt="`${selectedAlbum} ${index + 1}`"
          loading="lazy"
          @load="onImageLoad(index)"
          :class="{ loaded: loadedImages[index] }"
        />
      </div>
    </div>

    <div v-if="modalOpen" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <button class="nav-btn prev" @click="prevImage" v-if="currentImages.length > 1">&lt;</button>
        <video 
          v-if="isVideo(currentImages[currentImageIndex])"
          :src="currentImages[currentImageIndex]"
          controls
          autoplay
          ref="modalVideo"
        />
        <img 
          v-else
          :src="currentImages[currentImageIndex]" 
          :alt="`${selectedAlbum} ${currentImageIndex + 1}`" 
        />
        <button class="nav-btn next" @click="nextImage" v-if="currentImages.length > 1">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { albums, getAlbumImages } from './data.js'

const selectedAlbum = ref(albums[0])
const currentImages = ref([])
const modalOpen = ref(false)
const currentImageIndex = ref(0)
const loadedImages = ref({})
const modalVideo = ref(null)

const isVideo = (src) => {
  return src && src.endsWith('.mp4')
}

const loadImages = () => {
  currentImages.value = getAlbumImages(selectedAlbum.value)
  loadedImages.value = {}
}

const onImageLoad = (index) => {
  loadedImages.value[index] = true
}

const onAlbumChange = () => {
  loadImages()
  modalOpen.value = false
}

const openModal = (index) => {
  currentImageIndex.value = index
  modalOpen.value = true
}

const closeModal = () => {
  if (modalVideo.value) {
    modalVideo.value.pause()
  }
  modalOpen.value = false
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentImages.value.length
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentImages.value.length) % currentImages.value.length
}

const handleKeydown = (event) => {
  if (!modalOpen.value) return
  
  if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  loadImages()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
  max-width: min(90vw, calc(90vh * 16 / 9));
  max-height: min(90vh, calc(90vw * 9 / 16));
}

.modal-content img,
.modal-content video {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
  display: block;
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
