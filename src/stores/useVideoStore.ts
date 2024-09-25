import { defineStore } from 'pinia'

export const useVideoPlayerStore = defineStore('videoPlayer', {
  state: () => ({
    isSupportedHls: false,
    videoUrl: '',
    isPlaying: false, // статус воспроизведения
    currentTime: 0, // текущее время воспроизведения
    progress: 0,
    isDragging: false,
    duration: 0, // длительность видео
    volume: 0.5, // уровень громкости (от 0 до 1)
    isMuted: false, // статус звука
    playbackRate: 1 // скорость воспроизведения
  }),
  actions: {
    setVideoUrl(url: string) {
      this.videoUrl = url
    },
    play() {
      this.isPlaying = true
    },
    pause() {
      this.isPlaying = false
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    setCurrentTime(time: number) {
      this.currentTime = time
    },
    setProgress(newProgress: number) {
      this.progress = newProgress
    },
    setDuration(time: number | undefined) {
      if (time != undefined) {
        this.duration = time
      } else {
        this.duration = 0
      }
    },
    setVolume(value: number) {
      this.volume = Math.min(Math.max(value, 0), 1)
      this.isMuted = this.volume === 0
    },
    toggleMute() {
      this.isMuted = !this.isMuted
      this.volume = this.isMuted ? 0 : this.volume
    },
    changePlaybackRate(rate: number) {
      this.playbackRate = rate
    }
  },
  getters: {
    isVideoMuted(state): boolean {
      return state.isMuted
    }
  }
})
