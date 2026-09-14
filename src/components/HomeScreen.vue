<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { startFromHome, goHowToPlay } = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 text-center">
    <p class="text-sm font-bold tracking-[0.28em] text-gold uppercase">by Dri</p>
    <h1 class="mt-3 text-5xl font-black leading-none tracking-tight text-white">
      Impostor Who?
    </h1>
    <p class="mx-auto mt-6 max-w-xs text-lg leading-relaxed text-muted">
      One secret word. One or more impostors. Can you find them?
    </p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="startFromHome">Start Game</PrimaryButton>
      <PrimaryButton variant="secondary" @click="goHowToPlay">How to Play</PrimaryButton>
    </div>
  </section>
</template>
