<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const variantClass = {
  primary:
    'border-2 border-ink bg-gold text-ink shadow-game hover:bg-gold-dark disabled:border-panel-edge disabled:bg-panel-edge disabled:text-muted disabled:shadow-none',
  secondary:
    'border-2 border-ink bg-panel text-ink shadow-game hover:bg-mist disabled:text-muted disabled:shadow-none',
  danger:
    'border-2 border-danger bg-panel text-danger hover:bg-danger/10 disabled:text-muted',
  ghost: 'bg-transparent text-muted hover:text-ink disabled:text-muted',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-h-14 w-full items-center justify-center rounded-xl px-5 font-archivo text-base tracking-wide transition disabled:cursor-not-allowed"
    :class="variantClass[variant] || variantClass.primary"
  >
    <slot />
  </button>
</template>
