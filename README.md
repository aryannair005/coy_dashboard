# Coy Discover

A React + Vite frontend and a Node.js + Express backend. The backend saves swipes in one JSON file.

## Run the app

Use Node.js 22 LTS or newer. Open two terminals from the project folder.

**Terminal 1**
```sh
cd backend
npm install
npm start
```

**Terminal 2**
```sh
cd frontend
npm install
npm run dev
```

Open the URL Vite prints. With a fresh swipe file, like the first profile to see a match.

## Project layout

| File or folder | What it does |
| --- | --- |
| `frontend/src/App.jsx` | Shows Discover and calls the API with `fetch` |
| `frontend/src/components/` | Renders the profile card and match dialog |
| `frontend/vite.config.js` | Forwards API requests from Vite to Express during development |
| `backend/server.js` | Starts Express on port 3000 |
| `backend/routes/` | Connects URL paths to controllers |
| `backend/controllers/` | Validates input and sends JSON responses |
| `backend/models/` | Holds mock profiles and the rules for swipes and matches |
| `backend/utils/swipeFile.js` | Reads and writes the JSON file |

## How to explain a swipe in an interview

1. The React page makes a `GET /feed` request and shows the first unswiped profile.
2. Like or Pass sends `POST /swipe` with a profile ID and a direction. The route hands the request to the controller, which validates both values.
3. The model checks for an existing swipe. For a new decision it records the swipe and marks it as a match only when the action is Like and the profile has already liked the demo user.
4. React removes that profile from the feed and opens the match dialog only when the API reports a new match.
5. On refresh, the backend reads `backend/data/swipes.json` again. `GET /feed` excludes saved swipes, and `GET /matches` lists mutual matches.

The incoming-like fixture lives in the backend and the feed response contains only public profile fields. All 30 profiles are fictional. The JSON design is for the assignment's single-user demo running one backend process. The JSON file starts fresh after switching from the earlier SQLite prototype.

The frontend follows the layout of a React project scaffolded with `npm create vite@6 frontend -- --template react`. The `frontend/` folder is already included.

## Checks

From `backend/`, run `npm test` after installing dependencies. From `frontend/`, run `npm run build` to build the React app.

## Part A feature suggestions

1. **Correct a crush's details.** Allow name typo fixes. Confirm a corrected phone number and treat it as a new entry so an existing match or notification cannot transfer to a different person.
2. **Make invites shareable across browsers.** Offer the system share sheet when supported and a copy-link button with confirmation so desktop users can share the invite too.

