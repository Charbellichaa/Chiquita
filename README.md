# Chiquita ❤️ — a digital love letter

A single-page, no-build website: `index.html` + `style.css` + `script.js`.
No frameworks, no npm install, no build step. Open it or deploy it as-is.

## Before you share it — 2 things to add

### 1. Photos (required for the scrapbook to look real)
Drop 10 photos into `assets/images/` named exactly:

```
assets/images/1.jpg
assets/images/2.jpg
...
assets/images/10.jpg
```

- Any aspect ratio works — they're cropped to a square-ish frame automatically.
- Until you add them, each polaroid shows a soft placeholder labeled "add assets/images/N.jpg" so you can see the layout is working.
- Want different captions per photo? Edit the `captions` array near the top of `script.js`.

### 2. Music (required for the player to actually play)
Add your own **legally-owned** copy of the song as:

```
assets/music/youre-still-the-one.mp3
```

I can't generate or download a copyrighted commercial recording for you — you'll need to supply the file (from a purchase, a CD rip you own, etc.). The player is fully wired up (play/pause, mute, volume, seek, current time/duration) and will work the moment the file is present. Browsers block autoplay, so music starts the moment she taps the envelope — that click counts as the "user gesture" browsers require.

If you want a different song, just point the `src` in `index.html`'s `<audio>` tag at the new filename, and update the title/artist text in the music player markup.

## What's already done
- Loading screen → wax-seal envelope opening → hero → typewriter love letter → scrapbook with lightbox (keyboard arrows, ESC, swipe on mobile) → animated timeline → "reasons I love you" cards → cycling quotes → future-dreams cards → final heart-burst moment → footer.
- Fully responsive (phone, tablet, laptop, desktop, portrait/landscape).
- Keyboard accessible (visible focus states, ARIA labels on interactive controls, semantic headings).
- Respects `prefers-reduced-motion`.
- No external JS libraries — only Google Fonts are loaded from a CDN.

## Editing the letter, timeline, quotes, or reasons
Everything is plain text inside `index.html`:
- Love letter → the `<p id="letterText">` block in the **Love Letter** section.
- Timeline entries → the `.tl-item` blocks in the **Our Story So Far** section.
- Reasons cards → the `.reason-card` blocks in the **Reasons I Love You** section.
- Quotes → the `quotes` array in `script.js`.

## Running it locally
No build tools needed. Either:
- Double-click `index.html` to open it directly in a browser, **or**
- Serve it locally (recommended, avoids some browser file:// restrictions):
  ```bash
  cd Chiquita
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

## Deploying

### Netlify
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `Chiquita` folder onto the page.
3. You get a live URL instantly. (Free custom subdomain available in site settings.)

### Vercel
1. Install the CLI: `npm i -g vercel` (or use the Vercel dashboard's "Add New → Project → Upload").
2. From inside the `Chiquita` folder, run `vercel` and follow the prompts (choose "no framework").
3. Vercel gives you a live URL.

### GitHub Pages
1. Create a new GitHub repo and push this folder's contents to the root of the `main` branch.
2. Go to the repo's **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch", branch `main`, folder `/root`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## A quick, honest note
Photos and the music file are the two things only you can provide — everything else in this project is complete and working. Test it once with the real files in place before sending it to her, especially on the phone she'll actually open it on.
