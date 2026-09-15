<script setup>
import { ref } from 'vue'
import { DIFFICULTIES } from '../utils/gameUtils.js'
import { useGame } from '../composables/useGame.js'
import CategoryPickerModal from './CategoryPickerModal.vue'
import PrimaryButton from './PrimaryButton.vue'
import SelectMenu from './SelectMenu.vue'

const {
  settings,
  players,
  categories,
  selectedCategories,
  categorySummary,
  matchingWordCount,
  maxImpostors,
  suggestedImpostorCount,
  settingsError,
  toggleCategory,
  selectAllCategories,
  clearCategories,
  setDifficulty,
  setImpostorCount,
  setHideImpostorHint,
  beginGame,
  backToSetup,
} = useGame()

const categoryPickerOpen = ref(false)

const difficultyOptions = [
  { value: 'All', label: 'All' },
  ...DIFFICULTIES.map((difficulty) => ({
    value: difficulty,
    label: difficulty[0].toUpperCase() + difficulty.slice(1),
  })),
]
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col px-5 py-6">
    <h1 class="font-display text-3xl tracking-tight">Game Settings</h1>
    <p class="mt-2 text-sm text-muted">Choose how this round should feel.</p>

    <div class="mt-8 space-y-6">
      <fieldset class="rounded-xl border-2 border-ink bg-panel p-4 shadow-game">
        <legend class="eyebrow px-1 text-pine">Impostors</legend>
        <div class="mt-3 flex items-center gap-3">
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-mist text-2xl hover:bg-gold disabled:border-panel-edge disabled:bg-mist disabled:text-muted"
            :disabled="settings.impostorCount <= 1"
            aria-label="Fewer impostors"
            @click="setImpostorCount(settings.impostorCount - 1)"
          >
            −
          </button>
          <p class="flex-1 text-center font-display text-4xl" aria-live="polite">
            {{ settings.impostorCount }}
          </p>
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-mist text-2xl hover:bg-gold disabled:border-panel-edge disabled:bg-mist disabled:text-muted"
            :disabled="settings.impostorCount >= maxImpostors"
            aria-label="More impostors"
            @click="setImpostorCount(settings.impostorCount + 1)"
          >
            +
          </button>
        </div>
        <p class="mt-3 text-center text-sm text-muted">
          <span class="font-bold">{{ suggestedImpostorCount }} {{ suggestedImpostorCount === 1 ? 'impostor is' : 'impostors are' }}</span> suggested for {{ players.length }} players.
        </p>
      </fieldset>

      <fieldset class="rounded-xl border-2 border-ink bg-panel p-4 shadow-game">
        <legend class="eyebrow px-1 text-pine">Impostor hint</legend>
        <div class="mt-3 flex items-center justify-between gap-4">
          <div class="min-w-0 text-left">
            <p class="font-bold text-ink">Hide hint from impostors</p>
            <p class="mt-1 text-sm text-muted">
              When on, impostors get no hint, and a non-impostor starts the round.
            </p>
          </div>
          <button
            type="button"
            class="relative h-9 w-16 shrink-0 rounded-full border-2 border-ink transition"
            :class="settings.hideImpostorHint ? 'bg-gold' : 'bg-mist'"
            role="switch"
            :aria-checked="settings.hideImpostorHint"
            aria-label="Hide hint from impostors"
            @click="setHideImpostorHint(!settings.hideImpostorHint)"
          >
            <span
              class="absolute top-0.5 left-0.5 h-7 w-7 rounded-full border-2 border-ink bg-panel shadow-game transition"
              :class="settings.hideImpostorHint ? 'translate-x-7' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </fieldset>

      <div>
        <p class="eyebrow text-pine">Categories</p>
        <button
          type="button"
          class="mt-2 flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border-2 border-ink bg-panel px-4 text-left text-base text-ink shadow-game hover:bg-mist"
          aria-haspopup="dialog"
          :aria-expanded="categoryPickerOpen"
          @click="categoryPickerOpen = true"
        >
          <span>{{ categorySummary }}</span>
          <span class="font-archivo text-pine" aria-hidden="true">Choose</span>
        </button>
      </div>

      <SelectMenu
        id="difficulty"
        label="Difficulty"
        :model-value="settings.difficulty"
        :options="difficultyOptions"
        @update:model-value="setDifficulty"
      />

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

    <CategoryPickerModal
      :open="categoryPickerOpen"
      :categories="categories"
      :selected="selectedCategories"
      @close="categoryPickerOpen = false"
      @toggle="toggleCategory"
      @select-all="selectAllCategories"
      @clear="clearCategories"
    />
  </section>
</template>
