<script setup>
import { computed } from 'vue'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { lastVote, continueAfterVote } = useGame()

const impostorLabel = computed(() => {
  const count = lastVote.value?.remainingImpostors ?? 0
  if (count === 1) return '1 impostor remaining'
  return `${count} impostors remaining`
})

const winnerCopy = computed(() => {
  if (lastVote.value?.winner === 'impostors') {
    return 'There are at least as many impostors as Keepers. Impostors win!'
  }
  return ''
})

const lastImpostorOut = computed(
  () => lastVote.value?.wasImpostor && lastVote.value?.winner === 'keepers',
)
</script>

<template>
  <section
    v-if="lastVote"
    class="mx-auto flex w-full max-w-md grow flex-col justify-center px-5 py-8 text-center"
  >
    <p class="eyebrow text-pine">Voted out</p>
    <h1 class="mt-3 font-display text-4xl tracking-tight text-ink">{{ lastVote.name }}</h1>
    <p
      class="mt-6 font-display text-2xl"
      :class="lastVote.wasImpostor ? 'text-impostor' : 'text-crew'"
    >
      {{ lastVote.wasImpostor ? 'was an Impostor' : 'was a Keeper' }}
    </p>
    <p class="mt-6 text-lg text-muted">{{ impostorLabel }}</p>
    <p v-if="lastImpostorOut" class="mt-4 text-base leading-relaxed text-muted">
      The last impostor can still try to guess the word. You decide who won.
    </p>
    <p v-else-if="winnerCopy" class="mt-4 font-archivo text-xl text-pine">{{ winnerCopy }}</p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="continueAfterVote">
        {{ lastVote.winner ? 'See results' : 'Keep playing' }}
      </PrimaryButton>
    </div>
  </section>
</template>
