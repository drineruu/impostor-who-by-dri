<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGame } from './composables/useGame.js'
import { useRefreshGuard } from './composables/useRefreshGuard.js'
import AppHeader from './components/AppHeader.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import GameResults from './components/GameResults.vue'
import GameSettings from './components/GameSettings.vue'
import GameStarted from './components/GameStarted.vue'
import HomeScreen from './components/HomeScreen.vue'
import HowToPlay from './components/HowToPlay.vue'
import PlayerSetup from './components/PlayerSetup.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import RefreshConfirmModal from './components/RefreshConfirmModal.vue'
import RevealConfirmation from './components/RevealConfirmation.vue'
import RoleReveal from './components/RoleReveal.vue'
import WriteReview from './components/WriteReview.vue'

const { phase, PHASES, confirmQuit, cancelQuit, isGameActive } = useGame()
const { promptOpen, pullDistance, pullThreshold, confirmRefresh, cancelRefresh } = useRefreshGuard(
  isGameActive,
)

function warnIfGameActive(event) {
  if (!isGameActive.value) return
  event.preventDefault()
  event.returnValue = 'Refreshing will end the current game.'
}

onMounted(() => {
  window.addEventListener('beforeunload', warnIfGameActive)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', warnIfGameActive)
})
</script>

<template>
  <div class="flex min-h-svh flex-col pb-[env(safe-area-inset-bottom)]">
    <AppHeader v-if="phase !== PHASES.HOME && phase !== PHASES.ROLE_REVEAL" compact />
    <main class="flex w-full grow flex-col">
      <HomeScreen v-if="phase === PHASES.HOME" />
      <HowToPlay v-else-if="phase === PHASES.HOW_TO_PLAY" />
      <WriteReview v-else-if="phase === PHASES.WRITE_REVIEW" />
      <PlayerSetup v-else-if="phase === PHASES.PLAYER_SETUP" />
      <GameSettings v-else-if="phase === PHASES.SETTINGS" />
      <RoleReveal v-else-if="phase === PHASES.ROLE_REVEAL" />
      <GameStarted v-else-if="phase === PHASES.GAME_STARTED" />
      <RevealConfirmation v-else-if="phase === PHASES.REVEAL_CONFIRMATION" />
      <ConfirmDialog
        v-else-if="phase === PHASES.QUIT_CONFIRMATION"
        title="End game?"
        message="Are you sure you want to end this game? The secret word and roles will be discarded."
      >
        <PrimaryButton variant="danger" @click="confirmQuit">End Game</PrimaryButton>
        <PrimaryButton variant="secondary" @click="cancelQuit">Cancel</PrimaryButton>
      </ConfirmDialog>
      <GameResults v-else-if="phase === PHASES.RESULTS" />
    </main>

    <div
      v-if="pullDistance > 10"
      class="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]"
      :style="{ transform: `translateY(${Math.max(0, pullDistance - 24)}px)` }"
    >
      <p
        class="rounded-full border border-gold/40 bg-panel px-4 py-2 text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        :class="pullDistance >= pullThreshold ? 'text-gold' : 'text-muted'"
      >
        {{
          pullDistance >= pullThreshold
            ? 'Release to refresh'
            : 'Refreshing will reset this game'
        }}
      </p>
    </div>

    <RefreshConfirmModal
      :open="promptOpen"
      @cancel="cancelRefresh"
      @confirm="confirmRefresh"
    />
  </div>
</template>
