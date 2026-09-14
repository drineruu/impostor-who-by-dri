<script setup>
defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <header class="px-5 pt-6">
    <div class="mx-auto max-w-md text-center">
      <p
        class="font-bold tracking-[0.2em] text-gold uppercase"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        by Dri
      </p>
      <p
        class="mt-1 font-black tracking-tight text-white"
        :class="compact ? 'text-xl' : 'text-3xl'"
      >
        Impostor Who?
      </p>
    </div>
  </header>
</template>
