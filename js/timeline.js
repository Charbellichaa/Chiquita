/* =========================================================
   timeline.js — scroll-linked "growing line" storytelling effect
   ========================================================= */

export function initTimeline() {
  const timeline = document.querySelector('.timeline');
  const fill = document.querySelector('.tl-fill');
  if (!timeline || !fill) return;

  let ticking = false;

  function update() {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // progress: 0 when the timeline top reaches the middle of the viewport,
    // 1 when its bottom passes the middle of the viewport.
    const start = viewportH * 0.5;
    const total = rect.height + viewportH * 0.5;
    const traveled = start - rect.top;
    const progress = Math.min(Math.max(traveled / total, 0), 1);

    fill.style.height = (progress * 100) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}
