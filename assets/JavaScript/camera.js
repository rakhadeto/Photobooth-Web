/**
 * camera.js — with MediaPipe Selfie Segmentation for real virtual background
 */

const Camera = (() => {
  let stream        = null;
  let timerSec      = 3;
  let isCapturing   = false;
  let countdownId   = null;
  let segmentation  = null;
  let animFrame     = null;
  let videoEl       = null;
  let liveCanvasEl  = null;
  let liveCtx       = null;
  let bgCanvas      = null; // offscreen for background drawing
  let bgCtx         = null;
  let bgTick        = 0;
  let mpReady       = false;

  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' },
        audio: false
      });
      videoEl       = document.getElementById('video');
      liveCanvasEl  = document.getElementById('live-canvas');
      liveCtx       = liveCanvasEl.getContext('2d');
      videoEl.srcObject = stream;
      await videoEl.play();

      // Offscreen canvas for bg drawing
      bgCanvas = document.createElement('canvas');
      bgCtx    = bgCanvas.getContext('2d');

      await initSegmentation();
      startRenderLoop();
      return true;
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera.\nAllow camera permission!');
      return false;
    }
  }

  async function initSegmentation() {
    try {
      // MediaPipe Selfie Segmentation
      segmentation = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });
      segmentation.setOptions({ modelSelection: 1, selfieMode: true });
      segmentation.onResults(onSegmentationResults);
      mpReady = true;
    } catch(e) {
      console.warn('MediaPipe not available, fallback mode', e);
      mpReady = false;
    }
  }

  let lastMask = null;

  function onSegmentationResults(results) {
    lastMask = results.segmentationMask;
  }

  function startRenderLoop() {
    if (animFrame) cancelAnimationFrame(animFrame);

    async function render() {
      const w = videoEl.videoWidth  || 640;
      const h = videoEl.videoHeight || 480;

      liveCanvasEl.width  = liveCanvasEl.offsetWidth  || w;
      liveCanvasEl.height = liveCanvasEl.offsetHeight || h;
      bgCanvas.width  = liveCanvasEl.width;
      bgCanvas.height = liveCanvasEl.height;

      const cw = liveCanvasEl.width;
      const ch = liveCanvasEl.height;

      const currentBg = Backgrounds.getCurrent();

      // ── NO VIRTUAL BG: just draw video + filter ──
      if (currentBg === 'none') {
        liveCtx.save();
        liveCtx.translate(cw, 0); liveCtx.scale(-1, 1);
        applyFilterToCtx(liveCtx);
        liveCtx.drawImage(videoEl, 0, 0, cw, ch);
        liveCtx.filter = 'none';
        liveCtx.restore();

      // ── VIRTUAL BG with segmentation ──
      } else {
        // 1. Draw virtual background onto bgCanvas
        bgCtx.clearRect(0, 0, cw, ch);
        Backgrounds.drawFrame(bgCtx, cw, ch, bgTick);

        // 2. Send frame to MediaPipe
        if (mpReady && segmentation) {
          try {
            await segmentation.send({ image: videoEl });
          } catch(e) {}
        }

        // 3. Composite: bg + masked person
        liveCtx.clearRect(0, 0, cw, ch);

        // Draw background first
        liveCtx.drawImage(bgCanvas, 0, 0, cw, ch);

        if (mpReady && lastMask) {
          // Draw person using segmentation mask
          // Temp canvas for masked person
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = cw; tempCanvas.height = ch;
          const tempCtx = tempCanvas.getContext('2d');

          // Draw video (mirrored) onto temp
          tempCtx.save();
          tempCtx.translate(cw, 0); tempCtx.scale(-1, 1);
          applyFilterToCtx(tempCtx);
          tempCtx.drawImage(videoEl, 0, 0, cw, ch);
          tempCtx.filter = 'none';
          tempCtx.restore();

          // Use mask to keep only person pixels
          // Blur the mask first for soft feathered edges
          const blurredMask = document.createElement('canvas');
          blurredMask.width = cw; blurredMask.height = ch;
          const bmCtx = blurredMask.getContext('2d');
          bmCtx.filter = 'blur(5px)';
          bmCtx.drawImage(lastMask, 0, 0, cw, ch);
          bmCtx.filter = 'none';

          // Apply blurred mask to person
          tempCtx.globalCompositeOperation = 'destination-in';
          tempCtx.drawImage(blurredMask, 0, 0, cw, ch);
          tempCtx.globalCompositeOperation = 'source-over';

          liveCtx.drawImage(tempCanvas, 0, 0);

        } else {
          // Fallback: no segmentation, just overlay video with screen blend
          liveCtx.save();
          liveCtx.globalCompositeOperation = 'screen';
          liveCtx.translate(cw, 0); liveCtx.scale(-1, 1);
          applyFilterToCtx(liveCtx);
          liveCtx.drawImage(videoEl, 0, 0, cw, ch);
          liveCtx.filter = 'none';
          liveCtx.restore();
        }
      }

      // Subtle face highlight — brightens eye/face area slightly
      // Positioned upper-center where face typically is
      const faceX = cw * 0.5;
      const faceY = ch * 0.28;
      const faceR = Math.min(cw, ch) * 0.22;

      const currentFilter = Filters.getCurrent();
      // Stronger highlight for dark filters, subtle for normal
      const hlStrength = {
        none:      0.10,
        grayscale: 0.18,
        sepia:     0.14,
        vintage:   0.14,
        cool:      0.14,
        warm:      0.10,
        pixel:     0.20,
        glitch:    0.18,
      }[currentFilter] || 0.12;

      const faceHL = liveCtx.createRadialGradient(faceX, faceY, 0, faceX, faceY, faceR);
      faceHL.addColorStop(0,   `rgba(255,240,220,${hlStrength})`);
      faceHL.addColorStop(0.5, `rgba(255,235,210,${hlStrength * 0.5})`);
      faceHL.addColorStop(1,   'rgba(255,235,210,0)');
      liveCtx.fillStyle = faceHL;
      liveCtx.fillRect(faceX - faceR, faceY - faceR, faceR * 2, faceR * 2);

      // Draw frame LAST — on top of everything (bg + person)
      const currentFrame = Frames.getCurrent();
      if (currentFrame && currentFrame !== 'none') {
        Frames.drawOnCanvas(liveCtx, currentFrame, 0, 0, cw, ch);
      }

      bgTick++;
      animFrame = requestAnimationFrame(render);
    }

    render();
  }

  function applyFilterToCtx(ctx) {
    const filter = Filters.getCurrent();
    ctx.filter = Filters.canvasFilterMap[filter] || 'none';
  }

  function stop() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    lastMask = null;
  }

  function setTimer(sec) { timerSec = sec; }

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

  function grabFrame() {
    const flash = document.getElementById('flash-overlay');
    if (flash) { flash.classList.add('flash'); setTimeout(() => flash.classList.remove('flash'), 300); }
    Sounds.shutter();
    return liveCanvasEl.toDataURL('image/jpeg', 0.92);
  }

  function cancelCountdown() {
    if (countdownId) clearTimeout(countdownId);
    isCapturing = false;
    const d = document.getElementById('countdown-display');
    if (d) d.innerHTML = '';
  }

  function isBusy() { return isCapturing; }

  return { start, stop, captureWithCountdown, grabFrame, setTimer, cancelCountdown, isBusy };
})();
