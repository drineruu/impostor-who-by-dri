<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { goHome } = useGame()

const steps = [
  'Add the players.',
  'The game secretly chooses a word.',
  'One or more players are secretly selected as impostors. Everyone else is a Keeper.',
  'Pass the phone around.',
  'Each player privately swipes up to see their role. Keepers see the secret word. Impostors may see a hint.',
  'Once everyone has seen their role, the app picks who starts the round.',
  'Give clues around the group, then vote out who you think is an impostor.',
  'If you vote out an impostor, you see how many are left. If the last impostor is voted out, they can still try to guess the word — you decide who won.',
  'If impostors ever equal the remaining Keepers, the impostors win.',
  'You can also skip voting and reveal everyone when the group is ready.',
]
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col px-5 py-6">
    <h1 class="font-display text-3xl tracking-tight">How to Play</h1>
    <ol class="mt-6 space-y-3">
      <li
        v-for="(step, index) in steps"
        :key="step"
        class="flex gap-3 rounded-xl border-2 border-ink bg-panel p-4 shadow-game"
      >
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold font-black text-sm text-ink">
          {{ index + 1 }}
        </span>
        <p class="pt-1 text-left text-base leading-relaxed text-ink">{{ step }}</p>
      </li>
    </ol>
    <p class="mt-6 text-sm leading-relaxed text-muted">
      Discuss around the table, then use the phone to vote someone out.
    </p>
    <div class="mt-8">
      <PrimaryButton variant="secondary" @click="goHome">Back</PrimaryButton>
    </div>
  </section>
</template>
