export const PHASES = {
  HOME: 'HOME',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  WRITE_REVIEW: 'WRITE_REVIEW',
  PLAYER_SETUP: 'PLAYER_SETUP',
  SETTINGS: 'SETTINGS',
  ROLE_REVEAL: 'ROLE_REVEAL',
  GAME_STARTED: 'GAME_STARTED',
  VOTE: 'VOTE',
  VOTE_RESULT: 'VOTE_RESULT',
  REVEAL_CONFIRMATION: 'REVEAL_CONFIRMATION',
  QUIT_CONFIRMATION: 'QUIT_CONFIRMATION',
  RESULTS: 'RESULTS',
}

export const MIN_PLAYERS = 4
export const MAX_PLAYERS = 20
export const DIFFICULTIES = ['easy', 'medium', 'hard']

export function createEmptyPlayers(count = MIN_PLAYERS) {
  return Array.from({ length: count }, () => '')
}

export function getDefaultImpostorCount(playerCount) {
  if (playerCount <= 6) return 1
  if (playerCount <= 11) return 2
  if (playerCount <= 15) return 3
  return 4
}

export function getMaxImpostors(playerCount) {
  return Math.max(1, playerCount - 1)
}

export function clampImpostorCount(impostorCount, playerCount) {
  const max = getMaxImpostors(playerCount)
  const value = Number(impostorCount)
  if (!Number.isInteger(value)) return Math.min(getDefaultImpostorCount(playerCount), max)
  return Math.min(max, Math.max(1, value))
}

export function normalizePlayerNames(players) {
  return players.map((name) => String(name ?? '').trim())
}

export function validatePlayers(players) {
  const names = normalizePlayerNames(players)

  if (names.length < MIN_PLAYERS) {
    return { ok: false, names, message: `Add at least ${MIN_PLAYERS} players.` }
  }

  if (names.length > MAX_PLAYERS) {
    return { ok: false, names, message: `You can have at most ${MAX_PLAYERS} players.` }
  }

  if (names.some((name) => !name)) {
    return { ok: false, names, message: 'Every player needs a name.' }
  }

  const seen = new Set()
  for (const name of names) {
    const key = name.toLowerCase()
    if (seen.has(key)) {
      return { ok: false, names, message: 'Player names must be unique.' }
    }
    seen.add(key)
  }

  return { ok: true, names, message: '' }
}

function isValidDifficulty(value) {
  return DIFFICULTIES.includes(value)
}

function pushWordEntries(out, category, entries) {
  if (!Array.isArray(entries)) return

  for (const item of entries) {
    if (!item || typeof item.word !== 'string' || !item.word.trim()) continue

    out.push({
      word: item.word.trim(),
      hint: String(item.hint ?? '').trim(),
      category,
      difficulty: isValidDifficulty(item.difficulty) ? item.difficulty : 'easy',
    })
  }
}

export function flattenWords(data) {
  if (Array.isArray(data)) {
    return data
      .filter((item) => item && typeof item.word === 'string' && item.word.trim())
      .map((item) => ({
        word: item.word.trim(),
        hint: String(item.hint ?? '').trim(),
        category: String(item.category ?? 'Uncategorized').trim() || 'Uncategorized',
        difficulty: isValidDifficulty(item.difficulty) ? item.difficulty : 'easy',
      }))
  }

  if (!data || typeof data !== 'object') return []

  const out = []
  for (const [category, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      pushWordEntries(out, category, value)
      continue
    }

    if (!value || typeof value !== 'object') continue
    for (const entries of Object.values(value)) {
      pushWordEntries(out, category, entries)
    }
  }

  return out
}

export function getCategories(words) {
  return [...new Set(words.map((item) => item.category))].sort()
}

export function normalizeCategorySelection(selected, allCategories) {
  const available = Array.isArray(allCategories) ? allCategories : []
  if (!Array.isArray(selected)) return [...available]
  return available.filter((category) => selected.includes(category))
}

export function formatCategorySummary(selected, allCategories) {
  const chosen = normalizeCategorySelection(selected, allCategories)
  if (allCategories.length === 0) return 'No categories'
  if (chosen.length === 0) return 'None selected'
  if (chosen.length === allCategories.length) return 'All categories'
  if (chosen.length <= 2) return chosen.join(', ')
  return `${chosen.length} categories`
}

export function filterWords(words, categories = 'All', difficulty = 'All') {
  if (!Array.isArray(words)) return []

  const selected =
    categories === 'All' || categories == null
      ? 'All'
      : typeof categories === 'string'
        ? [categories]
        : Array.isArray(categories)
          ? categories
          : []

  return words.filter((item) => {
    if (!item || typeof item.word !== 'string' || !item.word.trim()) return false
    const categoryOk = selected === 'All' || selected.includes(item.category)
    const difficultyOk = difficulty === 'All' || item.difficulty === difficulty
    return categoryOk && difficultyOk
  })
}

export function pickRandomWord(candidates, usedWords = new Set()) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null

  const unused = candidates.filter((item) => !usedWords.has(item.word))
  const pool = unused.length > 0 ? unused : candidates
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickImpostorIndexes(playerCount, impostorCount) {
  const count = clampImpostorCount(impostorCount, playerCount)
  const indexes = Array.from({ length: playerCount }, (_, index) => index)

  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
  }

  return indexes.slice(0, count).sort((a, b) => a - b)
}

export function pickStarterIndex(playerCount, impostorIndexes, hideImpostorHint) {
  const impostors = new Set(impostorIndexes)
  const pool = []

  for (let index = 0; index < playerCount; index += 1) {
    if (hideImpostorHint && impostors.has(index)) continue
    pool.push(index)
  }

  const choices = pool.length > 0 ? pool : Array.from({ length: playerCount }, (_, index) => index)
  return choices[Math.floor(Math.random() * choices.length)]
}

export function remainingRoleCounts(playerCount, impostorIndexes, eliminatedIndexes = []) {
  const eliminated = new Set(eliminatedIndexes)
  const impostors = new Set(impostorIndexes)
  let remainingImpostors = 0
  let remainingKeepers = 0

  for (let index = 0; index < playerCount; index += 1) {
    if (eliminated.has(index)) continue
    if (impostors.has(index)) remainingImpostors += 1
    else remainingKeepers += 1
  }

  return { remainingImpostors, remainingKeepers }
}

export function getRoundWinner(remainingImpostors, remainingKeepers) {
  if (remainingImpostors <= 0) return 'keepers'
  if (remainingImpostors >= remainingKeepers) return 'impostors'
  return null
}
