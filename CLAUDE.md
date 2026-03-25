# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A mobile-first concert companion app for 萬能青年旅店 (Omnipotent Youth Society). Displays song lyrics with adjustable font sizes and full-text search so the user can sing along during live shows. The app will be hosted on Github Pages. 

## Tech Stack

- **Vite + React + TypeScript** — no routing library; navigation is state-based (`useState`)
- **No external UI libraries** — custom CSS only
- **All data is bundled** — lyrics live in `src/data/songs.ts` so the app works fully offline

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build → dist/
npm run preview   # serve the production build locally
```

## Architecture

The app has two views managed by a single `currentSong` state in `App.tsx`:

- **`currentSong === null`** → Song list view: shows search bar + full song list filtered by title or lyric content
- **`currentSong !== null`** → Lyrics view: displays full lyrics for the selected song with font-size controls

### Key files

- `src/data/songs.ts` — the entire dataset: song titles, album names, years, and lyrics (Traditional Chinese). **Update lyrics here.**
- `src/App.tsx` — all view logic and state
- `src/App.css` — dark-theme styles optimised for phone screens in low-light environments

### Song data shape

```typescript
interface Song {
  id: string;
  title: string;
  album: string;
  year: number;
  lyrics: string;   // newline-separated lines
}
```

### Adding or correcting lyrics

Edit `src/data/songs.ts`. Each song's `lyrics` field is a plain string — use `\n` between lines and `\n\n` between stanzas.

## GitHub Pages Deployment

Deployment is automated via `.github/workflows/deploy.yml` — any push to `main` builds and deploys to Pages automatically.

**One-time setup** (do once in repo settings):
1. Go to **Settings → Pages → Source** and select **GitHub Actions**
2. Push to `main` — the workflow handles the rest

The `vite.config.ts` uses `base: './'` so all asset paths are relative, which is required for Pages to serve the app correctly regardless of the repo name in the URL path.

## Mobile / Concert UX notes

- Default font size is intentionally large (18px) for dark venue readability
- Dark background (`#0a0a0a`) to avoid blinding the user
- Font size persists via `localStorage` across reloads
- The app requests a `WakeLock` on the lyrics view to prevent the screen from sleeping mid-song
