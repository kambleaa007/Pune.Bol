# Pune.Bol

Pune.Bol : A Puneri Way AI Talks in Marathi — fullstack AI chat app.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui-style primitives (Button, Card, Input, Textarea, ScrollArea)
- **AI:** Groq (`groq-sdk`, `llama-3.1-8b-instant`)
- **Language:** TypeScript
- **Deploy:** Render.com (Node.js web service)

## Project structure

```
src/app/page.tsx          # Client chat UI
src/app/layout.tsx        # Root layout + metadata
src/app/globals.css       # Tailwind + CSS variables
src/app/api/chat/route.ts # Server route that calls Groq
src/lib/utils.ts          # cn() helper
src/components/ui/*       # shadcn-style UI components
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
5. Deploy. Or use the included `render.yaml` (blueprint) to provision automatically.

## Notes

- The chat speaks in a Puneri Marathi-influenced Hinglish style.
- Set `GROQ_API_KEY` in Render, otherwise `/api/chat` returns a graceful 500.
