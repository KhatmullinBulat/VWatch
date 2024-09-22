<template>
  <div
    ref="progressContainer"
    class="progress-container"
    @click="setProgress($event)"
    @mousedown="startDragging"
    @touchstart="startDragging"
  >
    <div class="progress-bar shadow crosses" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['update-progress', 'time-update'])

const videoStore = useVideoStore()
const { currentTime, duration } = storeToRefs(videoStore)

const progressContainer = ref(null)
const isDragging = ref(false) // Флаг для отслеживания перетаскивания

onMounted(() => {
  if (duration.value > 0) {
    emit('time-update', progress.value)
  }
})

const progress = computed(() => {
  return (currentTime.value / duration.value) * 100
})

function setProgress(event) {
  calculateProgress(event)
}

function startDragging(event) {
  isDragging.value = true
  calculateProgress(event)

  // Добавляем обработчики для отслеживания мыши и тача
  window.addEventListener('mousemove', updateProgress)
  window.addEventListener('mouseup', stopDragging)
  window.addEventListener('touchmove', updateProgress)
  window.addEventListener('touchend', stopDragging)
}

function stopDragging() {
  isDragging.value = false

  // Удаляем обработчики
  window.removeEventListener('mousemove', updateProgress)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', updateProgress)
  window.removeEventListener('touchend', stopDragging)
}

function updateProgress(event) {
  if (isDragging.value) {
    calculateProgress(event)
  }
}

function calculateProgress(event) {
  const containerRect = progressContainer.value.getBoundingClientRect()

  const containerWidth = progressContainer.value.offsetWidth // ширина контейнера
  const clickX =
    event instanceof TouchEvent
      ? event.touches[0].clientX - containerRect.left
      : event.clientX - containerRect.left

  // вычисляем процент прогресса
  const newProgress = (clickX / containerWidth) * 100

  // Ограничиваем значения от 0 до 100
  const clampedProgress = Math.max(0, Math.min(100, newProgress))

  // Вычисляем новое значение времени в секундах на основе процента
  const newTime = (clampedProgress / 100) * duration.value

  // обновляем значение в сторе
  videoStore.setCurrentTime(newTime)

  // обновляем videoElement
  emit('update-progress', newTime)
}
</script>

<style scoped>
.progress-container {
  display: inline-block;
  width: 100%;
  height: 10px;
  border-radius: 3px;
  background: #faf7f0;
}

.progress-bar {
  border-radius: 0px;
  width: 0%;
  height: 100%;
  transition: width;
  transition-duration: 0s;
  transition-timing-function: ease-in-out;
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
