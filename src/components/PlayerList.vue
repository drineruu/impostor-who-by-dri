<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
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
const ghost = ref(null)
const dragOffsetY = ref(0)

const ghostStyle = computed(() => {
  if (!ghost.value) return null
  return {
    position: 'fixed',
    left: `${ghost.value.left}px`,
    top: `${ghost.value.top}px`,
    width: `${ghost.value.width}px`,
    height: `${ghost.value.height}px`,
    zIndex: 60,
    pointerEvents: 'none',
    transform: 'scale(1.03) rotate(-0.6deg)',
  }
})

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

function updateGhost(event) {
  if (!ghost.value) return
  ghost.value = {
    ...ghost.value,
    top: event.clientY - dragOffsetY.value,
  }
}

function onWindowMove(event) {
  if (dragIndex.value === null) return
  if (event.cancelable) event.preventDefault()
  updateGhost(event)
  const next = itemIndexFromPoint(event.clientY)
  if (next !== null) overIndex.value = next
}

function addDragListeners() {
  window.addEventListener('pointermove', onWindowMove, { passive: false })
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

function removeDragListeners() {
  window.removeEventListener('pointermove', onWindowMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
}

function endDrag() {
  removeDragListeners()

  if (dragIndex.value !== null && overIndex.value !== null && dragIndex.value !== overIndex.value) {
    emit('reorder', dragIndex.value, overIndex.value)
  }

  dragIndex.value = null
  overIndex.value = null
  ghost.value = null
  document.body.style.userSelect = ''
}

function onHandlePointerDown(event, index) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  const row = event.currentTarget.closest('[data-player-index]')
  const rect = row?.getBoundingClientRect()
  if (!rect) return

  dragIndex.value = index
  overIndex.value = index
  dragOffsetY.value = event.clientY - rect.top
  ghost.value = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    name: props.players[index],
    number: index + 1,
  }
  document.body.style.userSelect = 'none'
  addDragListeners()

  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch {
    // Window listeners still track the drag if capture is unavailable.
  }
  event.preventDefault()
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

onBeforeUnmount(() => {
  removeDragListeners()
  document.body.style.userSelect = ''
})
</script>

<template>
  <div>
    <ul ref="listRef" class="space-y-3" aria-label="Players">
      <li
        v-for="(player, index) in players"
        :key="index"
        :data-player-index="index"
        class="rounded-xl border-2 bg-panel p-3 transition"
        :class="
          dragIndex === index
            ? 'border-dashed border-ink bg-mist'
            : dragIndex !== null && overIndex === index
              ? 'border-pine ring-2 ring-gold'
              : 'border-ink'
        "
      >
        <div
          class="flex items-center gap-2"
          :class="{ 'opacity-0': dragIndex === index }"
        >
          <button
            type="button"
            class="flex h-12 w-10 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-1 rounded-lg text-muted hover:bg-mist hover:text-ink active:cursor-grabbing"
            :aria-label="`Drag to rearrange player ${index + 1}`"
            :aria-grabbed="dragIndex === index"
            @pointerdown="onHandlePointerDown($event, index)"
            @keydown="onHandleKeydown($event, index, players.length)"
          >
            <span class="grid grid-cols-2 gap-1" aria-hidden="true">
              <span v-for="dot in 6" :key="dot" class="h-1.5 w-1.5 rounded-full bg-current"></span>
            </span>
          </button>
          <span class="w-6 text-center text-sm font-bold text-pine" aria-hidden="true">
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
            class="min-h-12 min-w-0 flex-1 rounded-lg border-2 border-ink bg-mist px-3 text-base text-ink placeholder:text-muted/70"
            @input="emit('update-name', index, $event.target.value)"
          />
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-lg text-lg text-danger hover:bg-mist disabled:opacity-30"
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
      class="mt-4 min-h-12 w-full rounded-xl border-2 border-dashed border-ink px-4 font-archivo text-pine hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!canAdd"
      @click="emit('add')"
    >
      + Add Player
    </button>

    <Teleport to="body">
      <div
        v-if="ghost"
        class="rounded-xl border-2 border-ink bg-panel p-3 shadow-game"
        :style="ghostStyle"
      >
        <div class="flex items-center gap-2">
          <span
            class="flex h-12 w-10 shrink-0 items-center justify-center rounded-xl text-pine"
            aria-hidden="true"
          >
            <span class="grid grid-cols-2 gap-1">
              <span v-for="dot in 6" :key="dot" class="h-1.5 w-1.5 rounded-full bg-current"></span>
            </span>
          </span>
          <span class="w-6 text-center text-sm font-bold text-pine" aria-hidden="true">
            {{ ghost.number }}
          </span>
          <span
            class="flex min-h-12 min-w-0 flex-1 items-center rounded-lg bg-mist px-3 text-base text-ink"
          >
            {{ ghost.name || `Player ${ghost.number}` }}
          </span>
          <span class="flex h-12 w-12 items-center justify-center text-lg text-danger/50" aria-hidden="true">
            ×
          </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
