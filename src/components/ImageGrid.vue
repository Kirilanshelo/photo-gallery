<template>
	<Galleria
		ref="galleria"
		:value="formattedImages"
		:numVisible="8"
		:showThumbnails="true"
		:thumbnailsPosition="'bottom'"
		:showItemNavigators="true"
		:visible="true"
		:showItemNavigatorsOnHover="true"
		:showThumbnailNavigators="true"
		:containerStyle="{ maxWidth: '100%' }"
		:responsiveOptions="responsiveOptions"
		@item-change="onItemChange"
	>
		<template #item="slotProps">
			<div class="gallery-item">
				<img 
					v-if="isImage(slotProps.item.src)" 
					:src="slotProps.item.src" 
					:alt="slotProps.item.alt"
					style="width: 100%; max-height: 90vh; object-fit: contain;"
				/>
				<video 
					v-else 
					:src="slotProps.item.src" 
					controls 
					style="max-width: 100%; max-height: 90vh; object-fit: contain;"
				/>
			</div>
		</template>

		<template #thumbnail="slotProps">
			<img 
				:src="slotProps.item.thumbnail" 
				:alt="slotProps.item.alt"
				style="width: 100px; height: 67px; object-fit: cover; display: block;"
			/>
		</template>
	</Galleria>
</template>

<script>
import Galleria from 'primevue/galleria'

export default {
  name: 'ImageGrid',
  components: {
    Galleria
  },
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      responsiveOptions: [
        {
          breakpoint: '1024px',
          numVisible: 5
        },
        {
          breakpoint: '768px',
          numVisible: 3
        },
        {
          breakpoint: '560px',
          numVisible: 1
        }
      ]
    }
  },
  computed: {
    formattedImages() {
      return this.images.map((image, index) => ({
        src: image,
        alt: `Image ${index}`,
        thumbnail: this.getThumbPath(image)
      }))
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    getThumbPath(file) {
      return file.replace('/images/', '/images/thumbnails/')
    },
    isImage(file) {
      const videoExtensions = ['mp4', 'webm', 'ogg']
      const extension = file.split('.').pop().toLowerCase()
      return !videoExtensions.includes(extension)
    },
    onItemChange(event) {
      this.$emit('imageLoad', event.index, {
        src: this.images[event.index]
      })
    },
    
    handleKeyDown(event) {
      if (this.$refs.galleria) {
        if (event.key === 'ArrowLeft') {
          const currentIndex = this.$refs.galleria.$data.activeIndex;
          const newIndex = currentIndex > 0 ? currentIndex - 1 : this.formattedImages.length - 1;
          this.$refs.galleria.$data.activeIndex = newIndex;
          event.preventDefault();
        } else if (event.key === 'ArrowRight') {
          const currentIndex = this.$refs.galleria.$data.activeIndex;
          const newIndex = currentIndex < this.formattedImages.length - 1 ? currentIndex + 1 : 0;
          this.$refs.galleria.$data.activeIndex = newIndex;
          event.preventDefault();
        }
      }
    }
  }
}
</script>

<style scoped>
.grid-container {
  width: 100%;
  padding: 16px;
  max-width: 1600px;
  margin: 0 auto;
}

.grid-thumbnail {
  width: 100%;
  padding-top: 100%;
  position: relative;
  cursor: pointer;
}

.grid-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
}

.grid-thumbnail:hover img {
  transform: scale(1.02);
}

:deep(.p-galleria) {
  background: transparent;
  display: flex;
  flex-direction: column;
}

:deep(.p-galleria-item-wrapper) {
  min-height: 500px;
}

:deep(.p-galleria-thumbnail-container) {
  background: #2C2C2C;
  padding: 1rem;
  display: flex !important;
  visibility: visible !important;
  height: auto !important;
  width: 100% !important;
  margin: 0 auto;
}

:deep(.p-galleria-thumbnail-items-container) {
  height: 100px !important;
  width: 100% !important;
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.p-galleria-thumbnail-item) {
  opacity: 0.6;
  transition: opacity 0.2s;
  height: 100px;
  flex: 0 0 auto;
  width: auto !important;
  margin: 0 4px;
}

:deep(.p-galleria-thumbnail-item.p-galleria-thumbnail-item-current) {
  opacity: 1;
  border: 2px solid #ffffff;
}

:deep(.p-galleria-content) {
  padding: 0;
}

:deep(.p-galleria-item-container) {
  width: 100% !important;
}
</style>