<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { goHome } = useGame()

const steps = [
  'Add the players.',
  'The game secretly chooses a word.',
  'One or more players are secretly selected as impostors.',
  'Pass the phone around.',
  'Each player privately swipes up to see their role. Players see the secret word. Impostors may see a hint.',
  'Once everyone has seen their role, the app picks who starts the round.',
  'Put the phone down and play the social deduction part yourselves.',
  'When the group is ready, use “Reveal Impostor(s)” to see who the impostors were.',
]
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
    <h1 class="text-3xl font-black tracking-tight">How to Play</h1>
    <ol class="mt-6 space-y-4">
      <li
        v-for="(step, index) in steps"
        :key="step"
        class="flex gap-3 rounded-2xl border border-panel-edge bg-panel p-4"
      >
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-black text-ink">
          {{ index + 1 }}
        </span>
        <p class="pt-1 text-left text-base leading-relaxed text-white">{{ step }}</p>
      </li>
    </ol>
    <p class="mt-6 text-sm leading-relaxed text-muted">
      You can discuss and decide who you suspect yourselves. This app does not manage voting.
    </p>
    <div class="mt-8">
      <PrimaryButton variant="secondary" @click="goHome">Back</PrimaryButton>
    </div>
  </section>
</template>
