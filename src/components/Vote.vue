<script setup>
import { ref } from 'vue'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const {
  players,
  eliminatedIndexes,
  confirmVote,
  cancelVote,
  remainingCounts,
} = useGame()

const selectedIndex = ref(null)

function isEliminated(index) {
  return eliminatedIndexes.value.includes(index)
}

function selectPlayer(index) {
  if (isEliminated(index)) return
  selectedIndex.value = index
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-md grow flex-col px-5 py-6">
    <h1 class="font-display text-3xl tracking-tight">Vote out a player</h1>
    <p class="mt-2 text-sm text-muted">
      Choose who the group thinks is an impostor. Their role will be revealed.
    </p>
    <p v-if="eliminatedIndexes.length" class="mt-3 text-sm font-bold text-pine" aria-live="polite">
      {{ remainingCounts.remainingImpostors }} impostor{{
        remainingCounts.remainingImpostors === 1 ? '' : 's'
      }}
      still in play.
    </p>

    <ul class="mt-6 space-y-2" aria-label="Players">
      <li v-for="(name, index) in players" :key="`${index}-${name}`">
        <button
          type="button"
          class="flex min-h-14 w-full items-center justify-between rounded-xl border-2 px-4 text-left text-base font-bold transition"
          :class="
            isEliminated(index)
              ? 'cursor-not-allowed border-panel-edge bg-mist text-muted'
              : selectedIndex === index
                ? 'border-ink bg-gold text-ink shadow-game'
                : 'border-ink bg-panel text-ink hover:bg-mist'
          "
          :disabled="isEliminated(index)"
          :aria-pressed="selectedIndex === index"
          @click="selectPlayer(index)"
        >
          <span>{{ name }}</span>
          <span v-if="isEliminated(index)" class="text-sm font-medium">Voted out</span>
        </button>
      </li>
    </ul>

    <div class="mt-8 flex flex-col gap-3">
      <PrimaryButton :disabled="selectedIndex === null" @click="confirmVote(selectedIndex)">
        {{ selectedIndex === null ? 'Select a player' : `Vote out ${players[selectedIndex]}` }}
      </PrimaryButton>
      <PrimaryButton variant="ghost" @click="cancelVote">Back</PrimaryButton>
    </div>
  </section>
</template>
