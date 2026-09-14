<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PrimaryButton from './PrimaryButton.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'toggle', 'select-all', 'clear'])

const headingRef = ref(null)

function isSelected(category) {
  return props.selected.includes(category)
}

function close() {
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      headingRef.value?.focus()
      return
    }

    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-ink/75 p-0 sm:items-center sm:p-5"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-picker-title"
        class="flex max-h-[85svh] w-full max-w-md flex-col rounded-t-3xl border border-panel-edge bg-panel pb-[env(safe-area-inset-bottom)] sm:rounded-3xl"
      >
        <div class="px-5 pt-5">
          <h2
            id="category-picker-title"
            ref="headingRef"
            tabindex="-1"
            class="text-2xl font-black tracking-tight outline-none"
          >
            Categories
          </h2>
          <p class="mt-1 text-sm text-muted">Choose which word lists to include.</p>
          <div class="mt-4 flex gap-2">
            <button
              type="button"
              class="min-h-11 flex-1 rounded-2xl border border-panel-edge px-3 text-sm font-bold text-white hover:border-gold disabled:opacity-40"
              :disabled="selected.length === categories.length && categories.length > 0"
              @click="emit('select-all')"
            >
              Select all
            </button>
            <button
              type="button"
              class="min-h-11 flex-1 rounded-2xl border border-panel-edge px-3 text-sm font-bold text-white hover:border-gold disabled:opacity-40"
              :disabled="selected.length === 0"
              @click="emit('clear')"
            >
              Deselect all
            </button>
          </div>
        </div>

        <ul class="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto px-3" aria-label="Word categories">
          <li v-for="category in categories" :key="category">
            <button
              type="button"
              role="checkbox"
              :aria-checked="isSelected(category)"
              class="flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left hover:bg-ink"
              @click="emit('toggle', category)"
            >
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
                :class="
                  isSelected(category)
                    ? 'border-gold bg-gold text-ink'
                    : 'border-panel-edge bg-ink text-transparent'
                "
                aria-hidden="true"
              >
                ✓
              </span>
              <span class="font-bold text-white">{{ category }}</span>
            </button>
          </li>
        </ul>

        <p class="px-5 pt-3 text-sm text-muted" aria-live="polite">
          {{ selected.length }} of {{ categories.length }} selected
        </p>

        <div class="p-5 pt-3">
          <PrimaryButton @click="close">Done</PrimaryButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
