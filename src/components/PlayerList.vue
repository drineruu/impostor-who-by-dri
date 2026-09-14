<script setup>
import { ref } from 'vue'

defineProps({
  players: {
    type: Array,
    required: true,
  },
  canAdd: {
    type: Boolean,
    default: true,
  },
  canRemove: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update-name', 'add', 'remove', 'move', 'reorder'])

const listRef = ref(null)
const dragIndex = ref(null)
const overIndex = ref(null)

function itemIndexFromPoint(clientY) {
  const items = listRef.value?.querySelectorAll('[data-player-index]')
  if (!items?.length) return null

  let closest = 0
  let closestDistance = Infinity

  items.forEach((item) => {
    const rect = item.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    const distance = Math.abs(clientY - midpoint)
    if (distance < closestDistance) {
      closestDistance = distance
      closest = Number(item.dataset.playerIndex)
    }
  })

  return closest
}

function onHandlePointerDown(event, index) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  dragIndex.value = index
  overIndex.value = index
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch {
    // Some synthetic pointer events cannot capture; drag still works via the handle listeners.
  }
  event.preventDefault()
}

function onHandlePointerMove(event) {
  if (dragIndex.value === null) return
  const next = itemIndexFromPoint(event.clientY)
  if (next !== null) overIndex.value = next
}

function onHandlePointerUp() {
  if (dragIndex.value !== null && overIndex.value !== null && dragIndex.value !== overIndex.value) {
    emit('reorder', dragIndex.value, overIndex.value)
  }

  dragIndex.value = null
  overIndex.value = null
}

function onHandleKeydown(event, index, playerCount) {
  if (event.key === 'ArrowUp' && index > 0) {
    event.preventDefault()
    emit('move', index, -1)
  }

  if (event.key === 'ArrowDown' && index < playerCount - 1) {
    event.preventDefault()
    emit('move', index, 1)
  }
}
</script>

<template>
  <div>
    <ul ref="listRef" class="space-y-3" aria-label="Players">
      <li
        v-for="(player, index) in players"
        :key="index"
        :data-player-index="index"
        class="rounded-2xl border bg-panel p-3 transition"
        :class="
          dragIndex === index
            ? 'border-gold opacity-70'
            : dragIndex !== null && overIndex === index
              ? 'border-gold ring-2 ring-gold/40'
              : 'border-panel-edge'
        "
      >
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-12 w-10 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-1 rounded-xl text-muted hover:bg-ink hover:text-white active:cursor-grabbing"
            :aria-label="`Drag to reorder player ${index + 1}`"
            @pointerdown="onHandlePointerDown($event, index)"
            @pointermove="onHandlePointerMove"
            @pointerup="onHandlePointerUp"
            @pointercancel="onHandlePointerUp"
            @keydown="onHandleKeydown($event, index, players.length)"
          >
            <span class="grid grid-cols-2 gap-1" aria-hidden="true">
              <span v-for="dot in 6" :key="dot" class="h-1.5 w-1.5 rounded-full bg-current"></span>
            </span>
          </button>
          <span class="w-6 text-center text-sm font-bold text-gold" aria-hidden="true">
            {{ index + 1 }}
          </span>
          <label class="sr-only" :for="`player-name-${index}`">Player {{ index + 1 }} name</label>
          <input
            :id="`player-name-${index}`"
            :value="player"
            type="text"
            maxlength="24"
            autocomplete="off"
            autocapitalize="words"
            :placeholder="`Player ${index + 1}`"
            class="min-h-12 min-w-0 flex-1 rounded-xl border border-transparent bg-ink px-3 text-base text-white placeholder:text-muted/60"
            @input="emit('update-name', index, $event.target.value)"
          />
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-xl text-lg text-danger hover:bg-ink disabled:opacity-30"
            :disabled="!canRemove"
            :aria-label="`Remove player ${index + 1}`"
            @click="emit('remove', index)"
          >
            ×
          </button>
        </div>
      </li>
    </ul>
    <button
      type="button"
      class="mt-4 min-h-12 w-full rounded-2xl border border-dashed border-gold/40 px-4 font-bold text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!canAdd"
      @click="emit('add')"
    >
      + Add Player
    </button>
  </div>
</template>
