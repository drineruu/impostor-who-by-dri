<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { confirmReveal, cancelReveal } = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8 text-center">
    <h1 class="text-4xl font-black tracking-tight">Reveal impostors?</h1>
    <p class="mt-5 text-lg text-white">Are you sure you want to reveal the impostor(s)?</p>
    <p class="mt-3 text-base text-muted">Make sure everyone is ready.</p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="confirmReveal">Reveal</PrimaryButton>
      <PrimaryButton variant="secondary" @click="cancelReveal">Cancel</PrimaryButton>
    </div>
  </section>
</template>
