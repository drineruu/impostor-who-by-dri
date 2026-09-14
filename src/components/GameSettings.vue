<script setup>
import { DIFFICULTIES } from '../utils/gameUtils.js'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const {
  settings,
  players,
  categories,
  matchingWordCount,
  maxImpostors,
  suggestedImpostorCount,
  settingsError,
  setCategory,
  setDifficulty,
  setImpostorCount,
  setHideImpostorHint,
  beginGame,
  backToSetup,
} = useGame()
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
    <h1 class="text-3xl font-black tracking-tight">Game Settings</h1>
    <p class="mt-2 text-sm text-muted">Choose how this round should feel.</p>

    <div class="mt-8 space-y-6">
      <fieldset class="rounded-2xl border border-panel-edge bg-panel p-4">
        <legend class="px-1 text-sm font-bold tracking-wide text-gold uppercase">Impostors</legend>
        <div class="mt-3 flex items-center gap-3">
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-2xl border border-panel-edge text-2xl hover:border-gold disabled:opacity-30"
            :disabled="settings.impostorCount <= 1"
            aria-label="Fewer impostors"
            @click="setImpostorCount(settings.impostorCount - 1)"
          >
            −
          </button>
          <p class="flex-1 text-center text-4xl font-black" aria-live="polite">
            {{ settings.impostorCount }}
          </p>
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-2xl border border-panel-edge text-2xl hover:border-gold disabled:opacity-30"
            :disabled="settings.impostorCount >= maxImpostors"
            aria-label="More impostors"
            @click="setImpostorCount(settings.impostorCount + 1)"
          >
            +
          </button>
        </div>
        <p class="mt-3 text-center text-sm text-muted">
          <span class="font-bold">{{ suggestedImpostorCount }} {{ suggestedImpostorCount === 1 ? 'impostor' : 'impostors' }}</span> is suggested for {{ players.length }} players.
        </p>
      </fieldset>

      <fieldset class="rounded-2xl border border-panel-edge bg-panel p-4">
        <legend class="px-1 text-sm font-bold tracking-wide text-gold uppercase">Impostor hint</legend>
        <div class="mt-3 flex items-center justify-between gap-4">
          <div class="min-w-0 text-left">
            <p class="font-bold text-white">Hide hint from impostors</p>
            <p class="mt-1 text-sm text-muted">
              When on, impostors get no hint, and a non-impostor starts the round.
            </p>
          </div>
          <button
            type="button"
            class="relative h-9 w-16 shrink-0 rounded-full transition"
            :class="settings.hideImpostorHint ? 'bg-gold' : 'bg-panel-edge'"
            role="switch"
            :aria-checked="settings.hideImpostorHint"
            aria-label="Hide hint from impostors"
            @click="setHideImpostorHint(!settings.hideImpostorHint)"
          >
            <span
              class="absolute top-1 left-1 h-7 w-7 rounded-full bg-white transition"
              :class="settings.hideImpostorHint ? 'translate-x-7' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </fieldset>

      <div>
        <label for="category" class="text-sm font-bold tracking-wide text-gold uppercase">Category</label>
        <select
          id="category"
          :value="settings.category"
          class="mt-2 min-h-14 w-full rounded-2xl border border-panel-edge bg-panel px-4 text-base text-white"
          @change="setCategory($event.target.value)"
        >
          <option value="All">All</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div>
        <label for="difficulty" class="text-sm font-bold tracking-wide text-gold uppercase">Difficulty</label>
        <select
          id="difficulty"
          :value="settings.difficulty"
          class="mt-2 min-h-14 w-full rounded-2xl border border-panel-edge bg-panel px-4 text-base text-white"
          @change="setDifficulty($event.target.value)"
        >
          <option value="All">All</option>
          <option v-for="difficulty in DIFFICULTIES" :key="difficulty" :value="difficulty">
            {{ difficulty }}
          </option>
        </select>
      </div>

      <p class="text-sm text-muted" aria-live="polite">
        {{ matchingWordCount }} word{{ matchingWordCount === 1 ? '' : 's' }} match these filters.
      </p>
    </div>

    <p v-if="settingsError" class="mt-4 text-sm font-bold text-danger" role="alert">
      {{ settingsError }}
    </p>

    <div class="mt-8 flex flex-col gap-3">
      <PrimaryButton :disabled="matchingWordCount === 0" @click="beginGame">
        Start Role Reveal
      </PrimaryButton>
      <PrimaryButton variant="ghost" @click="backToSetup">Back</PrimaryButton>
    </div>
  </section>
</template>
