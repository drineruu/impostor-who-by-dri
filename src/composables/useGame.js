import { computed, reactive } from 'vue'
import wordsFile from '../data/words.json'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  PHASES,
  clampImpostorCount,
  createEmptyPlayers,
  filterWords,
  flattenWords,
  getCategories,
  getDefaultImpostorCount,
  pickImpostorIndexes,
  pickRandomWord,
  pickStarterIndex,
  validatePlayers,
} from '../utils/gameUtils.js'

const wordsData = flattenWords(wordsFile)
import { loadCachedPlayers, saveCachedPlayers } from './usePlayerStorage.js'

function restorePlayers() {
  const cached = loadCachedPlayers().slice(0, MAX_PLAYERS)
  if (!cached.length) return createEmptyPlayers()
  if (cached.length >= MIN_PLAYERS) return cached
  return [...cached, ...createEmptyPlayers(MIN_PLAYERS - cached.length)]
}

function createState() {
  const players = restorePlayers()
  const namedCount = Math.max(players.filter(Boolean).length, MIN_PLAYERS)

  return {
    phase: PHASES.HOME,
    players,
    settings: {
      category: 'All',
      difficulty: 'All',
      impostorCount: getDefaultImpostorCount(namedCount),
      hideImpostorHint: false,
    },
    secretWord: null,
    impostorIndexes: [],
    starterIndex: null,
    currentPlayerIndex: 0,
    revealStep: 'pass',
    hasSeenCurrentRole: false,
    usedWords: [],
    setupError: '',
    settingsError: '',
    quitReturnPhase: null,
  }
}

const state = reactive(createState())

function persistNames() {
  const names = state.players.map((name) => name.trim()).filter(Boolean)
  if (names.length) saveCachedPlayers(names)
}

function resetRoundState() {
  state.secretWord = null
  state.impostorIndexes = []
  state.starterIndex = null
  state.currentPlayerIndex = 0
  state.revealStep = 'pass'
  state.hasSeenCurrentRole = false
  state.setupError = ''
  state.settingsError = ''
  state.quitReturnPhase = null
}

function startRound() {
  const filtered = filterWords(wordsData, state.settings.category, state.settings.difficulty)
  if (filtered.length === 0) {
    state.settingsError = 'No words match those filters. Try a different category or difficulty.'
    return false
  }

  const word = pickRandomWord(filtered, new Set(state.usedWords))
  if (!word) {
    state.settingsError = 'No words are available. Check words.json and try again.'
    return false
  }

  state.secretWord = word
  if (!state.usedWords.includes(word.word)) {
    state.usedWords.push(word.word)
  }
  state.impostorIndexes = pickImpostorIndexes(state.players.length, state.settings.impostorCount)
  state.starterIndex = pickStarterIndex(
    state.players.length,
    state.impostorIndexes,
    state.settings.hideImpostorHint,
  )
  state.currentPlayerIndex = 0
  state.revealStep = 'pass'
  state.hasSeenCurrentRole = false
  state.settingsError = ''
  state.phase = PHASES.ROLE_REVEAL
  return true
}

