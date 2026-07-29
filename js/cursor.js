/* =========================================================
   cursor.js — subtle gold sparkle trail following the pointer
   Desktop only; skipped on touch devices and reduced-motion.
   ========================================================= */

export function initCursorSparkle() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || reduceMotion) return;

  let sparkles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let lastSpawn = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < 45) return;
    lastSpawn = now;
    sparkles.push({
      x: e.clientX,
      y: e.clientY,
      life: 1,
      size: Math.random() * 3 + 2,
      hue: Math.random() < 0.5 ? '#d8a566' : '#c8918a'
    });
  });

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles.forEach(s => {
      s.life -= 0.02;
      s.y -= 0.4;
      ctx.save();
      ctx.globalAlpha = Math.max(s.life, 0);
      ctx.fillStyle = s.hue;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    sparkles = sparkles.filter(s => s.life > 0);
    requestAnimationFrame(animate);
  })();
}
