/* =========================================================
   music.js — the custom audio player
   ========================================================= */

export function initMusic() {
  const audio = document.getElementById('audio');
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
  if (!audio) return { tryPlay: () => Promise.reject() };

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
    mpSeek.value = audio.currentTime;
  });
  mpSeek.addEventListener('input', () => { audio.currentTime = mpSeek.value; });
  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));

  return {
    tryPlay: () => audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false))
  };
}
