/**
 * download.js
 * Handles strip download and QR code generation.
 */

const Download = (() => {

  // Download strip canvas as PNG
  function downloadStrip(playerName) {
    const canvas = document.getElementById('strip-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    const name  = playerName ? playerName.replace(/[^a-zA-Z0-9]/g, '_') : 'player';
    const date  = new Date().toISOString().slice(0, 10);
    link.download = `pixelbooth_${name}_${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    Sounds.download();
  }

  // Generate QR code pointing to the data URL (via blob URL)
  function generateQR(playerName) {
    const canvas = document.getElementById('strip-canvas');
    if (!canvas) return;

    const container = document.getElementById('qr-code-container');
    container.innerHTML = '';

    // Convert canvas to blob and create object URL
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);

      // QR code pointing to the blob URL
      // Note: blob URLs only work on same device, but good for local use
      try {
        new QRCode(container, {
          text: url,
          width:  180,
          height: 180,
          colorDark:  '#0a0608',
          colorLight: '#ffe600',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        // Fallback: show download instruction
        container.innerHTML = `
          <div style="font-family:monospace;font-size:0.7rem;color:#ffe600;text-align:center;padding:16px;border:2px solid #ffe600;">
            USE DOWNLOAD<br>BUTTON INSTEAD
          </div>`;
      }
    }, 'image/png');
  }

  return { downloadStrip, generateQR };
})();
