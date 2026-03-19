/**
 * camera.js
 * Handles webcam access, countdown timer, and photo capture.
 */

const Camera = (() => {
  let stream      = null;
  let timerSec    = 3;
  let isCapturing = false;
  let countdownId = null;

  // Start webcam
  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' },
        audio: false
      });
      const video = document.getElementById('video');
      video.srcObject = stream;
      await video.play();
      return true;
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera.\n\nMake sure you allow camera permission!');
      return false;
    }
  }

  // Stop webcam
  function stop() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  // Set countdown timer value
  function setTimer(sec) { timerSec = sec; }

  // Capture a single photo after countdown
  // Returns a Promise<dataURL>
  function captureWithCountdown() {
    return new Promise((resolve) => {
      if (isCapturing) return;
      isCapturing = true;

      const display = document.getElementById('countdown-display');
      let count = timerSec;

      function tick() {
        if (count <= 0) {
          display.innerHTML = '';
          isCapturing = false;
          resolve(grabFrame());
          return;
        }
        display.innerHTML = `<span class="count-num">${count}</span>`;
        Sounds.countdown(count);
        count--;
        countdownId = setTimeout(tick, 1000);
      }
      tick();
    });
  }

  // Grab current video frame as dataURL
  function grabFrame() {
    const video  = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    // Mirror (since video is CSS-mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const filter = Filters.getCurrent();
    if (filter === 'glitch') {
      Filters.drawGlitchFrame(ctx, video, canvas.width, canvas.height);
    } else {
      Filters.applyToCanvas(ctx, filter);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      Filters.resetCanvas(ctx);
    }

    // Trigger flash
    const flash = document.getElementById('flash-overlay');
    if (flash) {
      flash.classList.add('flash');
      setTimeout(() => flash.classList.remove('flash'), 300);
    }

    Sounds.shutter();
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  function cancelCountdown() {
    if (countdownId) clearTimeout(countdownId);
    isCapturing = false;
    const display = document.getElementById('countdown-display');
    if (display) display.innerHTML = '';
  }

  function getTimerSec() { return timerSec; }
  function isBusy() { return isCapturing; }

  return { start, stop, captureWithCountdown, grabFrame, setTimer, cancelCountdown, getTimerSec, isBusy };
})();
