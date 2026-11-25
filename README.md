# Lift

A simple workout tracker I built for myself after getting tired of paying a subscription for one. It runs in the browser, works offline, and installs to the iPhone home screen like a normal app. No account, no backend, no tracking. Your data stays on your device.

It's a single `index.html` plus a manifest and a service worker. No build step, no dependencies.

## Features

**Workouts and plans**
- Build workouts with a name and short description
- Group workouts into plans (like Push/Pull/Legs). A workout can live in more than one plan
- Plans are collapsible and rearrangeable
- Start a workout, edit sets per exercise, and reorder exercises mid-session

**Logging**
- Weight (lbs), reps, and RIR for every set
- Per-exercise history and progressive overload suggestions shown while you train
- Configurable rest timer with a three-ding sound when it ends
- Default sets per exercise is adjustable in Settings

**Exercise library**
- 100+ built-in exercises, plus custom ones
- Exercises can carry multiple muscle tags (bench press is chest and shoulders, a pushdown is just triceps)
- Search and filter by equipment: cables, machines, free weights, barbells, bodyweight, cardio, and more

**Progress**
- Personal records per exercise (best weight, estimated 1RM, and volume), searchable and collapsible
- Estimated 1RM trend over time
- Month calendar showing workout days and weigh-in days
- Weekly muscle volume with a front/back body diagram that shades by training load
- Stats for total workouts, workouts per week (4 week average), and working sets and volume over the last 7 days
- Bodyweight tracking
- History list with older sessions still visible on the calendar

## Running it

It's static files, so any static host works (Cloudflare Pages, Netlify, GitHub Pages).

1. Put `index.html`, `manifest.json`, and `sw.js` in the same folder and host them over HTTPS.
2. Open the site in Safari on your iPhone.
3. Tap Share, then Add to Home Screen.

To try it locally, open `index.html` in a browser. The service worker only registers over HTTPS or `localhost`, so serve it with something like `python3 -m http.server` if you want offline mode.

## Your data

Everything is stored in the browser's `localStorage` on the device. That means it does not sync between devices, and clearing Safari's site data will wipe it.

**Back it up.** Use Export in Settings to save a JSON file, and Import to restore it.

- Import replaces everything on the device with the file's contents. The app asks you to confirm first.
- The backup includes your exercise library, workouts, plans, sessions, bodyweight entries, and settings.
- The backup file is plain JSON, so it's easy to read, diff, or script against.

A file containing only the built-in exercise library (with no workouts or history) works as a starter import for a fresh install (106 built in exercises).

## Data format

The backup is one JSON object. The main pieces:

| Key | What it holds |
|---|---|
| `exercises` | The exercise library: `id`, `name`, `muscles`, `equipment`, `custom` |
| `workouts` | Workout templates, each with a list of exercises and set counts |
| `plans` | Named groups of workout IDs. A workout can appear in several plans |
| `sessions` | Logged workouts, each with its exercises and sets |
| `bodyweight` | Weigh-in entries |

Logged exercises in `sessions` point at the exercise library through `exId`. Personal records and history are grouped by that ID, with a name match as a fallback. If you edit a backup by hand, keep each `exId` pointing at a real library `id`, or the exercise will fall back to name matching.

## Known limitations

- No background notifications. The rest timer sound only plays while the app is open. A web app on iOS can't reliably alert you from the background without a push server, and I wanted this to stay fully offline.
- No sync. Moving between devices is a manual export and import.
- Units are pounds only (maybe I'll add kilos later).

## Tech

Vanilla HTML, CSS, and JavaScript in a single file. State lives in one object that gets saved to `localStorage` on every change, and the UI re-renders from it. Old backups are migrated automatically on load.

## License

Personal project. Use it however you like.
