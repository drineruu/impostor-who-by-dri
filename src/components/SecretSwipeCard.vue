<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  playerName: {
    type: String,
    required: true,
  },
  isImpostor: {
    type: Boolean,
    default: false,
  },
  secretWord: {
    type: String,
    default: '',
  },
  hintWord: {
    type: String,
    default: '',
  },
  showHint: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['seen', 'closed'])

const CARD_HEIGHT = 340
const OPEN_OFFSET = -(CARD_HEIGHT - 28)
const THRESHOLD = 88
/** How long the role stays visible after reveal, in milliseconds. */
const VIEW_MS = 2300

const startY = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)
const didMove = ref(false)
const isOpen = ref(false)
let hideTimer = 0

const coverStyle = computed(() => ({
  transform: `translateY(${dragOffset.value}px)`,
  transition: isDragging.value ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
}))

const isRevealing = computed(() => isOpen.value || dragOffset.value < -20)

function clearHideTimer() {
  window.clearTimeout(hideTimer)
  hideTimer = 0
}

function closeCard() {
  isOpen.value = false
  isDragging.value = false
  dragOffset.value = 0
  emit('closed')
}

function openCard() {
  isOpen.value = true
  dragOffset.value = OPEN_OFFSET
  emit('seen')
  clearHideTimer()
  hideTimer = window.setTimeout(() => {
    closeCard()
  }, VIEW_MS)
}

function onPointerDown(event) {
  if (isOpen.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  isDragging.value = true
  didMove.value = false
  startY.value = event.clientY - dragOffset.value
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch {
    // Synthetic events may not support capture.
  }
  if (event.pointerType !== 'mouse') event.preventDefault()
}

function onPointerMove(event) {
  if (!isDragging.value || isOpen.value) return
  const next = Math.min(0, Math.max(OPEN_OFFSET, event.clientY - startY.value))
  if (Math.abs(next) > 12) didMove.value = true
  dragOffset.value = next
}

function onPointerUp() {
  if (!isDragging.value) return
  isDragging.value = false

  if (Math.abs(dragOffset.value) >= THRESHOLD) {
    openCard()
    return
  }

  dragOffset.value = 0
}

function revealWithKeyboard() {
  if (isOpen.value) return
  openCard()
}

function onActivate() {
  if (isOpen.value || didMove.value) return
  openCard()
}

onBeforeUnmount(() => {
  clearHideTimer()
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-panel-edge bg-ink"
    :style="{ height: `${CARD_HEIGHT}px` }"
  >
    <div
      class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      :aria-hidden="!isRevealing"
    >
      <template v-if="isRevealing && isImpostor">
        <p class="text-sm font-bold tracking-[0.24em] text-impostor uppercase">Your role</p>
        <p class="mt-3 text-5xl font-black tracking-tight text-impostor">Impostor</p>
        <template v-if="showHint && hintWord">
          <p class="mt-6 text-sm font-bold tracking-[0.24em] text-gold uppercase">Hint</p>
          <p class="mt-2 text-3xl font-black text-white">{{ hintWord }}</p>
          <p class="mt-4 max-w-xs text-base leading-relaxed text-muted">
            You don't get the secret word. Use this hint to blend in.
          </p>
        </template>
        <p v-else class="mt-5 max-w-xs text-base leading-relaxed text-muted">
          You don't get the secret word. Listen closely and blend in.
        </p>
      </template>
      <template v-else-if="isRevealing">
        <p class="text-sm font-bold tracking-[0.24em] text-crew uppercase">Your role</p>
        <p class="mt-3 text-3xl font-black tracking-tight text-crew">Player</p>
        <p class="mt-6 text-sm font-bold tracking-[0.24em] text-gold uppercase">Secret word</p>
        <p class="mt-2 text-4xl font-black text-white">{{ secretWord }}</p>
        <p class="mt-5 max-w-xs text-base leading-relaxed text-muted">
          Memorize this word. Don't show anyone.
        </p>
      </template>
    </div>

    <button
      type="button"
      class="absolute inset-0 z-10 flex touch-none select-none flex-col items-center justify-center bg-panel px-6 text-center"
      :class="{ 'pointer-events-none': isOpen }"
      :style="coverStyle"
      :aria-label="`Swipe up or press to reveal ${playerName}'s role`"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click="onActivate"
      @keydown.enter.prevent="revealWithKeyboard"
      @keydown.space.prevent="revealWithKeyboard"
    >
      <span class="mb-5 h-1.5 w-12 rounded-full bg-gold/80" aria-hidden="true"></span>
      <span
        class="swipe-cue text-gold"
        :class="{ 'swipe-cue-paused': isDragging || isOpen }"
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 88" class="h-28 w-16" fill="none">
          <path
            class="swipe-chevron swipe-chevron-1"
            d="M16 14 L24 6 L32 14"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="swipe-chevron swipe-chevron-2"
            d="M16 23 L24 15 L32 23"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <g class="swipe-hand">
            <!-- Hand paths based on Lucide Icons (ISC License): https://lucide.dev -->
            <g
              transform="translate(3.5 34) scale(1.7)"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
              <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
              <path d="M10 9.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </g>
          </g>
        </svg>
      </span>
      <span class="mt-3 text-lg font-black tracking-tight text-white">Swipe up</span>
      <span class="mt-2 text-sm text-muted">to see your role</span>
    </button>
  </div>
</template>
