/**
 * strip.js
 * Builds the final photo strip canvas from captured frames.
 */

const Strip = (() => {

  // Build strip and draw to #strip-canvas
  // photos: array of dataURL strings
  // layout: 'vertical' | 'grid'
  // playerName: string
  // frameName: string
  function build(photos, layout, playerName, frameName) {
    return new Promise((resolve) => {
      if (!photos || photos.length === 0) { resolve(null); return; }

      const count = photos.length;
      const PHOTO_W = 400;
      const PHOTO_H = 300;
      const PADDING  = 12;
      const HEADER_H = 48;
      const FOOTER_H = 44;
      const BORDER   = 4;

      let canvasW, canvasH;
      let positions = [];

      if (layout === 'grid') {
        const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        canvasW = cols * (PHOTO_W + PADDING) + PADDING;
        canvasH = HEADER_H + rows * (PHOTO_H + PADDING) + PADDING + FOOTER_H;
        for (let i = 0; i < count; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          positions.push({
            x: PADDING + col * (PHOTO_W + PADDING),
            y: HEADER_H + PADDING + row * (PHOTO_H + PADDING)
          });
        }
      } else {
        // vertical strip
        canvasW = PHOTO_W + PADDING * 2;
        canvasH = HEADER_H + count * (PHOTO_H + PADDING) + PADDING + FOOTER_H;
        for (let i = 0; i < count; i++) {
          positions.push({
            x: PADDING,
            y: HEADER_H + PADDING + i * (PHOTO_H + PADDING)
          });
        }
      }

      const canvas = document.getElementById('strip-canvas');
      canvas.width  = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');

      // BG
      ctx.fillStyle = '#0a0608';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Pixel border
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = BORDER;
      ctx.strokeRect(BORDER / 2, BORDER / 2, canvasW - BORDER, canvasH - BORDER);

      // Header
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(0, 0, canvasW, HEADER_H);
      ctx.fillStyle = '#0a0608';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ PIXEL BOOTH ★', canvasW / 2, HEADER_H / 2);

      // Load all images
      let loaded = 0;
      const imgs = photos.map((src) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          if (loaded === photos.length) {
            // Draw all photos
            photos.forEach((_, i) => {
              const pos = positions[i];
              const img = imgs[i];

              // Photo background
              ctx.fillStyle = '#111';
              ctx.fillRect(pos.x, pos.y, PHOTO_W, PHOTO_H);

              // Draw image (cover)
              const scale = Math.max(PHOTO_W / img.width, PHOTO_H / img.height);
              const sw = img.width * scale;
              const sh = img.height * scale;
              const sx = pos.x + (PHOTO_W - sw) / 2;
              const sy = pos.y + (PHOTO_H - sh) / 2;
              ctx.drawImage(img, sx, sy, sw, sh);

              // Frame
              if (frameName && frameName !== 'none') {
                Frames.drawOnCanvas(ctx, frameName, pos.x, pos.y, PHOTO_W, PHOTO_H);
              }

              // Shot number badge
              ctx.fillStyle = 'rgba(0,0,0,0.65)';
              ctx.fillRect(pos.x + PHOTO_W - 28, pos.y + 2, 26, 18);
              ctx.fillStyle = '#ffe600';
              ctx.font = 'bold 10px monospace';
              ctx.textAlign = 'right';
              ctx.textBaseline = 'top';
              ctx.fillText(`#${i + 1}`, pos.x + PHOTO_W - 4, pos.y + 4);
            });

            // Footer
            const fy = canvasH - FOOTER_H;
            ctx.fillStyle = '#0a0608';
            ctx.fillRect(0, fy, canvasW, FOOTER_H);
            ctx.strokeStyle = 'rgba(255,230,0,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(canvasW, fy); ctx.stroke();

            ctx.fillStyle = '#00fff7';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const name = playerName ? playerName.toUpperCase() : 'PLAYER 1';
            ctx.fillText(`${name} · ${new Date().toLocaleDateString('id-ID')}`, canvasW / 2, fy + FOOTER_H / 2);

            resolve(canvas);
          }
        };
        img.onerror = () => { loaded++; };
        img.src = src;
        return img;
      });
    });
  }

  return { build };
})();
