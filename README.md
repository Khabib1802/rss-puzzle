# RSS Puzzle 🧩

Interactive game for practicing English: assemble a scrambled sentence from individual word "puzzles" by dragging them into the correct order. Inspired by the Lingualeo Phrase Constructor trainer and the RS School RSS Puzzle task.

**🔗 Demo:** https://khabib1802.github.io/rss-puzzle/

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?logo=github)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## About the Project

The player registers with their first and last name, selects a difficulty level and round, and then assembles English sentences from scrambled words using drag-and-drop. Each sentence comes with hints — translation, pronunciation, and a topic-related image. Round and level progress is saved locally, allowing players to continue from where they left off.

## Features

- 🔐 **Name-based login** — simple password-free registration tied to `localStorage`
- 🎚️ **6 difficulty levels** with the ability to select a specific round within each level
- 🧩 **Drag-and-drop sentence assembly** — custom implementation using Pointer Events, no third-party DnD libraries
- 💡 **Three types of hints per round**: translation, audio pronunciation, illustration
- 📊 **Progress statistics** — tracks which rounds and levels are completed, with the ability to resume from the last place
- ↩️ **Session recovery** — banner prompting to return to an interrupted round
- 📱 Responsive layout using SCSS Modules with a custom design system (tokens, mixins, UI kit)

## Tech Stack

| Category         | Technologies                                 |
| ---------------- | -------------------------------------------- |
| Language         | TypeScript (strict mode)                     |
| Build Tool       | Vite 7                                       |
| Styling          | SCSS Modules, custom design tokens           |
| Icons            | lucide                                       |
| Testing          | Vitest, jsdom, @vitest/coverage-v8           |
| Linting/Formatting | ESLint (Airbnb base) + Prettier           |
| Git Hooks        | Husky, lint-staged, validate-branch-name     |
| Deployment       | gh-pages → GitHub Pages                      |

The architecture is vanilla TypeScript without a framework: a custom lightweight router built on `hashchange` and a component hierarchy based on `BaseComponent`.

## Project Structure

```
rss-puzzle/                  # repository root
└── rss-puzzle/               # project root (Vite root)
    ├── public/data/          # levels (JSON), images, audio
    ├── src/
    │   ├── api/               # level data loading
    │   ├── app/               # App, Router
    │   ├── components/        # UI kit, game components, statistics
    │   ├── pages/              # EntryPage, StartPage, GamePage, Statistics, NotFoundPage
    │   ├── services/          # localStorage operations, statistics, puzzle geometry
    │   ├── styles/             # tokens, mixins, global.scss
    │   ├── types/
    │   └── utils/              # drag-and-drop, validation, sentence operations
    └── vite.config.js
```

## Quick Start

```bash
git clone https://github.com/Khabib1802/rss-puzzle.git
cd rss-puzzle/rss-puzzle
npm install
npm run dev
```

The dev server will start at `http://127.0.0.1:5173`.

## Scripts

| Command                | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev`             | Start Vite dev server                                  |
| `npm run build`           | Type checking, linting, and production build to `dist/` |
| `npm run preview`         | Preview the built `dist/` locally                      |
| `npm run type-check`      | Type checking (`tsc --noEmit`)                         |
| `npm run lint` / `lint:fix` | ESLint on `src`, with or without auto-fix           |
| `npm run format` / `ci:format` | Prettier formatting / format checking            |
| `npm run test`            | Unit tests (Vitest)                                    |
| `npm run test:coverage`   | Tests with coverage report                             |
| `npm run check-all`       | type-check + lint + ci:format in one command           |
| `npm run deploy`          | Build and publish `dist/` to GitHub Pages              |

## Deployment

The project is deployed to GitHub Pages using the `gh-pages` package:

```bash
npm run deploy
```

The production build is published to the `gh-pages` branch, and `base` in `vite.config.js` is configured for the repository path (`/rss-puzzle/`).
