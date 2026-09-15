<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootRef = ref(null)

const normalized = computed(() =>
  props.options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  ),
)

const selected = computed(
  () => normalized.value.find((option) => option.value === props.modelValue) || normalized.value[0],
)

const labelId = computed(() => `${props.id}-label`)
const listId = computed(() => `${props.id}-list`)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function choose(value) {
  emit('update:modelValue', value)
  close()
}

function onDocumentPointerDown(event) {
  if (!open.value) return
  if (rootRef.value?.contains(event.target)) return
  close()
}

function onKeydown(event) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    document.getElementById(listId.value)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    return
  }
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef">
    <label :id="labelId" :for="id" class="eyebrow text-pine">{{ label }}</label>
    <button
      :id="id"
      type="button"
      class="mt-2 flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border-2 bg-panel px-4 text-left text-base text-ink shadow-game transition"
      :class="open ? 'border-pine' : 'border-ink hover:bg-mist'"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-labelledby="labelId"
      @click="toggle"
    >
      <span>{{ selected?.label }}</span>
      <span class="text-pine transition" :class="{ 'rotate-180': open }" aria-hidden="true">▾</span>
    </button>

    <ul
      v-if="open"
      :id="listId"
      class="mt-2 w-full overflow-hidden rounded-xl border-2 border-ink bg-panel py-1 shadow-game"
      role="listbox"
      :aria-labelledby="labelId"
    >
      <li v-for="option in normalized" :key="option.value">
        <button
          type="button"
          role="option"
          class="flex min-h-12 w-full items-center justify-between px-4 text-left text-base transition"
          :class="
            option.value === modelValue
              ? 'bg-gold/40 font-bold text-ink'
              : 'text-ink hover:bg-mist'
          "
          :aria-selected="option.value === modelValue"
          @click="choose(option.value)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.value === modelValue" aria-hidden="true">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>
