<template>
  <div
    @mouseenter="showProgressBar = true"
    @mouseleave="showProgressBar = false"
    class="volume-control"
  >
    <button @click="toggleMute" class="volume-btn text-white">
      <SpeakerWaveIcon v-if="!isMuted" class="h-6" />
      <SpeakerXMarkIcon v-else class="h-6" />
    </button>
    <div :class="{ visible: showProgressBar }" class="progress-bar-wrapper">
      <ProgressBar @get-progress="getProgress" />
    </div>
  </div>
</template>

<script setup>
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid'
import ProgressBar from './ProgressBar.vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue'

const videoStore = useVideoStore()
const { volume, isMuted } = storeToRefs(videoStore)

const volumeValue = ref(volume.value)
const showProgressBar = ref(false)

const setVolume = () => {
  videoStore.setVolume(volumeValue.value)
}

const toggleMute = () => {
  videoStore.toggleMute()
}

const getProgress = (newProgress) => {
  volumeValue.value = newProgress

  setVolume()
}

watch(volume, (newVolume) => {
  volumeValue.value = newVolume
})
</script>

<style scoped>
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-wrapper {
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
}

.progress-bar-wrapper.visible {
  width: 100px; /* Ширина прогресс-бара, когда он видим */
}
</style>