export function useGame() {
  const phase = computed(() => state.phase)
  const players = computed(() => state.players)
  const settings = computed(() => state.settings)
  const secretWord = computed(() => state.secretWord)
  const currentPlayerIndex = computed(() => state.currentPlayerIndex)
  const revealStep = computed(() => state.revealStep)
  const hasSeenCurrentRole = computed(() => state.hasSeenCurrentRole)
  const setupError = computed(() => state.setupError)
  const settingsError = computed(() => state.settingsError)
  const currentPlayerName = computed(() => state.players[state.currentPlayerIndex] || '')
  const isCurrentImpostor = computed(() =>
    state.impostorIndexes.includes(state.currentPlayerIndex),
  )
  const impostorNames = computed(() =>
    state.impostorIndexes.map((index) => state.players[index]).filter(Boolean),
  )
  const starterName = computed(() =>
    state.starterIndex === null ? '' : state.players[state.starterIndex] || '',
  )
  const showImpostorHint = computed(() => !state.settings.hideImpostorHint)
  const suggestedImpostorCount = computed(() => getDefaultImpostorCount(state.players.length))
  const categories = computed(() => getCategories(wordsData))
  const matchingWordCount = computed(
    () => filterWords(wordsData, state.settings.category, state.settings.difficulty).length,
  )
  const maxImpostors = computed(() => Math.max(1, state.players.length - 1))
  const canAddPlayer = computed(() => state.players.length < MAX_PLAYERS)
  const canRemovePlayer = computed(() => state.players.length > MIN_PLAYERS)
  const isLastPlayer = computed(() => state.currentPlayerIndex >= state.players.length - 1)
  const nextPlayerName = computed(() => {
    if (state.currentPlayerIndex >= state.players.length - 1) return ''
    return state.players[state.currentPlayerIndex + 1] || ''
  })
  const isGameActive = computed(() =>
    [
      PHASES.ROLE_REVEAL,
      PHASES.GAME_STARTED,
      PHASES.REVEAL_CONFIRMATION,
      PHASES.QUIT_CONFIRMATION,
      PHASES.RESULTS,
    ].includes(state.phase),
  )

  function goHome() {
    state.phase = PHASES.HOME
    state.setupError = ''
    state.settingsError = ''
  }

  function goHowToPlay() {
    state.phase = PHASES.HOW_TO_PLAY
  }

  function startFromHome() {
    state.phase = PHASES.PLAYER_SETUP
    state.setupError = ''
  }

  function setPlayerName(index, value) {
    state.players[index] = value
    persistNames()
  }

  function addPlayer() {
    if (state.players.length >= MAX_PLAYERS) return
    state.players.push('')
  }

  function removePlayer(index) {
    if (state.players.length <= MIN_PLAYERS) return
    state.players.splice(index, 1)
    persistNames()
  }

  function movePlayer(index, direction) {
    const next = index + direction
    if (next < 0 || next >= state.players.length) return
    const [item] = state.players.splice(index, 1)
    state.players.splice(next, 0, item)
    persistNames()
  }

  function reorderPlayers(fromIndex, toIndex) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= state.players.length ||
      toIndex >= state.players.length
    ) {
      return
    }

    const [item] = state.players.splice(fromIndex, 1)
    state.players.splice(toIndex, 0, item)
    persistNames()
  }

  function continueFromSetup() {
    const result = validatePlayers(state.players)
    if (!result.ok) {
      state.setupError = result.message
      return
    }

    state.players = result.names
    persistNames()
    state.settings.impostorCount = clampImpostorCount(
      getDefaultImpostorCount(result.names.length),
      result.names.length,
    )
    state.setupError = ''
    state.phase = PHASES.SETTINGS
  }

  function backToSetup() {
    state.phase = PHASES.PLAYER_SETUP
    state.settingsError = ''
  }

  function setCategory(value) {
    state.settings.category = value
    state.settingsError = ''
  }

  function setDifficulty(value) {
    state.settings.difficulty = value
    state.settingsError = ''
  }

  function setImpostorCount(value) {
    state.settings.impostorCount = clampImpostorCount(value, state.players.length)
  }

  function setHideImpostorHint(value) {
    state.settings.hideImpostorHint = Boolean(value)
  }

  function beginGame() {
    startRound()
  }

  function markRoleSeen() {
    state.hasSeenCurrentRole = true
  }

  function passToNextPlayer() {
    if (!state.hasSeenCurrentRole) return

    if (state.currentPlayerIndex >= state.players.length - 1) {
      state.revealStep = 'everyoneReady'
      return
    }

    state.currentPlayerIndex += 1
    state.hasSeenCurrentRole = false
    state.revealStep = 'pass'
  }

  function startPlaying() {
    state.phase = PHASES.GAME_STARTED
  }

  function requestReveal() {
    state.phase = PHASES.REVEAL_CONFIRMATION
  }

  function cancelReveal() {
    state.phase = PHASES.GAME_STARTED
  }

  function confirmReveal() {
    state.phase = PHASES.RESULTS
  }

  function requestQuit() {
    if (state.phase !== PHASES.QUIT_CONFIRMATION) {
      state.quitReturnPhase = state.phase
    }
    state.phase = PHASES.QUIT_CONFIRMATION
  }

  function cancelQuit() {
    state.phase = state.quitReturnPhase || PHASES.GAME_STARTED
    state.quitReturnPhase = null
  }

  function confirmQuit() {
    resetRoundState()
    state.phase = PHASES.HOME
  }

  function playAgain() {
    startRound()
  }

  function newGame() {
    resetRoundState()
    state.phase = PHASES.PLAYER_SETUP
  }

  return {
    PHASES,
    MIN_PLAYERS,
    MAX_PLAYERS,
    phase,
    players,
    settings,
    secretWord,
    currentPlayerIndex,
    revealStep,
    hasSeenCurrentRole,
    setupError,
    settingsError,
    currentPlayerName,
    isCurrentImpostor,
    impostorNames,
    starterName,
    showImpostorHint,
    suggestedImpostorCount,
    categories,
    matchingWordCount,
    maxImpostors,
    canAddPlayer,
    canRemovePlayer,
    isLastPlayer,
    nextPlayerName,
    isGameActive,
    goHome,
    goHowToPlay,
    startFromHome,
    setPlayerName,
    addPlayer,
    removePlayer,
    movePlayer,
    reorderPlayers,
    continueFromSetup,
    backToSetup,
    setCategory,
    setDifficulty,
    setImpostorCount,
    setHideImpostorHint,
    beginGame,
    markRoleSeen,
    passToNextPlayer,
    startPlaying,
    requestReveal,
    cancelReveal,
    confirmReveal,
    requestQuit,
    cancelQuit,
    confirmQuit,
    playAgain,
    newGame,
  }
}
