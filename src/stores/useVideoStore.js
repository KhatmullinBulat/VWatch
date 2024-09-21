import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
  state: () => ({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  }),
  actions: {
    setCurrentTime(time) {
      this.currentTime = time
    },

    setDuration(duration) {
      this.duration = duration
    }
  }
})
