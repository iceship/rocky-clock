<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-sans text-neutral-200">
    <h1 class="text-3xl md:text-5xl font-bold mb-12 text-cyan-400 tracking-wider">
      Rocky's Clock
    </h1>

    <div class="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-6">
      <div class="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center shadow-xl">
        <h2 class="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Earth Time
        </h2>
        <div class="text-4xl md:text-5xl font-mono text-white">
          {{ earthTime }}
        </div>
      </div>

      <div class="flex-1 bg-neutral-900 border border-cyan-900/50 rounded-2xl p-8 flex flex-col items-center shadow-[0_0_30px_rgba(8,145,178,0.15)]">
        <h2 class="text-sm uppercase tracking-widest text-cyan-500 mb-4">
          Eridian Time (Base-6)
        </h2>
        <div class="text-5xl md:text-6xl font-bold text-cyan-300 tracking-[0.2em]">
          {{ eridianTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive variables to store the formatted time strings
const earthTime = ref('')
const eridianTime = ref('')

// Variable to hold the interval ID for cleanup
let timer = null

// Map base-6 digits to Eridian symbols
const symbols = {
  0: 'ℓ',
  1: 'I',
  2: 'V',
  3: 'λ',
  4: '+',
  5: '∀',
}

// Function to calculate and update both Earth and Eridian times
const updateTime = () => {
  const now = new Date()

  // Update Earth time display
  earthTime.value = now.toLocaleTimeString('en-US', { hour12: false })

  // Calculate Earth seconds elapsed since midnight
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = now.getMilliseconds()

  // Include milliseconds for a smoother Eridian tick calculation
  const secondsSinceMidnight = (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000)

  // Convert to Eridian seconds (1 Eridian second = 2.336 Earth seconds)
  const eridianTotalSeconds = Math.floor(secondsSinceMidnight / 2.336)

  // Convert the total Eridian seconds to a Base-6 string
  const base6Time = eridianTotalSeconds.toString(6)

  // Replace normal digits with Eridian symbols
  eridianTime.value = base6Time
    .split('')
    .map(digit => symbols[digit] || digit)
    .join('')
}

// Lifecycle hook: Start the clock when the component mounts
onMounted(() => {
  updateTime()
  // Update frequently to ensure the Eridian clock ticks accurately
  timer = setInterval(updateTime, 50)
})

// Lifecycle hook: Clean up the interval when the component unmounts
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
