<template>
  <Galleria 
    :value="[{ itemImageSrc: image }]"
    :visible="show" 
    :showThumbnails="false"
    @hide="$emit('close')"
    :containerStyle="{ maxWidth: '90vw', maxHeight: '90vh' }"
    :showIndicators="false"
    :showItemNavigators="false"
		:fullscreen="true"
  >
    <template #item="slotProps">
      <img 
        v-if="isImage(slotProps.item.itemImageSrc)" 
        :src="slotProps.item.itemImageSrc" 
        :alt="slotProps.item.itemImageSrc"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
      <video 
        v-else 
        :src="slotProps.item.itemImageSrc" 
        controls 
        style="max-width: 90vw; max-height: 90vh; object-fit: contain;"
      />
    </template>
  </Galleria>
</template>
  
<script>
  import Galleria from 'primevue/galleria'

export default {
  name: 'ImageModal',
  components: {
    Galleria
  },
	props: {
		show: {
			type: Boolean,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		dimensions: {
			type: Object,
			default: () => ({})
		}
	},
	methods: {
		isImage(file) {
			if (file !== undefined) {
				const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']
				const extension = file.split('.').pop().toLowerCase()
				return imageExtensions.includes(extension)
			}
			return false
		}
	}
}
</script>
  
<style scoped>
:deep(.p-galleria) {
  background: #2C2C2C;
}

:deep(.p-galleria-content) {
  padding: 0;
  border-radius: 8px;
}

:deep(.p-galleria-item-wrapper) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>