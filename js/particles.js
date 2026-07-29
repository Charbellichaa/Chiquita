/* =========================================================
   particles.js — ambient petals + finale confetti burst
   ========================================================= */

const PETAL_COLORS = ['#c8918a', '#d8a566'];

/**
 * Continuously spawns falling petals into .ambient so the pattern
 * never feels identical twice (no fixed 6-element loop).
 */
export function initAmbientParticles() {
  const ambient = document.querySelector('.ambient');
  if (!ambient) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  function spawnPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 14;
    const drift = (Math.random() - 0.5) * 160;
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

    petal.style.left = left + '%';
    petal.style.background = color;
    petal.style.animationDuration = duration + 's';
    petal.style.setProperty('--drift', drift + 'px');

    petal.addEventListener('animationend', () => petal.remove());
    ambient.appendChild(petal);
  }

  // seed a few immediately so the scene isn't empty on load
  for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 900);

  setInterval(spawnPetal, 2200);
}

const BURST_COLORS = ['#c8918a', '#d8a566', '#f3d3d8', '#e9c9a9', '#6e2f3b'];

function drawHeartPath(ctx, size) {
  const s = size / 10;
  ctx.beginPath();
  ctx.moveTo(0, 2.4 * s);
  ctx.bezierCurveTo(-5 * s, -2 * s, -4.6 * s, -6 * s, 0, -3.6 * s);
  ctx.bezierCurveTo(4.6 * s, -6 * s, 5 * s, -2 * s, 0, 2.4 * s);
  ctx.closePath();
}

/**
 * Wires up the finale heart-burst button to a physics-driven
 * confetti cannon (gravity, drag, paper flutter) drawn on <canvas>.
 */
export function initFinaleBurst(buttonEl, canvasEl) {
  if (!buttonEl || !canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  let particles = [];
  let running = false;

  function resize() {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = rect.height;
  }
  window.addEventListener('resize', resize);

  function spawnBurst() {
    resize();
    const cx = canvasEl.width / 2;
    const cy = canvasEl.height / 2;
    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;               // slower launch, wider variance = fuller spread
      const roll = Math.random();
      const type = roll < 0.45 ? 'rect' : (roll < 0.75 ? 'heart' : 'dot');
      particles.push({
        x: cx + (Math.random() - 0.5) * 30,               // slight origin spread, not a single point
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        decay: Math.random() * 0.008 + 0.009,              // lingers a bit longer on screen
        size: type === 'rect' ? Math.random() * 7 + 5 : Math.random() * 6 + 4,
        color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
        type,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        flutter: Math.random() * Math.PI * 2
      });
    }
    if (!running) { running = true; requestAnimationFrame(animate); }
  }

  function animate() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    particles.forEach(p => {
      p.vx *= 0.99;
      p.vy += 0.14;                                        // softer gravity — slower, floatier fall
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.rotation += p.spin;
      p.flutter += 0.28;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.type === 'rect') {
        const flip = Math.cos(p.flutter);
        ctx.scale(flip, 1);
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      } else if (p.type === 'heart') {
        drawHeartPath(ctx, p.size);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    particles = particles.filter(p => p.life > 0 && p.y < canvasEl.height + 60);

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
  }

  buttonEl.addEventListener('click', () => {
    spawnBurst();
    setTimeout(spawnBurst, 90);
    setTimeout(spawnBurst, 180);
  });
}
