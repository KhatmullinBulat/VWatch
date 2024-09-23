<template>
  <ProgressBar :newProgress="progress" @get-progress="getProgress" />
</template>

<script setup>
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ProgressBar from './ProgressBar.vue'

const emit = defineEmits(['update-progress', 'time-update'])

const videoStore = useVideoStore()
const { currentTime, duration } = storeToRefs(videoStore)

const progress = ref(0)

const updateProgress = () => {
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100
  }
}

watch([currentTime], updateProgress)

const getProgress = (newProgress) => {
  progress.value = newProgress

  const time = (progress.value / 100) * duration.value

  videoStore.setCurrentTime(time)

  emit('update-progress', time)
}
</script>

<style scoped></style>
