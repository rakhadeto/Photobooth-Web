/**
 * frames.js
 * Draws decorative frames/overlays on the live camera preview (CSS)
 * and on the final canvas strip.
 */

const Frames = (() => {
  let currentFrame = 'none';

  // CSS overlay HTML per frame
  const overlayHTML = {
    none:   '',
    arcade: `
      <div style="position:absolute;inset:0;pointer-events:none;border:6px solid #ffe600;box-shadow:inset 0 0 20px rgba(255,230,0,0.3);">
        <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-family:'Press Start 2P',monospace;font-size:8px;color:#ffe600;letter-spacing:2px;text-shadow:0 0 8px #ffe600;">ARCADE</div>
        <div style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);font-family:'Press Start 2P',monospace;font-size:6px;color:#ff6b00;letter-spacing:1px;">INSERT COIN</div>
      </div>`,
    pixels: `
      <div style="position:absolute;inset:0;pointer-events:none;">
        <div style="position:absolute;top:0;left:0;right:0;height:12px;background:repeating-linear-gradient(90deg,#ffe600,#ffe600 8px,#ff6b00 8px,#ff6b00 16px);opacity:0.8;"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:12px;background:repeating-linear-gradient(90deg,#ff6b00,#ff6b00 8px,#ffe600 8px,#ffe600 16px);opacity:0.8;"></div>
        <div style="position:absolute;top:0;left:0;bottom:0;width:12px;background:repeating-linear-gradient(180deg,#00fff7,#00fff7 8px,#ffe600 8px,#ffe600 16px);opacity:0.8;"></div>
        <div style="position:absolute;top:0;right:0;bottom:0;width:12px;background:repeating-linear-gradient(180deg,#ffe600,#ffe600 8px,#00fff7 8px,#00fff7 16px);opacity:0.8;"></div>
      </div>`,
    stars: `
      <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;">
        <span style="position:absolute;font-size:16px;top:4px;left:4px;">⭐</span>
        <span style="position:absolute;font-size:16px;top:4px;right:4px;">⭐</span>
        <span style="position:absolute;font-size:16px;bottom:4px;left:4px;">⭐</span>
        <span style="position:absolute;font-size:16px;bottom:4px;right:4px;">⭐</span>
        <span style="position:absolute;font-size:10px;top:4px;left:50%;transform:translateX(-50%);color:#ffe600;font-family:'Press Start 2P';text-shadow:0 0 8px #ffe600;">★ ★ ★</span>
      </div>`,
    retro: `
      <div style="position:absolute;inset:0;pointer-events:none;border:8px double #cc00ff;box-shadow:inset 0 0 24px rgba(204,0,255,0.25),0 0 16px rgba(204,0,255,0.3);">
        <div style="position:absolute;top:-1px;left:16px;right:16px;height:4px;background:#cc00ff;"></div>
        <div style="position:absolute;bottom:-1px;left:16px;right:16px;height:4px;background:#cc00ff;"></div>
      </div>`,
    neon: `
      <div style="position:absolute;inset:0;pointer-events:none;border:3px solid #00fff7;box-shadow:inset 0 0 30px rgba(0,255,247,0.15),0 0 20px rgba(0,255,247,0.3);">
        <div style="position:absolute;top:8px;left:8px;right:8px;bottom:8px;border:1px solid rgba(0,255,247,0.3);"></div>
      </div>`,
  };

  function applyOverlay(frameName) {
    const overlay = document.getElementById('frame-overlay');
    if (!overlay) return;
    overlay.innerHTML = overlayHTML[frameName] || '';
    currentFrame = frameName;
  }

  // Draw frame border on canvas for strip building
  function drawOnCanvas(ctx, frameName, x, y, w, h) {
    ctx.save();
    switch (frameName) {
      case 'arcade':
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 6;
        ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
        ctx.fillStyle = '#ffe600';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ARCADE', x + w / 2, y + 14);
        break;
      case 'pixels':
        const colors = ['#ffe600', '#ff6b00', '#00fff7'];
        for (let i = 0; i < w; i += 8) {
          ctx.fillStyle = colors[Math.floor(i / 8) % colors.length];
          ctx.fillRect(x + i, y, 8, 6);
          ctx.fillRect(x + i, y + h - 6, 8, 6);
        }
        for (let j = 0; j < h; j += 8) {
          ctx.fillStyle = colors[Math.floor(j / 8) % colors.length];
          ctx.fillRect(x, y + j, 6, 8);
          ctx.fillRect(x + w - 6, y + j, 6, 8);
        }
        break;
      case 'stars':
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 4;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        ctx.font = '14px serif';
        ctx.fillText('⭐', x + 4, y + 16);
        ctx.fillText('⭐', x + w - 18, y + 16);
        ctx.fillText('⭐', x + 4, y + h - 4);
        ctx.fillText('⭐', x + w - 18, y + h - 4);
        break;
      case 'retro':
        ctx.strokeStyle = '#cc00ff';
        ctx.lineWidth = 5;
        ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
        ctx.strokeStyle = 'rgba(204,0,255,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
        break;
      case 'neon':
        ctx.strokeStyle = '#00fff7';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00fff7';
        ctx.shadowBlur = 12;
        ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0,255,247,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
        break;
      default: break;
    }
    ctx.restore();
  }

  function getCurrent() { return currentFrame; }

  return { applyOverlay, drawOnCanvas, getCurrent };
})();
