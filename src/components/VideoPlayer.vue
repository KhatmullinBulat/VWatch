<template>
  <div class="video-player">
    <VideoComponent />

    <!-- <PlayButton class="play-overlay" /> -->
    <div class="controls-bottom">
      <PlayButton class="controls-bottom-play" />
      <TimeControl />
      <MuteButton class="controls-bottom-mute" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useVideoPlayerStore } from '@/stores/useVideoStore'
import VideoComponent from './VideoComponent.vue'
import PlayButton from './controls/buttons/PlayButton.vue'
import TimeControl from './controls/progress_bars/TimeControl.vue'
import MuteButton from './controls/buttons/MuteButton.vue'

const videoPlayerStore = useVideoPlayerStore()

onMounted(() => {
  videoPlayerStore.setVideoUrl(
    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
  )
})
</script>

<style scoped>
.video-player {
  position: relative;
}
.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 30px;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
}
.controls-bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 78%;
  padding-top: 15px;
  padding-bottom: 15px;
}
.controls-bottom-play {
  height: 20px;
}
.controls-bottom-mute {
  height: 20px;
}
</style>
