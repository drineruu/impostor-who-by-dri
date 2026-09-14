import { onBeforeUnmount, ref, watch } from 'vue'

const PULL_THRESHOLD = 72

function scrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

export function useRefreshGuard(isGameActive) {
  const promptOpen = ref(false)
  const pullDistance = ref(0)

  let tracking = false
  let startedAtTop = false
  let startX = 0
  let startY = 0

  function confirmRefresh() {
    window.location.reload()
  }

  function cancelRefresh() {
    promptOpen.value = false
    pullDistance.value = 0
  }

  function onTouchStart(event) {
    if (!isGameActive.value || promptOpen.value) return
    if (event.touches.length !== 1) return

    tracking = true
    startedAtTop = scrollTop() <= 0
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
    pullDistance.value = 0
  }

  function onTouchMove(event) {
    if (!tracking || !isGameActive.value || promptOpen.value) return

    const touch = event.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY

    if (!startedAtTop || scrollTop() > 0 || deltaY <= 0 || Math.abs(deltaX) > deltaY) {
      pullDistance.value = 0
      return
    }

    if (event.cancelable) event.preventDefault()
    pullDistance.value = Math.min(deltaY * 0.55, 132)
  }

  function onTouchEnd() {
    if (!tracking) return
    tracking = false

    if (isGameActive.value && pullDistance.value >= PULL_THRESHOLD) {
      promptOpen.value = true
    }

    pullDistance.value = 0
  }

  function attach() {
    document.documentElement.classList.add('game-locked')
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
  }

  function detach() {
    document.documentElement.classList.remove('game-locked')
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchcancel', onTouchEnd)
    tracking = false
    pullDistance.value = 0
  }

  watch(
    isGameActive,
    (active) => {
      detach()
      if (!active) {
        promptOpen.value = false
        return
      }
      attach()
    },
    { immediate: true },
  )

  onBeforeUnmount(detach)

  return {
    promptOpen,
    pullDistance,
    pullThreshold: PULL_THRESHOLD,
    confirmRefresh,
    cancelRefresh,
  }
}
