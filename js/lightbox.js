/* =========================================================
   lightbox.js — fullscreen photo viewer
   ========================================================= */
import { placeholderDataURI } from './gallery.js';

export function initLightbox(photos) {
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbNext = document.getElementById('lbNext');
  const lbPrev = document.getElementById('lbPrev');
  if (!lightbox) return { open: () => {} };

  let current = 0;

  function render() {
    const p = photos[current];
    lbImage.src = p.src;
    lbImage.alt = p.caption;
    lbImage.onerror = () => { lbImage.src = placeholderDataURI(current + 1); };
    lbCaption.textContent = p.caption;
  }

  function open(index) {
    current = index;
    render();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lbClose.focus();
  }
  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function next() { current = (current + 1) % photos.length; render(); }
  function prev() { current = (current - 1 + photos.length) % photos.length; render(); }

  lbClose.addEventListener('click', close);
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  }, { passive: true });

  return { open };
}
