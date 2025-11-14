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
        v-for="(image, index) in currentImages" 
        :key="index"
        class="image-item"
        @click="openModal(index)"
      >
        <img :src="image" :alt="`${selectedAlbum} ${index + 1}`" />
      </div>
    </div>

    <div v-if="modalOpen" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <button class="nav-btn prev" @click="prevImage" v-if="currentImages.length > 1">&lt;</button>
        <img :src="currentImages[currentImageIndex]" :alt="`${selectedAlbum} ${currentImageIndex + 1}`" />
        <button class="nav-btn next" @click="nextImage" v-if="currentImages.length > 1">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { albums, getAlbumImages } from './data.js'

const selectedAlbum = ref(albums[0])
const currentImages = ref([])
const modalOpen = ref(false)
const currentImageIndex = ref(0)

const loadImages = () => {
  currentImages.value = getAlbumImages(selectedAlbum.value)
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
  background-color: #1C1C1C;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: #FFFFFF;
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
  border: 1px solid #444;
  background-color: #2C2C2C;
  color: #FFFFFF;
  cursor: pointer;
}

.album-selector:focus {
  outline: none;
  border-color: #666;
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
  background-color: #2C2C2C;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item:hover img {
  transform: scale(1.05);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  z-index: 1001;
}

.nav-btn {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  z-index: 1001;
  transition: background-color 0.3s;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.nav-btn.prev {
  left: -60px;
}

.nav-btn.next {
  right: -60px;
}
</style>
