<script setup>
import { useGame } from '../composables/useGame.js'
import PlayerList from './PlayerList.vue'
import PrimaryButton from './PrimaryButton.vue'

const {
  players,
  setupError,
  canAddPlayer,
  canRemovePlayer,
  MIN_PLAYERS,
  MAX_PLAYERS,
  setPlayerName,
  addPlayer,
  removePlayer,
  movePlayer,
  reorderPlayers,
  continueFromSetup,
  goHome,
} = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col px-5 py-6">
    <div class="flex items-end justify-between gap-3">
      <h1 class="font-display text-3xl tracking-tight">Players</h1>
      <p class="font-archivo text-pine" aria-live="polite">
        {{ players.length }} / {{ MAX_PLAYERS }}
      </p>
    </div>
    <p class="mt-2 text-sm text-muted">
      Add {{ MIN_PLAYERS }} to {{ MAX_PLAYERS }} players. Drag the handle to rearrange.
    </p>

    <div class="mt-6">
      <PlayerList
        :players="players"
        :can-add="canAddPlayer"
        :can-remove="canRemovePlayer"
        @update-name="setPlayerName"
        @add="addPlayer"
        @remove="removePlayer"
        @move="movePlayer"
        @reorder="reorderPlayers"
      />
    </div>

    <p v-if="setupError" class="mt-4 text-sm font-bold text-danger" role="alert">
      {{ setupError }}
    </p>

    <div class="mt-8 flex flex-col gap-3">
      <PrimaryButton @click="continueFromSetup">Continue</PrimaryButton>
      <PrimaryButton variant="ghost" @click="goHome">Back</PrimaryButton>
    </div>
  </section>
</template>
