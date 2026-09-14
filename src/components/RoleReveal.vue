<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'
import SecretSwipeCard from './SecretSwipeCard.vue'

const headingRef = ref(null)
const isCardOpen = ref(false)

const {
  currentPlayerName,
  currentPlayerIndex,
  revealStep,
  isCurrentImpostor,
  secretWord,
  showImpostorHint,
  hasSeenCurrentRole,
  isLastPlayer,
  nextPlayerName,
  starterName,
  markRoleSeen,
  passToNextPlayer,
  startPlaying,
  requestQuit,
} = useGame()

function onRoleSeen() {
  isCardOpen.value = true
  markRoleSeen()
}

function focusHeading() {
  headingRef.value?.focus()
}

onMounted(focusHeading)
watch([revealStep, currentPlayerIndex], () => {
  isCardOpen.value = false
  nextTick(focusHeading)
})
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-4">
    <div class="flex justify-end">
      <button
        type="button"
        class="flex min-h-12 items-center gap-2 rounded-2xl px-4 text-sm font-bold text-danger hover:bg-danger/10"
        aria-label="End game"
        @click="requestQuit"
      >
        End game
        <span aria-hidden="true" class="text-2xl leading-none">×</span>
      </button>
    </div>

    <div class="flex flex-1 flex-col justify-center py-4">
      <div v-if="revealStep === 'everyoneReady'" class="fade-up rounded-3xl border border-panel-edge bg-panel p-6 text-center">
        <p class="text-sm font-bold tracking-[0.24em] text-gold uppercase">Everyone has their role</p>
        <h1 ref="headingRef" tabindex="-1" class="mt-4 text-3xl font-black tracking-tight">
          Everyone has seen their role.
        </h1>
        <p class="mt-6 text-sm font-bold tracking-[0.24em] text-gold uppercase">Starts the round</p>
        <p class="mt-3 text-4xl font-black text-white">{{ starterName }}</p>
        <p class="mt-4 text-base text-muted">
          {{
            showImpostorHint
              ? 'Give the first clue, then go around the group.'
              : 'Give the first clue. The first speaker is not an impostor.'
          }}
        </p>
        <div class="mt-8">
          <PrimaryButton @click="startPlaying">Start Game</PrimaryButton>
        </div>
      </div>

      <div v-else :key="currentPlayerIndex" class="text-center">
        <p class="text-sm font-bold tracking-[0.24em] text-gold uppercase">Pass the phone to</p>
        <h1 ref="headingRef" tabindex="-1" class="mt-3 text-4xl font-black tracking-tight text-white">
          {{ currentPlayerName }}
        </h1>

        <div class="mt-6">
          <SecretSwipeCard
            :player-name="currentPlayerName"
            :is-impostor="isCurrentImpostor"
            :secret-word="secretWord?.word || ''"
            :hint-word="secretWord?.hint || ''"
            :show-hint="showImpostorHint"
            @seen="onRoleSeen"
            @closed="isCardOpen = false"
          />
        </div>

        <p class="mt-4 min-h-6 text-sm text-muted" aria-live="polite">
          <template v-if="isCardOpen">Memorize it — the card hides itself in a moment.</template>
          <template v-else-if="!hasSeenCurrentRole">Swipe up to see your role first.</template>
          <template v-else>Role hidden. Pass the phone when you're ready.</template>
        </p>

        <div class="mt-4">
          <PrimaryButton :disabled="!hasSeenCurrentRole" @click="passToNextPlayer">
            {{ isLastPlayer ? 'Continue' : `Pass to ${nextPlayerName}` }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </section>
</template>
