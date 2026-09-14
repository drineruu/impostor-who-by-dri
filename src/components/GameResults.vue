<script setup>
import { computed } from 'vue'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { impostorNames, secretWord, playAgain, newGame, goHome } = useGame()

const multiple = computed(() => impostorNames.value.length > 1)
const heading = computed(() =>
  multiple.value ? 'The impostors were...' : 'The impostor was...',
)
const impostorLabel = computed(() => (multiple.value ? 'Impostors' : 'Impostor'))
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8 text-center">
    <p class="text-sm font-bold tracking-[0.24em] text-gold uppercase">Game over</p>
    <h1 class="mt-4 text-3xl font-black tracking-tight">{{ heading }}</h1>
    <ul class="mt-6 space-y-3" :aria-label="impostorLabel">
      <li
        v-for="name in impostorNames"
        :key="name"
        class="rounded-2xl border border-impostor/40 bg-panel py-4 text-3xl font-black text-impostor"
      >
        {{ name }}
      </li>
    </ul>
    <p class="mt-8 text-sm font-bold tracking-[0.24em] text-gold uppercase">Secret word</p>
    <p class="mt-3 text-4xl font-black text-white">{{ secretWord?.word }}</p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="playAgain">Play Again</PrimaryButton>
      <PrimaryButton variant="secondary" @click="newGame">New Game</PrimaryButton>
      <PrimaryButton variant="ghost" @click="goHome">Home</PrimaryButton>
    </div>
  </section>
</template>
