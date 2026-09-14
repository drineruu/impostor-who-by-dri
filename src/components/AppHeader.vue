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
    <div class="mx-auto max-w-md text-center">
      <p
        class="font-black tracking-tight text-white"
        :class="compact ? 'text-xl' : 'text-3xl'"
      >
        Impostor Who?
      </p>
      <p
        class="mt-1 font-medium tracking-[0.16em] text-muted/70 uppercase"
        :class="compact ? 'text-[10px]' : 'text-[11px]'"
      >
        by Dri
      </p>
    </div>
  </header>
</template>
