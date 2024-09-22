<template>
  <button @click="$emit('togglePlay')" class="play-btn text-white">
    <Transition name="fade" mode="out-in">
      <PlayIcon v-if="!isPlaying" class="h-6 w-6" />
      <PauseCircleIcon v-else class="h-6 w-6" />
    </Transition>
  </button>
</template>

<script setup>
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { PlayIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'

defineEmits(['togglePlay'])

const videoStore = useVideoStore()
const { isPlaying } = storeToRefs(videoStore)
</script>

<style scoped>
/* Определим базовые стили для transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
