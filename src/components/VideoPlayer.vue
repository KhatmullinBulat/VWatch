<template>
  <div class="video-player">
    <video ref="videoElement" @play="onPlay" @pause="onPause" class="video-element"></video>
    <div class="controls">
      <PlayButton @togglePlay="togglePlay" />
      <ProgressBar :onUpdateProgress="setVideoTime" :onTimeUpdate="onTimeUpdate" />
      <VideoTimeDisplay :onTimeUpdate="onTimeUpdate" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { storeToRefs } from 'pinia'
import Hls from 'hls.js'
import ProgressBar from './ProgressBar.vue'
import VideoTimeDisplay from './VideoTimeDisplay.vue'
import PlayButton from './PlayButton.vue'

const videoElement = ref(null)
const videoStore = useVideoStore()

// Используем состояния из стора
const { isPlaying } = storeToRefs(videoStore)

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
  onTimeUpdate(setStoreTime)
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

function onTimeUpdate(func) {
  videoElement.value?.addEventListener('timeupdate', func)
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
}

.controls {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  width: calc(100% - 200px);
  background: rgba(240, 240, 240, 0.25);
  border-radius: 15px 15px 0 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10.2px);
  -webkit-backdrop-filter: blur(10.2px);
  padding: 20px 20px 15px 20px;
  margin: 0 auto;
}
</style>
