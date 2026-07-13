# Voice Shopping Assistant

A lightweight voice-first shopping assistant (frontend + backend) that lets you build and manage shopping lists using speech or text.

Quick start

- Install and run the backend:

```powershell
cd backend
npm install
npm run dev
```

- Install and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Build production frontend

```powershell
cd frontend
npm run build
```

Where to look

- Frontend pages: [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx)
- Product catalog: [frontend/src/data/products.js](frontend/src/data/products.js)
- Suggestion UI: [frontend/src/components/SuggestionPanel.jsx](frontend/src/components/SuggestionPanel.jsx)
- Header component: [frontend/src/components/Header.jsx](frontend/src/components/Header.jsx)

Notes

- Smart suggestions are generated from the local product catalog and based on recent shopping history, low-stock heuristics, and seasonal picks.
- If you want stricter linting/formatting, run a formatter such as Prettier and add a config to the repo.
# Voice Shopping Assistant

A lightweight voice-first shopping assistant built with Node.js, Express, and React. Users can add or remove items through text or browser voice input, search the current list, and receive smart suggestions based on recent items and seasonal context.

## Features
- Voice input with browser speech recognition
- Multilingual support for English and Spanish commands
- Add, remove, update, and search shopping items
- Automatic category inference and quantity handling
- Smart suggestions and seasonal recommendations

## Run locally
1. Start the backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. Start the frontend in a second terminal:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5173`

## Approach
The app combines a simple Express API with a React interface so it can work quickly without heavy setup. The browser handles voice recognition, while the backend stores items and serves suggestions. If no MongoDB connection string is provided, the app gracefully falls back to an in-memory store so the experience remains functional during local testing.
