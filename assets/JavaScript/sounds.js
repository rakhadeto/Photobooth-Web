/**
 * sounds.js
 * Sound effects using Web Audio API — no external files needed!
 */

const Sounds = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function beep({ freq = 440, type = 'square', duration = 0.12, vol = 0.3, delay = 0 } = {}) {
    try {
      const ac  = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
      gain.gain.setValueAtTime(vol, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + duration + 0.01);
    } catch(e) {}
  }

  return {
    // Countdown beep (3, 2, 1)
    countdown(num) {
      if (num > 1) {
        beep({ freq: 660, type: 'square', duration: 0.1, vol: 0.25 });
      } else {
        // Final beep = higher pitch
        beep({ freq: 1320, type: 'square', duration: 0.08, vol: 0.3 });
        beep({ freq: 1760, type: 'square', duration: 0.08, vol: 0.2, delay: 0.1 });
      }
    },

    // Shutter click
    shutter() {
      beep({ freq: 2000, type: 'sine',   duration: 0.04, vol: 0.4 });
      beep({ freq: 800,  type: 'square', duration: 0.06, vol: 0.2, delay: 0.03 });
    },

    // UI click
    click() {
      beep({ freq: 880, type: 'square', duration: 0.06, vol: 0.15 });
    },

    // Level up / complete jingle
    complete() {
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => beep({ freq: f, type: 'square', duration: 0.12, vol: 0.2, delay: i * 0.1 }));
    },

    // Error
    error() {
      beep({ freq: 220, type: 'sawtooth', duration: 0.2, vol: 0.2 });
      beep({ freq: 180, type: 'sawtooth', duration: 0.2, vol: 0.2, delay: 0.2 });
    },

    // Download
    download() {
      beep({ freq: 784,  type: 'square', duration: 0.08, vol: 0.2 });
      beep({ freq: 1047, type: 'square', duration: 0.08, vol: 0.2, delay: 0.1 });
    },

    // Start game
    start() {
      const notes = [262, 330, 392, 523, 392, 523, 659];
      notes.forEach((f, i) => beep({ freq: f, type: 'square', duration: 0.1, vol: 0.18, delay: i * 0.08 }));
    }
  };
})();
