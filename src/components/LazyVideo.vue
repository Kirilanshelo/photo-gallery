<template>
  <div class="lazy-video-container">
    <video 
      ref="videoRef"
      :alt="`video-${index}`"
      controls
      @loadedmetadata="handleVideoLoad"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'LazyVideo',
  props: {
    file: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const videoRef = ref(null)
    let observer = null

    const handleVideoLoad = (event) => {
      const { videoWidth, videoHeight } = event.target
      emit('imageLoad', props.index, { width: videoWidth, height: videoHeight })
    }

    onMounted(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoRef.value.src = props.file
              observer.unobserve(videoRef.value)
            }
          })
        },
        { threshold: 0.25 }
      )

      if (videoRef.value) {
        observer.observe(videoRef.value)
      }
    })

    onUnmounted(() => {
      if (observer && videoRef.value) {
        observer.unobserve(videoRef.value)
      }
    })

    return {
      videoRef,
      handleVideoLoad
    }
  }
}
</script>

<style scoped>
.lazy-video-container {
  width: 100%;
  height: 100%;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>