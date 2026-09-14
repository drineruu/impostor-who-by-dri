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
    'bg-gold text-ink hover:bg-gold-dark disabled:bg-panel-edge disabled:text-muted',
  secondary:
    'border border-panel-edge bg-panel text-white hover:border-gold hover:text-gold disabled:text-muted',
  danger:
    'border border-danger/40 bg-transparent text-danger hover:bg-danger/10 disabled:text-muted',
  ghost: 'bg-transparent text-muted hover:text-white disabled:text-muted',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-5 text-base font-bold tracking-wide transition disabled:cursor-not-allowed"
    :class="variantClass[variant] || variantClass.primary"
  >
    <slot />
  </button>
</template>
