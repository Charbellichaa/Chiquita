/* =========================================================
   envelope.js — the opening ritual
   ========================================================= */

export function initEnvelope(onOpen) {
  const envelopeBtn = document.getElementById('envelopeBtn');
  const envelopeGate = document.getElementById('envelope-gate');
  const waxSeal = envelopeBtn?.querySelector('.wax-seal');
  if (!envelopeBtn || !envelopeGate) return;

  let opened = false;

  // subtle 3D tilt toward the cursor — same interaction language as the scrapbook
  envelopeBtn.addEventListener('pointermove', (e) => {
    if (opened) return;
    const rect = envelopeBtn.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    envelopeBtn.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
  });
  envelopeBtn.addEventListener('pointerleave', () => {
    envelopeBtn.style.transform = '';
  });

  envelopeBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelopeBtn.style.transform = '';

    // wax seal cracks open first, a beat before the flap lifts
    waxSeal?.classList.add('pop');
    setTimeout(() => envelopeBtn.classList.add('open'), 180);

    setTimeout(() => {
      envelopeGate.classList.add('leaving');
      setTimeout(() => envelopeGate.setAttribute('data-hidden', ''), 900);
      if (typeof onOpen === 'function') onOpen();
    }, 750);
  });
}
