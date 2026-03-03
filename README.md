# DSA Problem Tracker

A beautiful, offline-capable DSA interview preparation tracker with 14 coding patterns and 150+ problems.

## Features

- **14 DSA Patterns** — Two Pointers, Sliding Window, Binary Search, Trees, and more
- **Progress Tracking** — Track status, dates, revision needs, and personal notes
- **Offline Support** — Works without internet via Service Worker (PWA)
- **Data Persistence** — All progress saved in browser localStorage
- **Export/Import** — Backup and restore your progress as JSON
- **Keyboard Shortcuts** — `Ctrl+S` to save, `/` to search
- **Print Friendly** — Clean print stylesheet included
- **Fully Responsive** — Works on mobile, tablet, and desktop

## Deployment

### Option 1: GitHub Pages (Recommended — Free)
1. Create a GitHub repository
2. Push all files (`DSA.html`, `manifest.json`, `sw.js`)
3. Go to **Settings → Pages → Source → main branch**
4. Your site will be live at `https://yourusername.github.io/repo-name/DSA.html`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop this folder into the Netlify dashboard
3. Done — you'll get a URL like `https://your-site.netlify.app`

### Option 3: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts — deployed in seconds

### Option 4: Cloudflare Pages (Free)
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo or upload directly
3. Set build output directory to `/` (root)

### Option 5: Firebase Hosting (Free tier)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set public directory to "."
firebase deploy
```

## File Structure

```
DSA_Patterns/
├── DSA.html          # Main application (single page)
├── manifest.json     # PWA manifest
├── sw.js             # Service worker for offline support
├── _headers          # Security headers (for Netlify/Cloudflare)
├── _redirects        # Redirect rules (for Netlify)
└── README.md         # This file
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save progress |
| `/`      | Focus search bar |
