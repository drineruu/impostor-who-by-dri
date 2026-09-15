<script setup>
import { computed } from 'vue'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { impostorNames, secretWord, playAgain, newGame, goHome, winner } = useGame()

const multiple = computed(() => impostorNames.value.length > 1)
const heading = computed(() => {
  if (winner.value === 'impostors') return 'Impostors win!'
  if (winner.value === 'keepers') return 'Game over'
  return multiple.value ? 'The impostors were...' : 'The impostor was...'
})
const impostorLabel = computed(() => (multiple.value ? 'Impostors' : 'Impostor'))
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col px-5 py-8 text-center">
    <p class="eyebrow text-pine">
      {{ winner === 'keepers' ? 'Last impostor out' : 'Game over' }}
    </p>
    <h1 class="mt-3 font-display text-4xl tracking-tight">{{ heading }}</h1>
    <p v-if="winner" class="eyebrow mt-5 text-muted">
      {{ multiple ? 'The impostors were' : 'The impostor was' }}
    </p>
    <ul class="mt-6 space-y-3" :aria-label="impostorLabel">
      <li
        v-for="name in impostorNames"
        :key="name"
        class="rounded-xl border-2 border-impostor bg-panel py-4 font-display text-3xl text-impostor shadow-game"
      >
        {{ name }}
      </li>
    </ul>
    <p class="eyebrow mt-8 text-pine">Secret word</p>
    <p class="mt-3 font-display text-4xl text-ink">{{ secretWord?.word }}</p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="playAgain">Play Again</PrimaryButton>
      <PrimaryButton variant="secondary" @click="newGame">New Game</PrimaryButton>
      <PrimaryButton variant="ghost" @click="goHome">Home</PrimaryButton>
    </div>
  </section>
</template>
