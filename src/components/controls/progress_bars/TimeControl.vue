<template>
  <div
    ref="progressContainer"
    @mousedown="startDragging"
    @touchstart="startDragging"
    class="progress-container"
  >
    <div class="progress-bar shadow crosses" :style="{ width: updateProgress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { useVideoPlayerStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const videoPlayerStore = useVideoPlayerStore()
const { isPlaying, isDragging, duration, currentTime } = storeToRefs(videoPlayerStore)
const isPlay = ref(isPlaying.value)

const progressContainer = ref<HTMLDivElement | null>(null)
const progress = ref(0)

const updateProgress = computed(() => {
  if (isDragging.value) {
    return progress.value
  } else {
    return (currentTime.value / duration.value) * 100
  }
})

const startDragging = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true
  isPlay.value = isPlaying.value
  videoPlayerStore.pause()

  calculateProgress(event)

  // Добавляем обработчики для отслеживания мыши и тача
  window.addEventListener('mousemove', calculateProgress)
  window.addEventListener('mouseup', stopDragging)
  window.addEventListener('touchmove', calculateProgress)
  window.addEventListener('touchend', stopDragging)
}

const stopDragging = () => {
  videoPlayerStore.setProgress(progress.value)
  videoPlayerStore.setCurrentTime((progress.value / 100) * duration.value)

  isDragging.value = false
  if (isPlay.value) {
    videoPlayerStore.play()
  }

  // Удаляем обработчики
  window.removeEventListener('mousemove', calculateProgress)
  window.removeEventListener('touchmove', calculateProgress)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchend', stopDragging)
}

const calculateProgress = (event: MouseEvent | TouchEvent) => {
  if (!progressContainer.value) return
  // координаты контейнера
  const containerRect = progressContainer.value.getBoundingClientRect()
  // ширина контейнера
  const containerWidth = progressContainer.value.offsetWidth

  const clickX =
    event instanceof TouchEvent
      ? event.touches[0].clientX - containerRect.left
      : event.clientX - containerRect.left
  const clampedX = Math.max(0, Math.min(containerWidth, clickX))
  // вычисляем процент прогресса
  const newProgress = (clampedX / containerWidth) * 100
  // Ограничиваем значения от 0 до 100
  progress.value = Math.max(0, Math.min(100, newProgress))
}
</script>

<style scoped>
.progress-container {
  display: inline-block;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #faf7f0;
  user-select: none;
  cursor: pointer;
}

.progress-bar {
  border-radius: 0px;
  width: 0%;
  height: 100%;
  transition: width;
  transition-duration: 0s;
  transition-timing-function: ease-in-out;
  user-select: none;
  cursor: pointer;
}

.crosses {
  background-color: #4a4947;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-position: center;
}

.shadow {
  box-shadow: 0px 45px 50px rgba(0, 0, 0, 0.25);
}
</style>
