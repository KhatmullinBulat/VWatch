<template>
  <button @click="videoPlayerStore.toggleMute()" class="mute-btn">
    <Transition name="fade" mode="out-in">
      <component :is="isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon" class="mute-btn-icon" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useVideoPlayerStore } from '@/stores/useVideoStore'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'

const videoPlayerStore = useVideoPlayerStore()
const { isMuted } = storeToRefs(videoPlayerStore)
</script>

<style scoped>
.mute-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

.mute-btn-icon {
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
