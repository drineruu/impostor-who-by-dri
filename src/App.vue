<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGame } from './composables/useGame.js'
import AppHeader from './components/AppHeader.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import GameResults from './components/GameResults.vue'
import GameSettings from './components/GameSettings.vue'
import GameStarted from './components/GameStarted.vue'
import HomeScreen from './components/HomeScreen.vue'
import HowToPlay from './components/HowToPlay.vue'
import PlayerSetup from './components/PlayerSetup.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import RevealConfirmation from './components/RevealConfirmation.vue'
import RoleReveal from './components/RoleReveal.vue'

const { phase, PHASES, confirmQuit, cancelQuit, isGameActive } = useGame()

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
  <div class="flex min-h-dvh flex-col pb-[env(safe-area-inset-bottom)]">
    <AppHeader v-if="phase !== PHASES.HOME && phase !== PHASES.ROLE_REVEAL" compact />
    <main class="flex flex-1 flex-col">
      <HomeScreen v-if="phase === PHASES.HOME" />
      <HowToPlay v-else-if="phase === PHASES.HOW_TO_PLAY" />
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
  </div>
</template>
