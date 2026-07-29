/* =========================================================
   main.js — boots the experience and wires every module together
   ========================================================= */
import { initEnvelope } from './envelope.js';
import { initGallery } from './gallery.js';
import { initLightbox } from './lightbox.js';
import { initTimeline } from './timeline.js';
import { initMusic } from './music.js';
import { initAmbientParticles, initFinaleBurst } from './particles.js';
import { initCursorSparkle } from './cursor.js';

/* ---------------------------------------------------------
   1. LOADER — a glowing ring fills as the page prepares itself
   --------------------------------------------------------- */
function runLoader(onDone) {
  const loader = document.getElementById('loader');
  const ringFill = document.getElementById('ringFill');
  const percentEl = document.getElementById('loaderPercent');
  const RING_LENGTH = 251; // matches stroke-dasharray in the SVG

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      ringFill.style.strokeDashoffset = 0;
      percentEl.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('done');
        onDone();
      }, 350);
      return;
    }
    ringFill.style.strokeDashoffset = RING_LENGTH - (progress / 100) * RING_LENGTH;
    percentEl.textContent = Math.floor(progress) + '%';
  }, 220);
}

/* ---------------------------------------------------------
   2. GENERIC SCROLL REVEAL
   --------------------------------------------------------- */
function startScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => observer.observe(t));
}

/* ---------------------------------------------------------
   3. LOVE LETTER — word-by-word "ink settling" reveal
   --------------------------------------------------------- */
function startLetterReveal() {
  const el = document.getElementById('letterText');
  const section = document.getElementById('letter');
  if (!el || !section) return;

  const fullText = el.textContent;
  el.textContent = '';
  const tokens = fullText.split(/(\s+)/);
  tokens.forEach(token => {
    if (/^\s+$/.test(token)) {
      el.appendChild(document.createTextNode(token));
    } else if (token.length) {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = token;
      el.appendChild(span);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => setTimeout(() => w.classList.add('settled'), i * 18));
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(section);
}

/* ---------------------------------------------------------
   4. QUOTES — typewriter cycle
   --------------------------------------------------------- */
function startQuoteCycle() {
  const el = document.getElementById('quoteText');
  const section = document.getElementById('quotes');
  if (!el || !section) return;

  const quotes = [
    'Every love story is beautiful, but ours is my favorite.',
    'Home is wherever you are.',
    "You're still the one.",
    'I would choose you again. Every day. Every lifetime.'
  ];
  let quoteIndex = 0;
  let started = false;

  function typeQuote() {
    const text = quotes[quoteIndex];
    let i = 0;
    el.textContent = '';
    (function typeChar() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(typeChar, 45);
      } else {
        setTimeout(() => {
          quoteIndex = (quoteIndex + 1) % quotes.length;
          typeQuote();
        }, 2200);
      }
    })();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        typeQuote();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(section);
}

/* ---------------------------------------------------------
   5. HERO — mouse-driven parallax on the cinematic backdrop
   --------------------------------------------------------- */
function startHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarsePointer) return;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty('--parallaxX', (px * 30).toFixed(1) + 'px');
    hero.style.setProperty('--parallaxY', (py * 30).toFixed(1) + 'px');
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--parallaxX', '0px');
    hero.style.setProperty('--parallaxY', '0px');
  });
}

/* ---------------------------------------------------------
   6. FINALE — words settle one at a time, then arm the burst button
      and the "I Love You" popup that appears when it's pressed
   --------------------------------------------------------- */
function startFinale() {
  const section = document.getElementById('finale');
  const words = document.querySelectorAll('.finale-word');
  const finaleBtn = document.getElementById('finaleBtn');
  const popup = document.getElementById('finalePopup');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((word, i) => setTimeout(() => word.classList.add('settled'), i * 420));
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(section);

  initFinaleBurst(finaleBtn, document.getElementById('burstCanvas'));

  finaleBtn?.addEventListener('click', () => {
    if (!popup) return;
    section.classList.add('popup-active');
    popup.classList.remove('show');
    void popup.offsetWidth; // restart the animation if clicked more than once
    popup.classList.add('show');

    setTimeout(() => section.classList.remove('popup-active'), 2600);
  });
}

/* ---------------------------------------------------------
   BOOT SEQUENCE
   --------------------------------------------------------- */
function bootSite() {
  const site = document.getElementById('site');
  const music = initMusic();

  site.hidden = false;
  document.body.style.overflow = '';

  const photos = initGallery((index) => lightbox.open(index));
  const lightbox = initLightbox(photos);

  initTimeline();
  startScrollReveal();
  startLetterReveal();
  startQuoteCycle();
  startHeroParallax();
  startFinale();
  music.tryPlay();
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  initCursorSparkle();
  initAmbientParticles();

  runLoader(() => {
    const gate = document.getElementById('envelope-gate');
    gate.classList.add('visible');
    initEnvelope(bootSite);
  });

  document.getElementById('openHeartBtn')?.addEventListener('click', () => {
    document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
  });
});
