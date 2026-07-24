# ChordBlocks

![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.57-3FCF8E?logo=supabase&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**ChordBlocks** is a web application built with **React + TypeScript** to create and organize chord progressions.
It works **offline-first** with automatic synchronization via **Supabase**.

---

## Demo

- Repo: [chordblocks-react-typescript](https://github.com/horaciodominguez/chordblocks-react-typescript)
- Live (GitHub Pages): [horaciodominguez.github.io/chordblocks-react-typescript](https://horaciodominguez.github.io/chordblocks-react-typescript)

---

## Features

- Create, edit, and delete songs with sections and chords.
- **Sets** (repertoires) with pin, date, search, and play mode for gigs.
- **Home** shows pinned sets sorted by date.
- **Songs** catalog with list / by-artist views, search and filters.
- Offline persistence with IndexedDB (`idb`).
- Sync with Supabase when signed in.
- Import / export JSON packages from **Settings → Data**.
- Modern UI with TailwindCSS + Radix UI.
- Drag & drop for chords, sections and set items (`@dnd-kit`).
- Instant feedback with toasts (sonner).

---

## Information architecture

| Route                    | Purpose                                |
| ------------------------ | -------------------------------------- |
| `/`                      | Home — pinned sets                     |
| `/songs`                 | Song library (list / by artist)        |
| `/song/:id`              | Song view (± set context query params) |
| `/song/:id/edit`, `/new` | Edit / create song                     |
| `/repertoires`           | Sets list (pinned first + search)      |
| `/repertoires/:id`       | Set detail / play                      |
| `/repertoires/:id/edit`  | Edit set                               |
| `/settings`              | Account + **Data** import/export       |

UI copy uses **Set**; code/types use `Repertoire`.

---

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite 7.3
- **UI:** TailwindCSS 4, Radix UI, Lucide Icons
- **State/Form:** Reducers + Zod validation
- **Persistence:** IndexedDB (`idb`), Supabase
- **UX:** sonner (toasts), loaders, confirm dialogs

---

## Installation & usage

This repository’s **root is the app** (`package.json` lives here). After cloning, install and run from that root — there is no nested `cd project` step for the published repo.

```bash
git clone https://github.com/horaciodominguez/chordblocks-react-typescript.git
cd chordblocks-react-typescript

npm install

cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
# Prefer the legacy anon JWT (eyJ...) from Project Settings → API Keys.
# Avoid sb_publishable_... if you see Invalid JWT errors.

npm run dev
npm test
npm run build
```

Optional scripts: `npm run lint`, `npm run format`, `npm run format:check`.

---

## Project structure

```
src/
 ├─ components/   # Shared UI / layout
 ├─ modules/      # songs, repertoires, auth, io, chords, ui
 ├─ pages/        # Route screens
 ├─ services/     # IndexedDB, Supabase, sync
 ├─ style.css
 └─ App.tsx
public/assets/    # logo, bg, chord/rest sprites
```

---

## License

MIT — use, learn from, modify, and share.

---

## Author

Horacio Dominguez

- LinkedIn: [linkedin.com/in/horaciodominguez](https://linkedin.com/in/horaciodominguez)
- Portfolio: [horaciodominguez.com](https://horaciodominguez.com/)
