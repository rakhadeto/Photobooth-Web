/**
 * app.js
 * Main application controller — manages screen flow, state, and UI events.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── STATE ──
  const state = {
    playerName:  '',
    photoCount:  4,
    layout:      'vertical',
    photos:      [],
    score:       0,
  };

  // ── HELPERS ──
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function addScore(pts) {
    state.score += pts;
    const el = document.getElementById('score-val');
    if (el) el.textContent = String(state.score).padStart(6, '0');
  }

  function updateShotDots() {
    const container = document.getElementById('shot-dots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < state.photoCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'shot-dot' + (i < state.photos.length ? ' taken' : '');
      container.appendChild(dot);
    }
  }

  function updateCaptureButtons() {
    const btnCapture = document.getElementById('btn-capture');
    const btnDone    = document.getElementById('btn-done-capture');
    const allTaken   = state.photos.length >= state.photoCount;
    if (btnCapture) btnCapture.style.display = allTaken ? 'none' : '';
    if (btnDone)    btnDone.style.display    = allTaken ? '' : 'none';
  }

  // ── PIXEL PARTICLES ──
  function initParticles() {
    const container = document.getElementById('pixel-particles');
    if (!container) return;
    const colors = ['#ffe600','#ff6b00','#00fff7','#00ff88','#cc00ff','#ff00aa'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'px-particle';
      p.style.left     = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration  = (6 + Math.random() * 14) + 's';
      p.style.animationDelay     = (Math.random() * 10) + 's';
      p.style.width  = (3 + Math.random() * 5) + 'px';
      p.style.height = (3 + Math.random() * 5) + 'px';
      container.appendChild(p);
    }
  }

  // ── SETUP SCREEN ──
  const countMinus  = document.getElementById('count-minus');
  const countPlus   = document.getElementById('count-plus');
  const countVal    = document.getElementById('count-val');

  countMinus.addEventListener('click', () => {
    if (state.photoCount > 1) { state.photoCount--; countVal.textContent = state.photoCount; }
    Sounds.click();
  });
  countPlus.addEventListener('click', () => {
    if (state.photoCount < 10) { state.photoCount++; countVal.textContent = state.photoCount; }
    Sounds.click();
  });

  // Allow manual input on count
  countVal.addEventListener('click', () => {
    const input = prompt('Enter number of photos (1-10):', state.photoCount);
    const n = parseInt(input);
    if (!isNaN(n) && n >= 1 && n <= 10) {
      state.photoCount = n;
      countVal.textContent = n;
    }
  });

  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.layout = btn.dataset.layout;
      Sounds.click();
    });
  });

  document.getElementById('btn-start-setup').addEventListener('click', async () => {
    const nameInput = document.getElementById('player-name');
    state.playerName = nameInput.value.trim() || 'PLAYER 1';
    state.photos = [];

    Sounds.start();
    showScreen('screen-camera');

    // Update player name display
    const mini = document.getElementById('player-mini-name');
    if (mini) mini.textContent = state.playerName.toUpperCase();

    updateShotDots();
    updateCaptureButtons();

    const ok = await Camera.start();
    if (!ok) showScreen('screen-setup');
  });

  // ── CAMERA SCREEN ──

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Filters.applyToVideo(btn.dataset.filter);
      Sounds.click();
    });
  });

  // Frame buttons
  document.querySelectorAll('.frame-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Frames.applyOverlay(btn.dataset.frame);
      Sounds.click();
    });
  });

  // Background buttons
  document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Backgrounds.setBackground(btn.dataset.bg);
      Sounds.click();
    });
  });

  // Timer buttons
  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Camera.setTimer(parseInt(btn.dataset.timer));
      Sounds.click();
    });
  });

  // SHOOT button
  document.getElementById('btn-capture').addEventListener('click', async () => {
    if (Camera.isBusy()) return;
    if (state.photos.length >= state.photoCount) return;

    const dataUrl = await Camera.captureWithCountdown();
    state.photos.push(dataUrl);
    addScore(100);

    updateShotDots();
    updateCaptureButtons();

    // Auto-proceed when all shots taken
    if (state.photos.length >= state.photoCount) {
      setTimeout(() => proceedToResult(), 600);
    }
  });

  // RETAKE button
  document.getElementById('btn-retake').addEventListener('click', () => {
    if (state.photos.length === 0) return;
    Camera.cancelCountdown();
    state.photos.pop();
    updateShotDots();
    updateCaptureButtons();
    Sounds.click();
  });

  // DONE button
  document.getElementById('btn-done-capture').addEventListener('click', () => {
    if (state.photos.length > 0) proceedToResult();
  });

  async function proceedToResult() {
    Camera.stop();
    showScreen('screen-result');

    const nameEl = document.getElementById('result-name');
    if (nameEl) nameEl.textContent = '// ' + state.playerName.toUpperCase() + ' //';

    await Strip.build(state.photos, state.layout, state.playerName, Frames.getCurrent());
    Sounds.complete();
    addScore(500);
  }

  // ── RESULT SCREEN ──
  document.getElementById('btn-download').addEventListener('click', () => {
    Download.downloadStrip(state.playerName);
    addScore(50);
  });

  document.getElementById('btn-show-qr').addEventListener('click', () => {
    const panel = document.getElementById('qr-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      Download.generateQR(state.playerName);
      Sounds.click();
    }
  });

  document.getElementById('btn-new-game').addEventListener('click', () => {
    state.photos  = [];
    state.layout  = 'vertical';
    Camera.stop();
    Sounds.start();

    // Reset UI
    document.getElementById('player-name').value = '';
    document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.querySelectorAll('.frame-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.querySelectorAll('.layout-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.getElementById('qr-panel').style.display = 'none';

    Filters.applyToVideo('none');
    Frames.applyOverlay('none');

    showScreen('screen-setup');
  });

  // ── INIT ──
  initParticles();
  Download.checkAutoDownload();
  showScreen('screen-setup');
});
