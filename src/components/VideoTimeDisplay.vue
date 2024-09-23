<template>
  <div class="flex flex-nowrap gap-2 text-white">
    <span>{{ formattedCurrentTime }}</span>
    /
    <span> {{ formattedDurationTime }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'

const videoStore = useVideoStore()

// Используем состояния из стора
const { currentTime, duration } = storeToRefs(videoStore)

// Форматирование времени длительности
const formattedDurationTime = computed(() => formatTime(duration.value))

// Форматирование текущего времени
const formattedCurrentTime = computed(() => formatTime(currentTime.value))

// Функция для форматирования времени в часы:минуты:секунды
function formatTime(value) {
  const hours = Math.floor(value / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((value % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0')

  // Если меньше 1 часа, возвращаем формат минуты:секунды
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
}
</script>

<style scoped></style>
