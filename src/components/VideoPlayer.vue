<template>
  <div class="video-player">
    <video
      ref="videoElement"
      @click="togglePlay"
      @play="onPlay"
      @pause="onPause"
      class="video-element"
    ></video>

    <!-- Кнопка поверх видео -->
    <PlayButton v-if="!isPlaying" @togglePlay="togglePlay" class="play-overlay" />

    <div class="controls-wrapper">
      <div class="controls">
        <PlayButton @togglePlay="togglePlay" />
        <TimeProgressBar :onUpdateProgress="setVideoTime" />
        <VideoTimeDisplay />
        <VolumeControl />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import Hls from 'hls.js'
import VideoTimeDisplay from './VideoTimeDisplay.vue'
import PlayButton from './PlayButton.vue'
import TimeProgressBar from './TimeProgressBar.vue'
import VolumeControl from './VolumeControl.vue'

const videoElement = ref(null)
const videoStore = useVideoStore()

// Используем состояния из стора
const { isPlaying, volume } = storeToRefs(videoStore)

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

  videoElement.value.volume = volume.value

  videoElement.value.addEventListener('loadedmetadata', function () {
    videoStore.setCurrentTime(videoElement.value.currentTime)
    videoStore.setDuration(videoElement.value.duration)
  })

  // Обновляем текущее время в сторе
  videoElement.value.addEventListener('timeupdate', setStoreTime)
})

// Очищаем обработчики при демонтировании
onUnmounted(() => {
  videoElement.value.removeEventListener('timeupdate', setStoreTime)
})

// Управление воспроизведением
const togglePlay = () => {
  if (isPlaying.value) {
    videoElement.value.pause()
  } else {
    videoElement.value.play()
  }
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

function setStoreTime() {
  videoStore.setCurrentTime(videoElement.value.currentTime)
}

function setVideoTime(time) {
  videoElement.value.currentTime = time
}
</script>

<style scoped>
.video-player {
  position: relative;
}

.video-element {
  width: 100%;
  cursor: pointer;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20%;
  transition: opacity 0.2s ease;
}

.play-overlay:hover {
  background: rgba(0, 0, 0, 0.7);
}

.controls-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 70%;
  margin: 0 auto;
  overflow: hidden; /* Обрезаем элементы, которые выходят за пределы */
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  width: 100%;
  background: rgba(240, 240, 240, 0.25);
  border-radius: 15px 15px 0 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10.2px);
  -webkit-backdrop-filter: blur(10.2px);
  padding: 20px 20px 15px 20px;
  user-select: none;

  transform: translateY(100%);
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  opacity: 0;
}

.video-player:hover .controls {
  transform: translateY(0);
  opacity: 1;
}
</style>
