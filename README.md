# StoreSignal

AI-powered retail feedback intelligence platform — operations command center.

**Critical store issues. Seen in five seconds.**

## Live Demo

After CI/CD is connected: the production URL will appear on the Vercel dashboard / GitHub Actions.

## Quick start (local)

```bash
cd storesignal
python3 server.py
```

Open **http://localhost:8080**

## What you get

- Clean dark landing page with CSS scroll animations
- Problem → Solution → How it works → USP → Interactive demo
- Backend: Python `server.py` serves static files + `POST /api/analyze`
- Demo analyzes sample feedback (freezer, allergen, rude staff, Telugu mixed text)

## Stack

- Frontend: HTML, CSS (custom, Inter font, Font Awesome), vanilla JS
- Backend: Python 3 standard library (`http.server`) — local only
- Deployment: Vercel (static) + GitHub Actions CI

## CI/CD

- **GitHub Actions** (`.github/workflows/ci.yml`): runs on every push/PR to `main`
  - Checks required files exist
  - Basic content validation
  - Python syntax check for `server.py`
- **Vercel**: auto-deploys on every push to `main` (static site from `/public`)

## Project structure

```
storesignal/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.py          # Local dev server + mock API
├── vercel.json
├── .github/workflows/ci.yml
└── README.md
```

## Team

**Debugging Doomsday** · Leader: SATISH TENTU  
AI Frontier Challenge 2026 · Round 1
