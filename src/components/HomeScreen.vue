<script setup>
import { useGame } from '../composables/useGame.js'
import dog from '../assets/suspicious_dog.png'
import PrimaryButton from './PrimaryButton.vue'

const { startFromHome, goHowToPlay, goWriteReview } = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md grow flex-col justify-center px-5 py-10">
    <div class="flex items-center gap-4">
      <img
        :src="dog"
        alt=""
        class="h-20 w-20 shrink-0 -rotate-3 rounded-full border-2 border-ink bg-gold object-cover shadow-game"
      />
      <div class="min-w-0">
        <p class="font-archivo text-pine">by Dri</p>
        <h1 class="mt-1 font-display text-[clamp(1.35rem,5.2vw,2.1rem)] leading-[0.9] text-ink">
          Suspicious Keeper
        </h1>
      </div>
    </div>
    <p class="mt-6 max-w-sm text-lg leading-relaxed text-muted">
      One secret word. One or more impostors. Can you find them?
    </p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="startFromHome">Start Game</PrimaryButton>
      <PrimaryButton variant="secondary" @click="goHowToPlay">How to Play</PrimaryButton>
      <PrimaryButton variant="ghost" @click="goWriteReview">Write a review</PrimaryButton>
    </div>
  </section>
</template>
