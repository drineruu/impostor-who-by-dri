<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { requestReveal, requestQuit, starterName, showImpostorHint } = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8 text-center">
    <p class="text-sm font-bold tracking-[0.24em] text-gold uppercase">Game started</p>
    <h1 class="mt-4 text-4xl font-black tracking-tight">{{ starterName }} starts!</h1>
    <p class="mt-6 text-base leading-relaxed text-muted">
      {{
        showImpostorHint
          ? 'Put the phone down. Give clues around the group, then come back when you are ready.'
          : 'Put the phone down. The first speaker is not an impostor. Give clues around the group, then come back when you are ready.'
      }}
    </p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="requestReveal">Reveal Impostor(s)</PrimaryButton>
      <PrimaryButton variant="danger" @click="requestQuit">Quit Game</PrimaryButton>
    </div>
  </section>
</template>
