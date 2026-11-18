# Coy Discover

A standalone internship demo with a Home page and a swipe-based Discover feed. It uses React and Vite for the frontend, Node.js and Express for the API, and a local JSON file for one shared demo user.

## Features

- 30 fictional profiles with locally hosted portraits and a fallback image.
- Swipe left to pass or right to like. The same actions are available through keyboard-accessible buttons.
- A match dialog and Matches view for mutual likes only. The API does not disclose incoming likes.
- Saved decisions are excluded from future feeds, including after refresh. Repeating a swipe preserves the first decision.
- Loading, error, and empty states for the feed and matches.

## Project structure

| Path | Purpose |
| --- | --- |
| `frontend/src/App.jsx` | Home, Discover, Matches, and API calls |
| `frontend/src/components/` | Swipe card, portrait fallback, and match dialog |
| `frontend/vite.config.js` | Proxies API calls to the backend during local development |
| `backend/server.js` | Starts Express and creates the data directory |
| `backend/routes/` and `backend/controllers/` | Routes and input validation |
| `backend/models/` | Mock profiles and swipe and match rules |
| `backend/utils/swipeFile.js` | Reads and safely replaces the JSON swipe file |
| `backend/test/` | API and persistence tests |

## Run locally

Install Node.js 22 LTS or later. From the repo root, use two terminals.

```sh
# Terminal 1
cd backend
npm ci
npm start
```

```sh
# Terminal 2
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite. Like the first profile with a fresh data directory to see the match dialog. No environment variables are needed for the default local setup.

## API and configuration

| Endpoint | Behavior |
| --- | --- |
| `GET /feed` | Returns unswiped profiles with public fields only |
| `POST /swipe` | Accepts `{ "profileId": 1, "direction": "like" }`. Direction is `like` or `pass`. Returns `direction`, `matched`, and `createdMatch` |
| `GET /matches` | Returns mutual matches only |

| Where | Variable | Value |
| --- | --- | --- |
| Render | `PORT` | Render sets this automatically. Locally defaults to `3000` |
| Render | `DATA_DIR` | Use the disk mount path, such as `/var/data`. Defaults to `backend/data` locally |
| Render | `FRONTEND_ORIGIN` | Exact production Netlify origin, such as `https://your-site.netlify.app`, with no trailing slash |
| Netlify | `VITE_API_BASE_URL` | HTTPS Render base URL, such as `https://your-api.onrender.com`. Set before building the frontend |

The production frontend uses `VITE_API_BASE_URL`. Local development uses Vite’s proxy when that variable is unset. CORS allows the configured Netlify origin to read responses. The API is public and shares the same demo user's state across visitors.

## Deploy the backend on Render

1. In Render, create a **Web Service** from this GitHub repo and select the branch containing these changes.
2. Set **Root Directory** to `backend`, **Runtime** to Node, **Build Command** to `npm ci`, and **Start Command** to `npm start`. Use Node.js 22 or later and set the health check path to `/feed`.
3. Choose a paid instance that supports persistent disks. Add a disk and mount it at `/var/data`. Set `DATA_DIR=/var/data`. Leave `PORT` at Render's default.
4. Deploy and open `https://YOUR-SERVICE.onrender.com/feed` to check the API. Copy the service's base URL.

The server creates `DATA_DIR` and saves `swipes.json` there. A normal Render filesystem is ephemeral. A free instance can demonstrate swipes, but they can be lost on restarts or redeploys. Use a paid Render service with a disk or another host with a durable mounted volume to keep the JSON design and retain decisions. Run one backend instance against the file.

[Render web services](https://render.com/docs/web-services) · [Render persistent disks](https://render.com/docs/disks)

## Deploy the frontend on Netlify

1. Import this GitHub repo in Netlify and select the branch containing these changes.
2. Set **Base directory** to `frontend`, **Build command** to `npm run build`, and **Publish directory** to `dist`. Use Node.js 22 or later.
3. Add `VITE_API_BASE_URL` with the Render base URL and deploy.
4. Copy the production Netlify origin into Render's `FRONTEND_ORIGIN` and let Render redeploy. If the frontend API URL changes, rebuild Netlify. Vite reads that variable at build time.
5. Open Netlify, go from Home to Discover, like and pass, then reload and check that the profiles stay out of the feed. Open Matches and confirm a mutual match appears.

[Netlify's Vite guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)

## Tests and build

- In `backend/`, run `npm ci` and `npm test`.
- In `frontend/`, run `npm ci` and `npm run build`.

## Part A feature suggestions

1. **Correct a crush's details.** Allow name typo fixes. Confirm a corrected phone number and treat it as a new entry so an existing match or notification cannot transfer to a different person.
2. **Make invites shareable across browsers.** Offer the system share sheet when supported and a copy-link action with confirmation so desktop users can share the invite too.

