/**
 * filters.js
 * Applies CSS filter classes to the live video preview.
 * Also provides canvas-based filter rendering for captured frames.
 */

const Filters = (() => {
  let currentFilter = 'none';

  const filterMap = {
    none:      'filter-none',
    grayscale: 'filter-grayscale',
    sepia:     'filter-sepia',
    vintage:   'filter-vintage',
    cool:      'filter-cool',
    warm:      'filter-warm',
    pixel:     'filter-pixel',
    glitch:    'filter-glitch',
  };

  // CSS filter strings for canvas rendering
  const canvasFilterMap = {
    none:      'none',
    grayscale: 'grayscale(1) contrast(1.1)',
    sepia:     'sepia(0.9) contrast(1.05) brightness(0.95)',
    vintage:   'sepia(0.5) saturate(0.8) contrast(1.1) brightness(0.9)',
    cool:      'hue-rotate(180deg) saturate(1.4) brightness(1.05)',
    warm:      'hue-rotate(-20deg) saturate(1.5) brightness(1.05)',
    pixel:     'contrast(2) saturate(2) brightness(0.9)',
    glitch:    'hue-rotate(90deg) saturate(2) contrast(1.5)',
  };

  function applyToVideo(filterName) {
    const video = document.getElementById('video');
    if (!video) return;
    // Remove all filter classes
    Object.values(filterMap).forEach(cls => video.classList.remove(cls));
    const cls = filterMap[filterName] || filterMap['none'];
    video.classList.add(cls);
    currentFilter = filterName;
  }

  // Apply filter to a canvas context before drawing video frame
  function applyToCanvas(ctx, filterName) {
    ctx.filter = canvasFilterMap[filterName] || 'none';
  }

  function resetCanvas(ctx) {
    ctx.filter = 'none';
  }

  function getCurrent() { return currentFilter; }

  // Glitch effect: draw with chromatic aberration
  function drawGlitchFrame(ctx, video, w, h) {
    ctx.filter = 'none';
    // Red channel offset
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'saturate(2)';
    ctx.globalAlpha = 0.8;
    ctx.drawImage(video, -4, 0, w, h);
    ctx.filter = 'hue-rotate(180deg) saturate(2)';
    ctx.globalAlpha = 0.8;
    ctx.drawImage(video, 4, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
  }

  return { applyToVideo, applyToCanvas, resetCanvas, getCurrent, drawGlitchFrame, canvasFilterMap };
})();
