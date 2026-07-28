/* =========================================================
   gallery.js — builds the polaroid scrapbook and its tilt interaction
   ========================================================= */

const CAPTIONS = [
  'that day', 'us, being us', 'my favorite face', 'somewhere new',
  'laughing about nothing', 'the good kind of tired', 'again, please',
  'you, mid-laugh', 'quiet moments', 'always'
];
const ROTATIONS = [-6, 4, -3, 7, -8, 2, -4, 6, -2, 5];

function placeholderDataURI(n) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="420">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f3d3d8"/>
          <stop offset="1" stop-color="#efdcc4"/>
        </linearGradient>
      </defs>
      <rect width="400" height="420" fill="url(#g)"/>
      <text x="50%" y="52%" font-family="Georgia, serif" font-size="26" font-style="italic"
        fill="#6e2f3b" text-anchor="middle">photo ${n}</text>
      <text x="50%" y="60%" font-family="Georgia, serif" font-size="14"
        fill="#8a5261" text-anchor="middle">add assets/images/${n}.jpg</text>
    </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/**
 * Builds the 10-photo scrapbook grid.
 * @param {(index:number)=>void} onOpenPhoto called when a polaroid is activated
 * @returns {{src:string, caption:string}[]} the photo list, for the lightbox
 */
export function initGallery(onOpenPhoto) {
  const grid = document.getElementById('scrapbookGrid');
  if (!grid) return [];
  grid.innerHTML = '';

  const photos = [];
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  for (let i = 1; i <= 10; i++) {
    const src = `assets/images/${i}.jpg`;
    const caption = CAPTIONS[i - 1];
    photos.push({ src, caption });

    const fig = document.createElement('figure');
    fig.className = 'polaroid reveal';
    fig.style.setProperty('--rot', ROTATIONS[i - 1] + 'deg');
    fig.style.setProperty('--fdelay', (i * 0.3) + 's');
    fig.style.setProperty('--d', (i * 0.06) + 's');
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', `Open photo: ${caption}`);

    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = caption;
    img.addEventListener('error', () => { img.src = placeholderDataURI(i); });

    const cap = document.createElement('figcaption');
    cap.textContent = caption;

    fig.appendChild(img);
    fig.appendChild(cap);
    grid.appendChild(fig);

    const index = i - 1;
    fig.addEventListener('click', () => onOpenPhoto(index));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenPhoto(index); }
    });

    // real-time 3D tilt + glare, following the cursor — desktop only
    if (!isCoarsePointer) {
      fig.addEventListener('pointerenter', () => fig.classList.add('tilting'));
      fig.addEventListener('pointermove', (e) => {
        const rect = fig.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - py) * 14;
        const tiltY = (px - 0.5) * 14;
        fig.style.setProperty('--tiltX', tiltX.toFixed(2) + 'deg');
        fig.style.setProperty('--tiltY', tiltY.toFixed(2) + 'deg');
        fig.style.setProperty('--glareX', (px * 100).toFixed(1) + '%');
        fig.style.setProperty('--glareY', (py * 100).toFixed(1) + '%');
      });
      fig.addEventListener('pointerleave', () => {
        fig.classList.remove('tilting');
        fig.style.setProperty('--tiltX', '0deg');
        fig.style.setProperty('--tiltY', '0deg');
      });
    }
  }

  return photos;
}

export { placeholderDataURI };
