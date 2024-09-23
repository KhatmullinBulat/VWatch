import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
  state: () => ({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    isMuted: false
  }),
  actions: {
    setCurrentTime(time) {
      this.currentTime = time
    },

    setDuration(duration) {
      this.duration = duration
    },

    setVolume(value) {
      this.volume = value
      this.isMuted = value === 0
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      this.volume = this.isMuted ? 0 : 1
    }
  }
})
