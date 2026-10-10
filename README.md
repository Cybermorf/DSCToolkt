# Dark Sun Chronicles — DM Companion

A lightweight, offline-first companion web app for **The Dark Sun Chronicles: Dungeon Master’s Guide**.

Track multiple living campaigns across the Seven Worlds of Eldoria (Luminaris • Umbraria • Eternum • Solara • Aetheria • Harmonia • Celestia), log sessions, manage party members, track faction reputation (−3 to +3), maintain active forces for the Dynamic Influence Engine, keep free-form notes, and roll dice — all from a single static page that works in any modern browser.

![Theme](https://img.shields.io/badge/theme-dark%20fantasy-e8a838) ![Storage](https://img.shields.io/badge/storage-localStorage-6a9e6a) ![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-2088FF)

## Features

| Feature | Description |
|--------|-------------|
| **Multiple Campaigns** | Create, switch, edit, and delete independent campaigns. Each keeps its own data. |
| **Overview** | Current world, campaign tier (Local → Cosmic), status, goals & hooks. |
| **Session Log** | Date, title, summary, worlds visited. Chronological living record. |
| **Party Tracker** | Characters with class, level, player name, and notes (corruption, bonds, status). |
| **Factions & Reputation** | Track factions with the −3 to +3 reputation scale from the DMG. Quick +/− buttons. |
| **Active Forces** | Record antagonists, cults, disasters, and other forces with goals, resources, and status — the heart of the Dynamic Influence Engine. |
| **Campaign Notes** | Free-form notes area (auto-saves). |
| **Dice Roller** | d4–d100, count + modifier, advantage/disadvantage, custom formulas (`2d6+3`), roll history. Always available via the header button. |
| **Export / Import** | Full JSON backup and restore. Recommended before clearing browser data. |
| **Offline / PWA-ready** | Works after first load with no internet. Add to home screen on mobile. |
| **Zero backend** | Pure static HTML/CSS/JS. No accounts, no servers, no tracking. |

## Quick Start (local)

1. Clone or download this repository.
2. Open `index.html` in any modern browser  
   **or** serve the folder with any static server:

   ```bash
   # Python
   python -m http.server 8080

   # Node
   npx serve .
   ```

3. Create a campaign and start tracking.

Data is stored in the browser’s `localStorage` under the key `darkSunChronicles_v1`.

## Deploy with GitHub Pages

This repo is ready for GitHub Pages.

### Option A — Automatic (recommended)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will publish the site on every push to `main`.
5. After the first successful run, your app will be live at  
   `https://<your-username>.github.io/<repo-name>/`

### Option B — Manual / Docs branch

1. Settings → Pages → Source: **Deploy from a branch**.
2. Branch: `main` / folder: `/ (root)`.
3. Save. The site will be available at the same URL pattern.

### Custom domain (optional)

Add a `CNAME` file in the root with your domain and configure DNS as usual.

## GitHub Actions workflow

The workflow file is already present:

```yaml
# .github/workflows/deploy.yml
```

It checks out the repo and deploys the static files to GitHub Pages. No build step is required because the app is pure static assets.

## Project structure

```
dark-sun-companion/
├── index.html          # App shell & markup
├── css/
│   └── styles.css      # Dark fantasy theme (void + amber sun)
├── js/
│   └── app.js          # All application logic & localStorage
├── manifest.json       # PWA manifest
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Design notes

- **Local-first**: Everything lives in the browser. Export regularly if the campaign matters.
- **Setting-aligned**: Worlds, reputation scale, campaign tiers, and “Active Forces” vocabulary match the DMG’s living-campaign procedures.
- **No frameworks**: Vanilla JS for maximum longevity and zero dependency risk.
- **Accessible enough**: Keyboard-friendly modals (Escape closes), semantic structure, high-contrast dark theme.
- **Mobile-friendly**: Responsive layout; sidebar collapses behind a menu button on small screens. Dice panel slides in from the right.

## Privacy

No analytics, no external requests after the initial page load (except whatever your browser or hosting platform may add). All campaign data never leaves your device unless you explicitly export it.

## License

This companion app is provided as a free tool for use with *The Dark Sun Chronicles* materials. Adapt and redistribute as needed for your table.

---

*A road does not wait because no hero walks it.*  
— Aetherian proverb
