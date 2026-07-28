# Chiquita ❤️ — a digital love letter

A no-build website with a clean modular architecture. No frameworks, no npm install.

```
Chiquita/
├── index.html
├── README.md
├── css/
│   ├── base.css          — design tokens, reset, typography, section layout
│   ├── animations.css    — every @keyframes + transition + scroll-reveal wiring
│   ├── effects.css       — glassmorphism, glow, gradients, cursor canvas
│   ├── scrapbook.css     — polaroid grid + lightbox
│   └── responsive.css    — breakpoint overrides (loaded last, wins the cascade)
├── js/
│   ├── main.js           — boots everything and wires the modules together
│   ├── envelope.js       — the opening ritual (seal, flap, letter slide)
│   ├── gallery.js        — builds the scrapbook + tilt/glare interaction
│   ├── lightbox.js       — fullscreen photo viewer
│   ├── timeline.js       — scroll-linked "growing line" effect
│   ├── music.js          — the audio player
│   ├── particles.js      — ambient petals + finale confetti burst
│   └── cursor.js         — cursor sparkle trail
└── assets/
    ├── images/           — 1.jpg – 10.jpg go here
    ├── music/            — youre-still-the-one.mp3 goes here
    ├── fonts/
    └── icons/
```

`js/main.js` is loaded as an ES module (`<script type="module">`), so the `import`/`export`
statements between files work natively — no bundler needed. This only works when served
over `http(s)://` (GitHub Pages, Netlify, a local server) — opening `index.html` directly
via `file://` will block the module imports in most browsers. Use the local server command
below when testing on your machine.

## Before you share it — 2 things to add

### 1. Photos
Drop 10 photos into `assets/images/` named `1.jpg` through `10.jpg`. Until they're there,
each polaroid shows a placeholder labeled "add assets/images/N.jpg" so the layout is easy
to check. Captions live in `js/gallery.js`, in the `CAPTIONS` array near the top.

### 2. Music
Add your own legally-owned copy of the song as `assets/music/youre-still-the-one.mp3`.
The player (play/pause/mute/volume/seek) is fully wired up in `js/music.js` — it just
needs the file to exist. Song title/artist text is in `index.html`, inside `.music-player`.

## Where to edit things

| What | File | Where |
|---|---|---|
| Love letter text | `index.html` | `<p id="letterText">` |
| Photo captions | `js/gallery.js` | `CAPTIONS` array |
| Timeline entries | `index.html` | each `.tl-item` inside `#timeline` |
| "Reasons I Love You" cards | `index.html` | each `.reason-card` inside `#reasons` |
| Cycling quotes | `js/main.js` | `quotes` array inside `startQuoteCycle()` |
| Finale lines ("I choose you.", etc.) | `index.html` | each `.finale-line` inside `#finale` |
| Colors / palette | `css/base.css` | `:root { ... }` at the top |
| Fonts | `css/base.css` | same `:root` block |
| Confetti colors/behavior | `js/particles.js` | `BURST_COLORS` and `spawnBurst()` |
| Tilt/glare intensity on photos | `js/gallery.js` | the `pointermove` handler (the `* 14` multipliers) |
| Timeline "growing line" speed/range | `js/timeline.js` | the `update()` function |

## Running it locally
Because of the ES module imports, use a local server rather than double-clicking `index.html`:
```bash
cd Chiquita
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

### GitHub Pages
1. Push (or upload) the full contents of this folder — including the `css/` and `js/`
   subfolders exactly as-is — to the root of your repo's `main` branch.
2. Repo → **Settings → Pages** → Source: "Deploy from a branch" → Branch: `main`, folder `/(root)`.
3. Your site publishes at `https://<username>.github.io/<repo-name>/`.

### Netlify / Vercel
Drag the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or run
`vercel` from inside the folder (choose "no framework" if asked).

## A quick, honest note
Photos and the music file are the two things only you can provide — everything else,
including all animation and interaction work, is complete. Test once with real files in
place, on the actual phone she'll open it on, before sending it.
