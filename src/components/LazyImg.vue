<template>
  <div class="lazy-image-container">
    <div v-if="!loaded" class="loading-container">
      <ProgressSpinner strokeWidth="5" />
    </div>
    <img 
      :src="src" 
      :alt="alt" 
      @load="handleImageLoad"
      :class="{ 'image-loaded': loaded }"
    />
  </div>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loaded: false
    }
  },
  methods: {
    handleImageLoad(event) {
      this.loaded = true
      this.$emit('load', event)
    }
  }
}
</script>

<style scoped>
.lazy-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-loaded {
  opacity: 1;
}
</style>