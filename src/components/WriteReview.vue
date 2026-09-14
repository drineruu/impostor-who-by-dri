<script setup>
import { computed, ref } from 'vue'
import { REVIEW_EMAIL, REVIEW_MAX_LENGTH, REVIEW_SUBJECT } from '../data/contact.js'
import { useGame } from '../composables/useGame.js'
import PrimaryButton from './PrimaryButton.vue'

const { goHome } = useGame()

const name = ref('')
const message = ref('')

const canSend = computed(() => message.value.trim().length > 0)

function sendReview() {
  if (!canSend.value) return

  const lines = [
    name.value.trim() ? `From: ${name.value.trim()}` : 'From: Anonymous',
    '',
    message.value.trim().slice(0, REVIEW_MAX_LENGTH),
  ]

  const url = `mailto:${REVIEW_EMAIL}?subject=${encodeURIComponent(REVIEW_SUBJECT)}&body=${encodeURIComponent(lines.join('\n'))}`
  window.location.href = url
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col px-5 py-6">
    <h1 class="text-3xl font-black tracking-tight">Write a review</h1>
    <p class="mt-2 text-sm text-muted">
      Tell the developer what you thought. This opens your email app so you can send it.
    </p>

    <form class="mt-8 flex flex-col gap-5" @submit.prevent="sendReview">
      <div>
        <label for="review-name" class="text-sm font-bold tracking-wide text-gold uppercase">
          Name
          <span class="font-medium tracking-normal text-muted normal-case">optional</span>
        </label>
        <input
          id="review-name"
          v-model="name"
          type="text"
          maxlength="40"
          autocomplete="name"
          placeholder="Your name"
          class="mt-2 min-h-14 w-full rounded-2xl border border-panel-edge bg-panel px-4 text-base text-white placeholder:text-muted/60"
        />
      </div>

      <div>
        <label for="review-message" class="text-sm font-bold tracking-wide text-gold uppercase">
          Review
        </label>
        <textarea
          id="review-message"
          v-model="message"
          required
          rows="6"
          :maxlength="REVIEW_MAX_LENGTH"
          placeholder="What did you like? What could be better?"
          class="mt-2 w-full resize-y rounded-2xl border border-panel-edge bg-panel px-4 py-3 text-base leading-relaxed text-white placeholder:text-muted/60"
        ></textarea>
        <p class="mt-2 text-right text-xs text-muted">
          {{ message.length }} / {{ REVIEW_MAX_LENGTH }}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <PrimaryButton type="submit" :disabled="!canSend">Send review</PrimaryButton>
        <PrimaryButton variant="ghost" @click="goHome">Back</PrimaryButton>
      </div>
    </form>
  </section>
</template>
