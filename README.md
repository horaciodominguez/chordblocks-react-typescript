# 🎵 ChordBlocks

![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.57-3FCF8E?logo=supabase&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**ChordBlocks** is a web application built with **React + TypeScript** to create and organize chord progressions.  
It works **offline-first** with automatic synchronization via **Supabase**.  

---

## 🚀 Demo

👉 [View the project on GitHub](https://github.com/horaciodominguez/chordblocks-react-typescript)  

*(Optional: you can deploy it on Vercel/Netlify to showcase a live demo.)*

---

## ✨ Features

- 🎼 Create, edit, and delete songs with sections and chords.  
- 💾 **Offline persistence** with IndexedDB (`idb`).  
- 🔄 **Automatic synchronization** with Supabase when online.  
- 📱 Modern UI with TailwindCSS + Radix UI.  
- 🛠️ Drag & drop for chords and sections with `@dnd-kit`.  
- 🔔 Instant feedback with **toasts** (sonner).  

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite  
- **UI:** TailwindCSS 4, Radix UI, Lucide Icons  
- **State/Form:** Reducers + Zod Validation  
- **Persistence:** IndexedDB (`idb`), Supabase  
- **UX:** sonner (toasts), loaders, confirm dialogs  

---

## ⚙️ Installation & Usage

```bash
# clone the repo
git clone https://github.com/horaciodominguez/chordblocks-react-typescript.git

cd chordblocks-react-typescript

# install dependencies
npm install

# local environment
cp .env.example .env.local
# 👉 configure your Supabase credentials in .env.local

# run in development
npm run dev

# build for production
npm run build

--

## 📂 Project Structure

src/
 ├─ components/        # Generic UI components
 ├─ modules/           # Songs module (form, list, editor)
 ├─ services/          # Storage, Supabase, sync manager
 ├─ style.css          # Tailwind base
 └─ App.tsx            # Main layout

--

## 📜 License

- This project is licensed under the MIT License.
- You are free to use, learn from, modify, and share it.

--

## 👨‍💻 Author

- Horacio Dominguez

Linkedin: [text](https://linkedin.com/in/horaciodominguez)
Portfolio: [text](https://horaciodominguez.com/)