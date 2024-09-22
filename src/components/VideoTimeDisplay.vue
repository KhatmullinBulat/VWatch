<template>
  <div class="flex flex-nowrap gap-2 text-white">
    <span>{{ formattedCurrentTime }}</span>
    /
    <span> {{ formatedDurationTime }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'

const videoStore = useVideoStore()

// Используем состояния из стора
const { currentTime, duration } = storeToRefs(videoStore)

const emit = defineEmits(['time-update'])

onMounted(() => {
  emit('time-update', formattedCurrentTime)
})

const formatedDurationTime = computed(() => {
  const durationHours = hours(duration.value)
  const durationMinutes = minutes(duration.value, durationHours)
  const durationSeconds = seconds(duration.value, durationMinutes)

  if (durationHours < 1) {
    return `${durationMinutes}:${durationSeconds}`
  } else {
    return `${durationHours}:${durationMinutes}:${durationSeconds}`
  }
})

// Форматирование времени
const formattedCurrentTime = computed(() => {
  const currentHours = hours(currentTime.value)
  const currentMinutes = minutes(currentTime.value, currentHours)
  const currentSeconds = seconds(currentTime.value, currentMinutes)
  if (currentHours < 1) {
    return `${currentMinutes}:${currentSeconds}`
  } else {
    return `${currentHours}:${currentMinutes}:${currentSeconds}`
  }
})

function hours(value) {
  return Math.floor(value / 60 / 60)
    .toString()
    .padStart(2, '0')
}

function minutes(value, hours) {
  return Math.floor(value / 60 - hours * 60)
    .toString()
    .padStart(2, '0')
}

function seconds(value, minutes) {
  return Math.floor(value - minutes * 60)
    .toString()
    .padStart(2, '0')
}
</script>

<style scoped></style>
