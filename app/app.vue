<template>
  <div
    class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-sans text-neutral-200 relative overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"
    />

    <h1
      class="text-3xl md:text-5xl font-bold mb-12 text-cyan-400 tracking-wider z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
    >
      Blip-A Interface
    </h1>

    <button
      :class="[
        'mb-8 px-6 py-3 border-2 rounded-lg transition-all font-bold tracking-widest z-10',
        isSoundActive
          ? 'border-red-500 text-red-400 hover:bg-red-900/30'
          : 'border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 animate-pulse',
      ]"
      @click="toggleSound"
    >
      {{ isSoundActive ? 'DEACTIVATE AUDIO COMM' : 'ACTIVATE AUDIO COMM' }}
    </button>

    <div class="flex flex-col md:flex-row gap-8 w-full max-w-5xl px-6 z-10 items-center justify-center">
      <div class="hex-panel bg-neutral-900 border-2 border-neutral-700 flex flex-col items-center justify-center shadow-2xl w-full md:w-[400px] h-[250px]">
        <h2 class="text-sm uppercase tracking-widest text-neutral-500 mb-4 mt-4 text-center">
          Earth Time
        </h2>
        <div class="text-3xl md:text-4xl font-mono text-white flex items-baseline">
          {{ earthTimeMain }}
          <span class="text-xl md:text-2xl text-neutral-500 ml-2">.{{ earthTimeMs }}</span>
        </div>
      </div>

      <div
        class="hex-panel bg-neutral-900 border-2 border-cyan-700 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(8,145,178,0.2)] w-full md:w-[450px] h-[280px] relative"
      >
        <div class="absolute inset-0 bg-cyan-900/10 hex-bg" />
        <h2 class="text-sm uppercase tracking-widest text-cyan-500 mb-4 z-10 mt-4">
          Eridian Time
        </h2>
        <div class="text-5xl md:text-6xl font-bold text-cyan-300 tracking-[0.2em] z-10">
          {{ eridianTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive state variables
const earthTimeMain = ref('')
const earthTimeMs = ref('')
const eridianTime = ref('')
const isSoundActive = ref(false)
let timer = null
let previousEridianBase6 = ''
let audioCtx = null

// Map base-6 digits to Eridian symbols
const symbols = {
  0: 'ℓ', 1: 'I', 2: 'V', 3: 'λ', 4: '+', 5: '∀',
}

const toggleSound = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioCtx = new AudioContext()
  }

  isSoundActive.value = !isSoundActive.value

  // 브라우저 정책상 오디오 컨텍스트가 'suspended' 상태일 수 있으므로 재개해줍니다
  if (isSoundActive.value && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

// Function to play a synthesized alien-like chord (3 frequencies combined)
const playEridianChord = () => {
  if (!audioCtx || audioCtx.state === 'suspended') return

  const gainNode = audioCtx.createGain()

  // Set up 3 oscillators for a chord effect (e.g., 440Hz, 554Hz, 659Hz)
  const freqs = [440, 587.33, 783.99] // A4, D5, G5
  const oscillators = freqs.map((freq) => {
    const osc = audioCtx.createOscillator()
    osc.type = 'sine' // Soft, pure tone
    osc.frequency.value = freq
    osc.connect(gainNode)
    return osc
  })

  gainNode.connect(audioCtx.destination)

  // Volume envelope for a short "chime/tick" sound
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)

  // Start and stop all oscillators
  oscillators.forEach((osc) => {
    osc.start()
    osc.stop(audioCtx.currentTime + 0.3)
  })
}

// Core time update logic
const updateTime = () => {
  const now = new Date()

  earthTimeMain.value = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // 밀리초 (3자리로 포맷팅)
  earthTimeMs.value = now.getMilliseconds().toString().padStart(3, '0')

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = now.getMilliseconds()

  const secondsSinceMidnight = (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000)
  const eridianTotalSeconds = Math.floor(secondsSinceMidnight / 2.336)
  const base6Time = eridianTotalSeconds.toString(6)

  // Play sound ONLY when the Eridian second changes
  if (previousEridianBase6 !== '' && previousEridianBase6 !== base6Time) {
    if (isSoundActive.value) {
      playEridianChord()
    }
  }
  previousEridianBase6 = base6Time

  eridianTime.value = base6Time.split('').map(digit => symbols[digit] || digit).join('')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 50)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (audioCtx) audioCtx.close()
})
</script>

<style scoped>
/* Custom CSS to create the Hexagon shape */
.hex-panel {
  /* This polygon cuts the corners to form an elongated hexagon */
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
}
</style>
