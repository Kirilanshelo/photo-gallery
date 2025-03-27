<template>
  <div class="container">
    <h2 class="title">Galleria Fotografica</h2>
    <CollectionSelector
      :collections="collections"
      :selectedCollection="selectedCollection"
      @change="handleCollectionChange"
    />
    <ImageGrid
      :images="images"
      @imageLoad="handleImageLoad"
    />
    <!-- Rimosso il componente ImageModal poiché ora integrato in ImageGrid -->
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import CollectionSelector from './components/CollectionSelector.vue'
import ImageGrid from './components/ImageGrid.vue'
// Rimosso l'import di ImageModal
import { collections, generateImagePaths } from './data'

export default {
  name: 'App',
  components: {
    CollectionSelector,
    ImageGrid
    // Rimosso ImageModal dai componenti
  },
  setup() {
    const selectedCollection = ref('Tokyo')
    const images = ref([])
    const imageDimensions = ref({})
    
    // Rimossa la variabile selectedImage poiché non più necessaria
    
    const handleCollectionChange = (collection) => {
      selectedCollection.value = collection
    }
    
    // Rimossa la funzione handleImageClick poiché non più necessaria
    
    // Rimossa la funzione handleCloseModal poiché non più necessaria
    
    const handleImageLoad = (index, dimensions) => {
      imageDimensions.value[index] = dimensions
    }
    
    watch(selectedCollection, () => {
      images.value = generateImagePaths(selectedCollection.value)
    }, { immediate: true })
    
    return {
      collections,
      selectedCollection,
      images,
      imageDimensions,
      handleCollectionChange,
      handleImageLoad,
      generateImagePaths
    }
  }
}
</script>

<style>
.container {
  background-color: #1C1C1C;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  color: #FFFFFF;
  text-align: center;
}
</style>