# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Yarn 4 (Berry), pinned via `packageManager` in `package.json` — run `corepack enable` once if `yarn -v` doesn't report 4.x. Do not use npm (no `package-lock.json`; `nodeLinker: node-modules` is set in `.yarnrc.yml`, so `node_modules/` is used, not PnP).

```zsh
yarn                # install deps
yarn dev            # dev server at localhost:8080, wrapped in webpack-dashboard TUI, HMR on
yarn build          # production build to dist/
yarn lint           # ESLint over src/ and webpack.config.js (JS + .vue)
yarn lint:fix
yarn format         # Prettier, writes changes to src/**/*.{js,vue,css}
yarn format:check
```

There is no test suite/script in this project.

`yarn dev` runs through `webpack-dashboard --`, which takes over the full terminal (alt-screen TUI via `neo-blessed`). It won't behave in a non-interactive/piped shell — that's expected, not a bug.

## Architecture

Vue 3 (Options-free, `<script setup>` SFCs) bundled with webpack 5. Single-page, no router, no state management library — one component owns all app state.

- `src/main.js` — mounts `App.vue` to `#app`.
- `src/App.vue` — shell: header + theming. Global CSS custom properties (`--bg`, `--surface`, `--accent`, `--correct`, `--incorrect`, etc.) are defined here in an unscoped `<style>` block and consumed by child components; light/dark values are switched via `prefers-color-scheme` media query, not a JS toggle.
- `src/components/TypingTest.vue` — all typing-test logic and UI in one component: prompt selection, per-character diffing against user input, WPM/accuracy computation, and the timer. Input capture is a visually-hidden `<input>` (`.hidden-input`, positioned off-screen but focusable) bound via `v-model`, rather than `contenteditable` or per-keystroke `keydown` handling — comparing the full typed string against the prompt string index-by-index is the core mechanic (`charClass()`).
- `src/data/prompts.js` — flat array of practice sentences; `pickPrompt()` in `TypingTest.vue` avoids repeating the immediately-previous prompt.

`webpack.config.js` exports a function `(env, argv) => {...}` (not a static object) specifically so `DashboardPlugin` can be conditionally added only when `argv.mode === 'development'` — production builds never load webpack-dashboard. `output.publicPath` is left at webpack 5's default (`'auto'`) deliberately, since the production bundle is served from a GitHub Pages subpath (`/cadence/`), not domain root.

### Linting

`eslint.config.cjs` is flat-config. `.vue` files are parsed via `vue-eslint-parser` + `eslint-plugin-vue`'s `flat/recommended`, layered with the same `no-unused-vars`/`no-console` rules used for `.js` files. `vue/multi-word-component-names` is off (component is named `App`/`TypingTest`, not "AppTypingTest" etc.).

Biome was evaluated and rejected for this repo: as of `@biomejs/biome` 2.5.7 its Vue SFC analysis parses `<script setup>` in isolation from `<template>`, so every binding used only in the template (which is most of them in a `<script setup>` component) gets flagged as unused. If re-evaluating Biome in the future, verify this is fixed before switching back.

## CI/CD

Two GitHub Actions workflows, both triggered on push/PR to `master` (this repo's default branch — not `main`):

- `.github/workflows/ci.yml` — install, lint, format:check, build.
- `.github/workflows/gh-pages.yml` — builds and publishes `dist/` to GitHub Pages via `actions/deploy-pages` (Pages source is set to "GitHub Actions" in repo settings, not a `gh-pages` branch).

Live site: https://zkm.github.io/cadence/
