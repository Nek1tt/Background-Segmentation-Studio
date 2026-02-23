/**
 * fps.js
 * Простой счётчик FPS с обновлением DOM-элемента.
 */

export function createFpsCounter(displayEl) {
  let frameCount = 0;
  let lastTime   = performance.now();

  return function tick() {
    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frameCount / delta) * 1000);
      if (displayEl) displayEl.textContent = fps;
      frameCount = 0;
      lastTime   = now;
    }
  };
}
