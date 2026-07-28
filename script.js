/* =========================================================
   CHIQUITA — script.js
   Vanilla JS only. No dependencies.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. LOADER
     --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderPercent = document.getElementById('loaderPercent');
  const envelopeGate = document.getElementById('envelope-gate');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      loaderFill.style.width = '100%';
      loaderPercent.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('done');
        envelopeGate.classList.add('visible');
      }, 350);
      return;
    }
    loaderFill.style.width = progress + '%';
    loaderPercent.textContent = Math.floor(progress) + '%';
  }, 220);

  /* ---------------------------------------------------------
     2. ENVELOPE
     --------------------------------------------------------- */
  const envelopeBtn = document.getElementById('envelopeBtn');
  const site = document.getElementById('site');
  const audio = document.getElementById('audio');
  let opened = false;

  envelopeBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelopeBtn.classList.add('open');

    // reveal the site behind the envelope after the letter slides up
    setTimeout(() => {
      envelopeGate.classList.add('leaving');
      site.hidden = false;
      document.body.style.overflow = '';
      initScrollReveal();     // start observing once elements are visible
      initScrapbook();
      startQuoteCycle();
      typewriterLetter();

      // try to start music (user gesture already happened via this click)
      audio.play().then(() => {
        setPlayingUI(true);
      }).catch(() => {
        setPlayingUI(false); // autoplay blocked — user can press play manually
      });

      setTimeout(() => envelopeGate.setAttribute('data-hidden', ''), 900);
    }, 750);
  });

  /* ---------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
     --------------------------------------------------------- */
  let revealObserver;
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(t => revealObserver.observe(t));
  }

  /* ---------------------------------------------------------
     4. HERO "Open My Heart" -> smooth scroll to letter
     --------------------------------------------------------- */
  document.getElementById('openHeartBtn').addEventListener('click', () => {
    document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     5. LOVE LETTER — typewriter reveal, line by line
     --------------------------------------------------------- */
  function typewriterLetter() {
    const el = document.getElementById('letterText');
    const fullText = el.textContent.trim();
    el.textContent = '';
    el.style.opacity = '1';

    let i = 0;
    const speed = 12; // ms per character — fast enough not to feel tedious
    function type() {
      if (i <= fullText.length) {
        el.textContent = fullText.slice(0, i);
        i += 3; // a few characters per tick for a natural "writing" feel
        requestAnimationFrame(() => setTimeout(type, speed));
      }
    }
    // only start typing once the letter section scrolls into view
    const letterSection = document.getElementById('letter');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(letterSection);
  }

  /* ---------------------------------------------------------
     6. SCRAPBOOK — build 10 polaroids + lightbox
     --------------------------------------------------------- */
  const captions = [
    'My favorite dress', 'us, being us', 'my favorite face', 'My squeeze face',
    'In your era', 'Our First Pizza', 'again, please',
    'you, mid-laugh', 'those pretty eyes of yours', 'always'
  ];
  const rotations = [-6, 4, -3, 7, -8, 2, -4, 6, -2, 5];

  let photos = [];

  function initScrapbook() {
    const grid = document.getElementById('scrapbookGrid');
    grid.innerHTML = '';
    photos = [];

    for (let i = 1; i <= 10; i++) {
      const src = `assets/images/${i}.jpg`;
      photos.push({ src, caption: captions[i - 1] });

      const fig = document.createElement('figure');
      fig.className = 'polaroid';
      fig.style.setProperty('--rot', rotations[i - 1] + 'deg');
      fig.style.setProperty('--fdelay', (i * 0.3) + 's');
      fig.tabIndex = 0;
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', `Open photo: ${captions[i - 1]}`);
      fig.dataset.index = i - 1;

      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.alt = captions[i - 1];
      // graceful placeholder if the real photo hasn't been added yet
      img.addEventListener('error', () => {
        img.src = placeholderDataURI(i);
      });

      const cap = document.createElement('figcaption');
      cap.textContent = captions[i - 1];

      fig.appendChild(img);
      fig.appendChild(cap);
      grid.appendChild(fig);

      fig.addEventListener('click', () => openLightbox(i - 1));
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i - 1);
        }
      });
    }
  }

  // simple inline SVG placeholder so the scrapbook looks intentional
  // before real photos are dropped into assets/images/
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

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  let currentPhoto = 0;

  function openLightbox(index) {
    currentPhoto = index;
    renderLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.getElementById('lbClose').focus();
  }
  function renderLightbox() {
    const p = photos[currentPhoto];
    lbImage.src = p.src;
    lbImage.alt = p.caption;
    lbImage.onerror = () => { lbImage.src = placeholderDataURI(currentPhoto + 1); };
    lbCaption.textContent = p.caption;
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function nextPhoto() { currentPhoto = (currentPhoto + 1) % photos.length; renderLightbox(); }
  function prevPhoto() { currentPhoto = (currentPhoto - 1 + photos.length) % photos.length; renderLightbox(); }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbNext').addEventListener('click', nextPhoto);
  document.getElementById('lbPrev').addEventListener('click', prevPhoto);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? nextPhoto() : prevPhoto();
  }, { passive: true });

  /* ---------------------------------------------------------
     7. QUOTES — typewriter cycle
     --------------------------------------------------------- */
  const quotes = [
    'Every love story is beautiful, but ours is my favorite.',
    'Home is wherever you are.',
    "You're still the one.",
    'I would choose you again. Every day. Every lifetime.'
  ];
  let quoteIndex = 0;
  let quoteTimer = null;

  function startQuoteCycle() {
    const el = document.getElementById('quoteText');
    const quoteSection = document.getElementById('quotes');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !quoteTimer) {
          typeQuote(el);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(quoteSection);
  }

  function typeQuote(el) {
    const text = quotes[quoteIndex];
    let i = 0;
    el.textContent = '';
    function typeChar() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        quoteTimer = setTimeout(typeChar, 45);
      } else {
        quoteTimer = setTimeout(() => {
          quoteIndex = (quoteIndex + 1) % quotes.length;
          typeQuote(el);
        }, 2200);
      }
    }
    typeChar();
  }

  /* ---------------------------------------------------------
     8. MUSIC PLAYER
     --------------------------------------------------------- */
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const muteBtn = document.getElementById('muteBtn');
  const iconVolUp = document.getElementById('iconVolUp');
  const iconVolMute = document.getElementById('iconVolMute');
  const volumeSlider = document.getElementById('volumeSlider');
  const mpSeek = document.getElementById('mpSeek');
  const mpCurrent = document.getElementById('mpCurrent');
  const mpDuration = document.getElementById('mpDuration');

  audio.volume = 0.7;

  function setPlayingUI(isPlaying) {
    iconPlay.hidden = isPlaying;
    iconPause.hidden = !isPlaying;
    playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  }

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlayingUI(true)).catch(() => {});
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    iconVolUp.hidden = audio.muted;
    iconVolMute.hidden = !audio.muted;
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = parseFloat(e.target.value);
    if (audio.volume === 0) {
      audio.muted = true; iconVolUp.hidden = true; iconVolMute.hidden = false;
    } else if (audio.muted) {
      audio.muted = false; iconVolUp.hidden = false; iconVolMute.hidden = true;
    }
  });

  function formatTime(sec) {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    mpDuration.textContent = formatTime(audio.duration);
    mpSeek.max = Math.floor(audio.duration) || 100;
  });
  audio.addEventListener('timeupdate', () => {
    mpCurrent.textContent = formatTime(audio.currentTime);
    if (!mpSeek.dragging) mpSeek.value = audio.currentTime;
  });
  mpSeek.addEventListener('input', () => { audio.currentTime = mpSeek.value; });
  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));

  /* ---------------------------------------------------------
     9. FINALE — heart / sparkle / confetti burst
     --------------------------------------------------------- */
  const finaleBtn = document.getElementById('finaleBtn');
  const burstCanvas = document.getElementById('burstCanvas');
  const burstCtx = burstCanvas.getContext('2d');
  let burstParticles = [];
  let burstRunning = false;

  function resizeBurstCanvas() {
    const rect = burstCanvas.parentElement.getBoundingClientRect();
    burstCanvas.width = rect.width;
    burstCanvas.height = rect.height;
  }
  window.addEventListener('resize', resizeBurstCanvas);

  const burstShapes = ['❤', '✨', '🌸', '💫'];

  function spawnBurst() {
    resizeBurstCanvas();
    const cx = burstCanvas.width / 2;
    const cy = burstCanvas.height / 2;
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      burstParticles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        size: Math.random() * 16 + 12,
        char: burstShapes[Math.floor(Math.random() * burstShapes.length)],
        spin: (Math.random() - 0.5) * 0.2
      });
    }
    if (!burstRunning) { burstRunning = true; requestAnimationFrame(animateBurst); }
  }

  function animateBurst() {
    burstCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
    burstParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.life -= 0.012;
      p.rotation = (p.rotation || 0) + p.spin;

      burstCtx.save();
      burstCtx.globalAlpha = Math.max(p.life, 0);
      burstCtx.translate(p.x, p.y);
      burstCtx.rotate(p.rotation);
      burstCtx.font = `${p.size}px sans-serif`;
      burstCtx.textAlign = 'center';
      burstCtx.fillText(p.char, 0, 0);
      burstCtx.restore();
    });
    burstParticles = burstParticles.filter(p => p.life > 0);

    if (burstParticles.length > 0) {
      requestAnimationFrame(animateBurst);
    } else {
      burstRunning = false;
      burstCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
    }
  }

  finaleBtn.addEventListener('click', () => {
    spawnBurst();
    setTimeout(spawnBurst, 200);
    setTimeout(spawnBurst, 400);
  });

  /* ---------------------------------------------------------
     10. CURSOR SPARKLE (desktop only, subtle)
     --------------------------------------------------------- */
  const sparkleCanvas = document.getElementById('sparkle-canvas');
  const sctx = sparkleCanvas.getContext('2d');
  let sparkles = [];
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  function resizeSparkleCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  resizeSparkleCanvas();
  window.addEventListener('resize', resizeSparkleCanvas);

  if (!isCoarsePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastSpawn = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSpawn < 45) return;
      lastSpawn = now;
      sparkles.push({
        x: e.clientX, y: e.clientY,
        life: 1,
        size: Math.random() * 3 + 2
      });
    });

    function animateSparkles() {
      sctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
      sparkles.forEach(s => {
        s.life -= 0.02;
        s.y -= 0.4;
        sctx.save();
        sctx.globalAlpha = Math.max(s.life, 0);
        sctx.fillStyle = '#d8a566';
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
      });
      sparkles = sparkles.filter(s => s.life > 0);
      requestAnimationFrame(animateSparkles);
    }
    animateSparkles();
  }

  /* lock scroll until envelope opens */
  document.body.style.overflow = 'hidden';
})();
