<template>
  <div class="app">
    <header>
      <h1>Cadence</h1>
      <p class="tagline">find your typing rhythm</p>
    </header>
    <main>
      <TypingTest />
    </main>
  </div>
</template>

<script setup>
import TypingTest from './components/TypingTest.vue';
</script>

<style>
:root {
  --bg: #0f1115;
  --surface: #171a21;
  --border: #2a2e38;
  --text: #e6e8ee;
  --text-muted: #6b7280;
  --accent: #7c9cff;
  --correct: #4ade80;
  --incorrect: #f87171;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #f7f8fa;
    --surface: #ffffff;
    --border: #e2e5eb;
    --text: #1a1d23;
    --text-muted: #8b909c;
    --accent: #3b5bdb;
    --correct: #2f9e44;
    --incorrect: #e03131;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1.5rem;
  gap: 3rem;
}

header {
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  letter-spacing: -0.02em;
}

.tagline {
  margin: 0.25rem 0 0;
  color: var(--text-muted);
}

main {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
