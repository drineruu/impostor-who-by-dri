<script setup>
defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <header class="px-5 pt-5">
    <div class="mx-auto max-w-md">
      <p
        class="font-display tracking-tight text-ink"
        :class="compact ? 'text-xl' : 'text-3xl'"
      >
        Impostor Who?
      </p>
      <p
        class="mt-1 font-archivo text-pine"
        :class="compact ? 'text-[10px]' : 'text-[11px]'"
      >
        by Dri
      </p>
    </div>
  </header>
</template>
