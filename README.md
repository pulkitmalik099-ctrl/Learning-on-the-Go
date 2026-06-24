# Learning on the Go

A lightweight, zero-dependency flashcard hub for revising any topic — open it in any browser, online or offline.

No install, no build step, no database, no internet required. The whole thing is plain HTML, CSS, and JavaScript. Double-click the home page to study locally, or push the folder to GitHub Pages to study from anywhere.

---

## What it is

A small static website for spaced revision with flashcards. A home page lists your topics as buttons; each topic is its own page with a deck of cards you flip through. A "Learn next" link walks you from one topic to the next.

Add a new subject by copying a template page and pasting in your cards — no code changes to the app itself.

## Features

- Flip cards to reveal answers (click, tap, or keyboard)
- Shuffle the deck to test out of order
- Keyboard shortcuts (arrows to move, space to flip)
- Per-deck progress bar
- "Mark as known" to drop a card from rotation
- Works offline by double-clicking, and online via GitHub Pages — identical behaviour

## How it stays dependency-free (and works offline)

The one thing that would break "just double-click it" offline is `fetch()`. When a page opened via `file://` tries to fetch a `.json` or `.html` file, the browser blocks it for security. So this project never fetches anything.

Instead:

- Shared logic and styling load with plain `<script src="app.js">` and `<link href="style.css">` tags.
- Card data lives directly inside each topic's `.html` page.
- Navigation uses plain `<a href="...">` links.

Script tags, stylesheet links, and anchor links are all exempt from the `file://` restriction, so everything works whether the page is double-clicked locally or served from GitHub Pages.

"No dependencies" here means: nothing to install, no npm, no database, no build step, no CDN, no internet connection. The only files needed are the handful in this folder — all owned by you.

## File structure

```
Learning-on-the-Go/
  README.md         <- this file
  index.html        <- home page; double-click THIS to start
  claude-101.html   <- a fully working deck page (first topic)
  sql.html          <- stub deck page; copy this to add topics
  app.js            <- shared flip / shuffle / progress logic
  style.css         <- shared styling
```

`index.html` must sit at the top level of the repo so GitHub Pages serves it at the site root.

## Running it

- Local: double-click `index.html`. It opens in your default browser and works fully offline.
- Online: enable GitHub Pages (see below), then visit your site URL.

## Adding a new topic

1. Copy `sql.html` and rename it, e.g. `system-design.html`.
2. Open the new file and replace the card data array with your own cards. Each card is an object:
   ```js
   { q: "Your question here", a: "Your answer here" }
   ```
3. Update the page title and heading at the top of the file.
4. Point its "Learn next" link to the topic you want to follow it.
5. Open `index.html` and add a button linking to the new page:
   ```html
   <a class="topic" href="system-design.html">System Design</a>
   ```

That's it — three files touched, no app logic changed.

## Deploying to GitHub Pages

1. Create a repository named `Learning-on-the-Go` (GitHub turns spaces into hyphens automatically).
2. Upload these files to the repo root — drag and drop via "Add file" → "Upload files", or push with git.
3. Go to repo Settings → Pages.
4. Under "Source", choose "Deploy from a branch", set branch to `main` and folder to `/ (root)`, then Save.
5. Wait a minute or two. Your site goes live at:
   ```
   https://<your-username>.github.io/Learning-on-the-Go/
   ```

## Known caveats

- Progress (the "known" cards) is saved with `localStorage`. On GitHub Pages it persists reliably. On local `file://` opens it can be less dependable — some browsers scope or clear it oddly for local files. The flashcards themselves work perfectly offline either way; only the saved progress may not stick when double-clicking locally.
- `localStorage` is per-device and per-origin, so progress on your laptop won't sync to your phone. An export/import button can cover this if you want it later.

## Suggested GitHub repo metadata

- Description: A lightweight, zero-dependency flashcard hub for revising any topic — open it in any browser, online or offline.
- Topics (tags): `flashcards`, `revision`, `study`, `html`, `offline`, `github-pages`

## Roadmap ideas

- Export / import progress (covers cross-device sync without a backend)
- A simple spaced-repetition schedule ("cards due today")
- Dark mode toggle
- A search box across all decks
