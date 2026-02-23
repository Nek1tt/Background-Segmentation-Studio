/**
 * camera.js
 * Инициализация веб-камеры и привязка к <video>/<canvas>.
 */

export async function initCamera(videoEl, canvasEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width:      { ideal: 1280 },
      height:     { ideal: 720 },
      facingMode: 'user',
    },
    audio: false,
  });

  videoEl.srcObject = stream;

  await new Promise((resolve, reject) => {
    videoEl.onloadedmetadata = resolve;
    videoEl.onerror = reject;
  });

  canvasEl.width  = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;

  console.info(`📷 Камера: ${videoEl.videoWidth}×${videoEl.videoHeight}`);
  return stream;
}

export function stopCamera(stream) {
  stream?.getTracks().forEach(t => t.stop());
}
