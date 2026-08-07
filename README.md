# cadence

[![CI](https://github.com/zkm/cadence/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/zkm/cadence/actions/workflows/ci.yml)
[![Deploy to Pages](https://github.com/zkm/cadence/actions/workflows/gh-pages.yml/badge.svg?branch=master)](https://github.com/zkm/cadence/actions/workflows/gh-pages.yml)

Cadence is a typing speed practice app built with Vue 3 and webpack. It tracks WPM and accuracy live as you type, and is automatically deployed to GitHub Pages via GitHub Actions.

## Installation

1.  Clone the repository: `git clone git@github.com:zkm/cadence.git`

2.  Navigate to the project directory: `cd cadence`

3.  Ensure Corepack is enabled (for Yarn 4):

    ```zsh
    corepack enable
    ```

4.  Install the dependencies:

    ```zsh
    yarn
    ```

Requirements
- Node.js 20+
- Yarn 4 (Berry) via Corepack

## Try it locally

Install dependencies and start the dev server with HMR:

```zsh
yarn
yarn dev
```

Build a production bundle to `dist`:

```zsh
yarn build
```

The dev server opens in your default browser and serves at:

- http://localhost:8080

## Development

To run the app in development mode with webpack-dashboard: `yarn dev`

This starts the dev server behind the [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard) terminal UI and opens the app in your default browser. Changes to the source code hot-reload automatically.

## Build

To build the app for production: `yarn build`

This generates optimized, content-hashed assets in the `dist` directory.

## Testing

Run the test suite with `yarn test` (Jest, via `@vue/test-utils`). Spec files live alongside the code they cover, e.g. `src/components/TypingTest.spec.js`.

## Linting & formatting

```zsh
yarn lint          # ESLint (JS + Vue SFCs)
yarn lint:fix
yarn format        # Prettier, writes changes
yarn format:check  # Prettier, check only
```

## Deployment (GitHub Pages via Actions)

Deployments are automated. On every push to `master`:
- GitHub Actions builds the app (`yarn build`).
- The `dist` folder is published to GitHub Pages (Source: GitHub Actions).

View the live site at: https://zkm.github.io/cadence/

Manual deploy: trigger the workflow from the Actions tab using "Run workflow".

Notes
- Build output directory: `dist` (see `webpack.config.js`).
- The workflow file is at `.github/workflows/gh-pages.yml` and uses the official Pages actions (`upload-pages-artifact` and `deploy-pages`).

## Troubleshooting

- If the site looks outdated, check the latest runs of the deploy workflow and confirm the "Deploy to GitHub Pages" job succeeded. A page URL is shown on success.
- Ensure `dist` contains `index.html` and assets after `yarn build`.
- Pages source should be set to "GitHub Actions" in repo Settings → Pages.

## Project structure

```
src/
  main.js                    # app entry point
  App.vue                    # shell, theming
  components/TypingTest.vue  # typing test logic + UI
  data/prompts.js            # practice sentence pool
```

## Resources

*   [Vue Documentation](https://vuejs.org/)
*   [Webpack Documentation](https://webpack.js.org/)
*   [Webpack Dashboard Documentation](https://github.com/FormidableLabs/webpack-dashboard)

### License

This project is licensed under the [MIT License](LICENSE).
