import {
  PLAYER_CACHE_TTL_MS,
  PLAYER_STORAGE_KEY,
  readPlayerCache,
  writePlayerCache,
} from '../utils/storageUtils.js'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadCachedPlayers() {
  const storage = getStorage()
  if (!storage) return []

  const cached = readPlayerCache(storage, PLAYER_STORAGE_KEY)
  if (!cached) return []

  return cached.players.map((name) => name.trim()).filter(Boolean)
}

export function saveCachedPlayers(players) {
  const storage = getStorage()
  if (!storage) return

  writePlayerCache(storage, players, {
    key: PLAYER_STORAGE_KEY,
    ttlMs: PLAYER_CACHE_TTL_MS,
  })
}
