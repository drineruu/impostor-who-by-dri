<script setup>
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const {
  requestVote,
  requestReveal,
  requestQuit,
  starterName,
  showImpostorHint,
  eliminatedPlayers,
  remainingCounts,
} = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md grow flex-col justify-center px-5 py-8 text-center">
    <p class="eyebrow text-pine">Game started</p>
    <h1 class="mt-3 font-display text-4xl tracking-tight">
      {{ eliminatedPlayers.length ? 'Keep playing' : `${starterName} starts!` }}
    </h1>
    <p class="mt-6 text-base leading-relaxed text-muted">
      {{
        eliminatedPlayers.length
          ? 'Discuss, then vote out the next player you suspect.'
          : showImpostorHint
            ? 'Put the phone down. Give clues around the group, then come back to vote.'
            : 'Put the phone down. The first speaker is a Keeper. Give clues around the group, then come back to vote.'
      }}
    </p>
    <p v-if="eliminatedPlayers.length" class="mt-4 text-sm font-bold text-pine">
      {{ remainingCounts.remainingImpostors }} impostor{{
        remainingCounts.remainingImpostors === 1 ? '' : 's'
      }}
      still in play
    </p>
    <p v-if="eliminatedPlayers.length" class="mt-3 text-sm text-muted">
      Voted out: {{ eliminatedPlayers.map((player) => player.name).join(', ') }}
    </p>
    <div class="mt-10 flex flex-col gap-3">
      <PrimaryButton @click="requestVote">Vote out a player</PrimaryButton>
      <PrimaryButton variant="secondary" @click="requestReveal">Reveal everyone</PrimaryButton>
      <PrimaryButton variant="danger" @click="requestQuit">Quit Game</PrimaryButton>
    </div>
  </section>
</template>
