<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: 'Confirm',
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
  danger: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <section class="mx-auto flex w-full max-w-md grow flex-col justify-center px-5 py-8 text-center">
    <h1 class="font-display text-4xl tracking-tight">{{ title }}</h1>
    <p class="mt-5 text-lg text-muted">{{ message }}</p>
    <div class="mt-10 flex flex-col gap-3">
      <slot />
    </div>
  </section>
</template>
