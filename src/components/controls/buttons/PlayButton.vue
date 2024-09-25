<template>
  <!-- по клику меняем состояние isPlaying в сторе -->
  <button @click="videoPlayerStore.togglePlay()" class="play-btn">
    <Transition name="fade" mode="out-in">
      <!-- динамический компонент для иконок -->
      <component :is="isPlaying ? PauseCircleIcon : PlayIcon" class="play-btn-icon" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useVideoPlayerStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { PlayIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'

const videoPlayerStore = useVideoPlayerStore()
const { isPlaying } = storeToRefs(videoPlayerStore)
</script>

<style scoped>
.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}
.play-btn-icon {
  width: 100%;
  height: 100%;
}
/* Определим базовые стили для transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
