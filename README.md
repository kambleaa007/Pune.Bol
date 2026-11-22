# Pune.Bol

**Live:** https://pune-bol.onrender.com/

Pune.Bol : A Puneri Way AI Talks in Marathi — fullstack AI chat app with GenZ-friendly modern theme.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS (glassmorphism, gradient glow orbs, dark mode)
- **UI:** Custom primitives (Button, Card, Input, Textarea, ScrollArea)
- **AI:** Groq (`groq-sdk`, model configurable via `GROQ_MODEL` env var, default `openai/gpt-oss-20b`)
- **Language:** TypeScript, Marathi (Devanagari script) AI responses
- **Deploy:** Render.com (Node.js web service)

## Features

- 🇮🇳 AI replies **only in Marathi Devanagari script**, even if you type in English/Hinglish
- ✨ GenZ Indian theme: glassmorphism cards, gradient background, glow orbs, dark mode
- 💬 Auto-scroll to bottom on new messages
- 🏷️ Quick Marathi chip tags (वडा पाव, मिसळ पाव, पुणेकर, मस्त, बरं)
- ⚡ Groq-powered fast responses

## Project structure

```
src/app/page.tsx          # Client chat UI (GenZ theme, Marathi font)
src/app/layout.tsx        # Root layout + Noto Sans Devanagari font
src/app/globals.css       # Tailwind + CSS variables + theme
src/app/api/chat/route.ts # Server route that calls Groq
src/lib/utils.ts          # cn() helper
src/components/ui/*       # UI components
.env.example              # Copy to .env and add GROQ_API_KEY
render.yaml               # Render service definition
```

## Local development

```bash
cp .env.example .env
# add your GROQ_API_KEY to .env
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # production server
```

## Deploy on Render.com

1. Push this repo to GitHub.
2. In Render, create a **Web Service** and connect the repo.
3. Runtime: `Node`, Build command: `npm install && npm run build`, Start command: `npm start`.
4. Add environment variable `GROQ_API_KEY` (your Groq API key).
5. Optionally add `GROQ_MODEL` (default: `openai/gpt-oss-20b`).
6. Deploy. Or use the included `render.yaml` (blueprint) to provision automatically.
7. Enable **Auto-Deploy** in Render Settings for deploys on every `git push`.

## Notes

- AI responds in Marathi Devanagari script (मराठी) via Noto Sans Devanagari font.
- Set `GROQ_API_KEY` in Render, otherwise `/api/chat` returns a graceful 500.
