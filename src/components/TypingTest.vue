<template>
  <div class="typing-test">
    <div class="stats">
      <div class="stat">
        <span class="value">{{ wpm }}</span>
        <span class="label">wpm</span>
      </div>
      <div class="stat">
        <span class="value">{{ accuracy }}%</span>
        <span class="label">accuracy</span>
      </div>
      <div class="stat">
        <span class="value">{{ timeElapsed }}s</span>
        <span class="label">time</span>
      </div>
    </div>

    <div class="prompt" @click="focusInput">
      <span v-for="(char, i) in promptChars" :key="i" :class="charClass(i)">{{
        char
      }}</span>
    </div>

    <input
      ref="hiddenInput"
      v-model="typed"
      class="hidden-input"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div class="footer">
      <p v-if="status === 'finished'" class="result">
        Finished! {{ wpm }} WPM at {{ accuracy }}% accuracy.
      </p>
      <p v-else class="hint">click the text and start typing</p>
      <button class="restart" @click="restart">restart</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import prompts from '../data/prompts.js';

const prompt = ref('');
const typed = ref('');
const status = ref('idle'); // idle | running | finished
const startTime = ref(null);
const endTime = ref(null);
const now = ref(Date.now());
const hiddenInput = ref(null);
let timer = null;

function pickPrompt() {
  const remaining = prompts.filter((p) => p !== prompt.value);
  const pool = remaining.length ? remaining : prompts;
  prompt.value = pool[Math.floor(Math.random() * pool.length)];
}

pickPrompt();

const promptChars = computed(() => prompt.value.split(''));

function charClass(i) {
  if (i < typed.value.length) {
    return typed.value[i] === prompt.value[i] ? 'correct' : 'incorrect';
  }
  if (i === typed.value.length) return 'current';
  return 'pending';
}

function onInput() {
  if (status.value === 'idle' && typed.value.length > 0) {
    start();
  }
  if (typed.value.length > prompt.value.length) {
    typed.value = typed.value.slice(0, prompt.value.length);
  }
  if (
    status.value === 'running' &&
    typed.value.length === prompt.value.length
  ) {
    finish();
  }
}

function onKeydown(e) {
  if (status.value === 'finished' && e.key !== 'Tab') {
    e.preventDefault();
  }
}

function start() {
  status.value = 'running';
  startTime.value = Date.now();
  timer = setInterval(() => {
    now.value = Date.now();
  }, 200);
}

function finish() {
  status.value = 'finished';
  endTime.value = Date.now();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function restart() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  pickPrompt();
  typed.value = '';
  status.value = 'idle';
  startTime.value = null;
  endTime.value = null;
  focusInput();
}

function focusInput() {
  hiddenInput.value && hiddenInput.value.focus();
}

const elapsedMs = computed(() => {
  if (!startTime.value) return 0;
  const end = endTime.value || now.value;
  return end - startTime.value;
});

const timeElapsed = computed(() => (elapsedMs.value / 1000).toFixed(1));

const correctChars = computed(
  () => typed.value.split('').filter((c, i) => c === prompt.value[i]).length
);

const accuracy = computed(() => {
  if (typed.value.length === 0) return 100;
  return Math.round((correctChars.value / typed.value.length) * 100);
});

const wpm = computed(() => {
  const minutes = elapsedMs.value / 1000 / 60;
  if (minutes <= 0) return 0;
  return Math.round(correctChars.value / 5 / minutes);
});

onMounted(() => {
  focusInput();
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.typing-test {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat .value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.prompt {
  position: relative;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 1.35rem;
  line-height: 2.1rem;
  letter-spacing: 0.01em;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: text;
  user-select: none;
}

.prompt .pending {
  color: var(--text-muted);
}

.prompt .correct {
  color: var(--correct);
}

.prompt .incorrect {
  color: var(--incorrect);
  text-decoration: underline;
  text-decoration-color: var(--incorrect);
}

.prompt .current {
  color: var(--text-muted);
  background: var(--accent);
  color: var(--bg);
  border-radius: 2px;
}

.hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  border: none;
  padding: 0;
  margin: 0;
  pointer-events: none;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.result {
  color: var(--correct);
  font-weight: 600;
}

.hint {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.restart {
  font: inherit;
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.restart:hover {
  background: var(--surface);
  border-color: var(--accent);
}
</style>
