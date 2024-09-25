<template>
  <video
    ref="videoElement"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @click="videoPlayerStore.togglePlay()"
    class="video-element"
  ></video>
</template>

<script setup lang="ts">
import { useVideoPlayerStore } from '@/stores/useVideoStore'
import Hls from 'hls.js'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)

const videoPlayerStore = useVideoPlayerStore()
const { isSupportedHls, videoUrl, isPlaying, progress, isDragging, currentTime, isMuted } =
  storeToRefs(videoPlayerStore)

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.volume = videoPlayerStore.volume
    videoElement.value.playbackRate = videoPlayerStore.playbackRate
  }
})

const loadFile = () => {
  if (videoElement.value) {
    // загрузка видеофайла
    if (Hls.isSupported()) {
      isSupportedHls.value = true
      const hls = new Hls()
      hls.loadSource(videoUrl.value)
      hls.attachMedia(videoElement.value)
    } else if (videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.value.src = videoUrl.value
    }
  }
}

watch(() => videoUrl.value, loadFile)

const onLoadedMetadata = () => {
  if (videoElement.value) {
    videoPlayerStore.setDuration(videoElement.value?.duration)
  }
}

const onTimeUpdate = () => {
  if (videoElement.value && !isDragging.value) {
    videoPlayerStore.setCurrentTime(videoElement.value.currentTime)
  }
}

const onProgressUpdate = () => {
  if (videoElement.value && !isDragging.value) {
    videoElement.value.currentTime = currentTime.value
  }
}

watch(() => progress.value, onProgressUpdate)

const togglePlay = () => {
  if (videoElement.value) {
    if (isPlaying.value) {
      videoElement.value.play()
    } else {
      videoElement.value.pause()
    }
  }
}

watch(() => isPlaying.value, togglePlay)

const toggleMute = () => {
  if (videoElement.value) {
    videoElement.value.muted = isMuted.value
  }
}

watch(() => isMuted.value, toggleMute)
</script>

<style scoped>
.video-element {
  width: 100%;
  vertical-align: top;
  cursor: pointer;
}
</style>
