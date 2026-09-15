export const PLAYER_STORAGE_KEY = 'suspicious-keeper-players'
export const PLAYER_CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function safeParse(value) {
  if (typeof value !== 'string' || !value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function isPlayerCacheValid(data, now = Date.now()) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  if (!Array.isArray(data.players)) return false
  if (typeof data.expiresAt !== 'number' || !Number.isFinite(data.expiresAt)) return false
  if (now >= data.expiresAt) return false
  if (!data.players.every((name) => typeof name === 'string')) return false
  return true
}

export function readPlayerCache(storage, key = PLAYER_STORAGE_KEY, now = Date.now()) {
  try {
    const parsed = safeParse(storage.getItem(key))
    if (!isPlayerCacheValid(parsed, now)) {
      if (parsed !== null) storage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function writePlayerCache(
  storage,
  players,
  {
    key = PLAYER_STORAGE_KEY,
    ttlMs = PLAYER_CACHE_TTL_MS,
    now = Date.now(),
  } = {},
) {
  const names = players
    .filter((name) => typeof name === 'string')
    .map((name) => name.trim())
    .filter(Boolean)

  if (!names.length) return

  try {
    storage.setItem(
      key,
      JSON.stringify({
        players: names,
        expiresAt: now + ttlMs,
      }),
    )
  } catch {
    // Ignore quota / private-mode failures; the game still works in memory.
  }
}

export function clearPlayerCache(storage, key = PLAYER_STORAGE_KEY) {
  try {
    storage.removeItem(key)
  } catch {
    // Ignore storage access errors.
  }
}
