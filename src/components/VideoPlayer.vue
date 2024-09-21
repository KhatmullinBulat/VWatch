<template>
  <div class="relative">
    <video ref="videoElement" @play="onPlay" @pause="onPause" class="w-full"></video>
    <div class="w-full absolute bottom-0 flex items-center gap-4 p-4">
      <button @click="togglePlay" class="text-white">
        <PlayIcon v-if="!isPlaying" class="h-6" />
        <PauseIcon v-else class="h-6" />
      </button>
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model="currentTime"
        @input="seek"
        class="w-full"
      />
      <span class="text-white">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { useVideoStore } from '@/stores/useVideoStore'
import Hls from 'hls.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'

const videoElement = ref(null)
const videoStore = useVideoStore()

// Используем состояния из стора
const { isPlaying, currentTime, duration } = storeToRefs(videoStore)

const formattedTime = ref('00:00')

const loadVideoFile = (source) => {
  if (Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource(source)
    hls.attachMedia(videoElement.value)
  } else if (videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.value.src = source
  }
}

// Когда компонент смонтирован
onMounted(() => {
  loadVideoFile(
    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
  )
  videoElement.value.addEventListener('loadedmetadata', function () {
    videoStore.setCurrentTime(videoElement.value.currentTime)
    videoStore.setDuration(videoElement.value.duration)
  })

  // Обновляем текущее время в сторе
  videoElement.value?.addEventListener('timeupdate', setTime)
})

// Управление воспроизведением
const togglePlay = () => {
  if (isPlaying.value) {
    videoElement.value.pause()
  } else {
    console.log('test')
    videoElement.value.play()
  }
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const seek = () => {
  videoElement.value.currentTime = currentTime.value
}

function setTime() {
  videoStore.setCurrentTime(videoElement.value.currentTime)

  // Форматирование времени
  formattedTime.value = computed(() => {
    //console.log(currentTime.value)
    const minutes = Math.floor(currentTime.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = Math.floor(currentTime.value - minutes * 60)
      .toString()
      .padStart(2, '0')

    return `${minutes}:${seconds}`
  })
}
</script>

<style scoped></style>
