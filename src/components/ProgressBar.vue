<template>
  <div
    ref="progressContainer"
    @mousedown="startDragging"
    @touchstart="startDragging"
    class="progress-container"
  >
    <div class="progress-bar shadow crosses" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const emit = defineEmits(['get-progress'])

const progress = ref(0)
const progressContainer = ref(null)
const isDragging = ref(false) // Флаг для отслеживания перетаскивания

const props = defineProps({
  newProgress: Number
})

onBeforeUnmount(() => {
  stopDragging()
})

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

  const clampedX = Math.max(0, Math.min(containerWidth, clickX))

  // вычисляем процент прогресса
  const newProgress = (clampedX / containerWidth) * 100

  // Ограничиваем значения от 0 до 100
  const clampedProgress = Math.max(0, Math.min(100, newProgress))

  progress.value = clampedProgress

  emit('get-progress', progress.value)
}

// Функция для обновления прогресса при воспроизведении видео
function updateVideoProgress() {
  if (!isDragging.value) {
    progress.value = props.newProgress
  }
}

watch(() => props.newProgress, updateVideoProgress)
</script>

<style scoped>
.progress-container {
  display: inline-block;
  width: 100%;
  height: 10px;
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
