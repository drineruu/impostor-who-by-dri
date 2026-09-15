<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PrimaryButton from './PrimaryButton.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
const headingRef = ref(null)

function onKeydown(event) {
  if (event.key === 'Escape') emit('cancel')
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refresh-warning-title"
      @click.self="emit('cancel')"
    >
      <div class="w-full max-w-md rounded-2xl border-2 border-ink bg-panel px-5 py-7 text-center shadow-game">
        <h2
          id="refresh-warning-title"
          ref="headingRef"
          tabindex="-1"
          class="font-display text-3xl tracking-tight outline-none"
        >
          Refresh this page?
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted">
          Reloading the app will end this round. The secret word and roles will be lost.
        </p>
        <div class="mt-8 flex flex-col gap-3">
          <PrimaryButton @click="emit('cancel')">Stay in game</PrimaryButton>
          <PrimaryButton variant="danger" @click="emit('confirm')">Refresh anyway</PrimaryButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
