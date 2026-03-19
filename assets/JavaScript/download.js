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

  // Generate QR code — uploads image to free image host, returns shareable URL
  async function generateQR(playerName) {
    const canvas = document.getElementById('strip-canvas');
    if (!canvas) return;

    const container = document.getElementById('qr-code-container');
    container.innerHTML = `<div style="font-family:monospace;font-size:0.7rem;color:#ffe600;text-align:center;padding:20px;">UPLOADING...<br>PLEASE WAIT</div>`;

    try {
      // Convert canvas to blob
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, 'pixelbooth.png');

      // Upload to imgbb (free, no account needed for API)
      // Using freeimage.host as fallback
      const response = await fetch('https://api.imgbb.com/1/upload?key=2c5894a39cf238d98b59fe4e0a1e9aef', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data && data.data && data.data.url) {
        container.innerHTML = '';
        new QRCode(container, {
          text: data.data.url,
          width:  180,
          height: 180,
          colorDark:  '#0a0608',
          colorLight: '#ffe600',
          correctLevel: QRCode.CorrectLevel.M
        });
        // Show the link too
        container.insertAdjacentHTML('afterend', `
          <div style="margin-top:8px;">
            <a href="${data.data.url}" target="_blank"
               style="font-family:monospace;font-size:0.6rem;color:#00fff7;word-break:break-all;">
              ${data.data.url}
            </a>
          </div>`);
      } else {
        throw new Error('Upload failed');
      }

    } catch (e) {
      // Fallback: direct download link QR
      container.innerHTML = '';
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'pixelbooth.png';
      link.style.cssText = 'font-family:monospace;font-size:0.65rem;color:#ffe600;display:block;text-align:center;padding:12px;border:2px solid #ffe600;';
      link.textContent = '⬇ CLICK TO DOWNLOAD';
      container.appendChild(link);

      container.insertAdjacentHTML('afterbegin', `
        <div style="font-family:monospace;font-size:0.6rem;color:#ff6b00;text-align:center;padding:8px;margin-bottom:8px;">
          QR UPLOAD FAILED<br>USE LINK BELOW
        </div>`);
    }
  }

  return { downloadStrip, generateQR };
})();
