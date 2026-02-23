/**
 * renderer.js
 * Создание маски сегментации и рендеринг кадра на canvas.
 */

import { MODEL_WIDTH, MODEL_HEIGHT } from './model.js';

/** Вспомогательный одноразовый canvas для маски */
const maskCanvas  = document.createElement('canvas');
maskCanvas.width  = MODEL_WIDTH;
maskCanvas.height = MODEL_HEIGHT;
const maskCtx     = maskCanvas.getContext('2d');

const tempCanvas = document.createElement('canvas');
const tempCtx    = tempCanvas.getContext('2d');

/**
 * @param {Float32Array} outputData  Выходные данные модели (вероятность fg).
 * @returns {HTMLCanvasElement}
 */
function buildMask(outputData) {
  const imgData = maskCtx.createImageData(MODEL_WIDTH, MODEL_HEIGHT);
  const px = imgData.data;

  for (let i = 0; i < MODEL_WIDTH * MODEL_HEIGHT; i++) {
    const alpha  = outputData[i] > 0.5 ? 255 : 0;
    px[i * 4]     = 255;
    px[i * 4 + 1] = 255;
    px[i * 4 + 2] = 255;
    px[i * 4 + 3] = alpha;
  }

  maskCtx.putImageData(imgData, 0, 0);
  return maskCanvas;
}

/**
 * Рендерит один кадр.
 *
 * @param {{
 *   ctx:         CanvasRenderingContext2D,
 *   video:       HTMLVideoElement,
 *   maskData:    Float32Array|null,
 *   bgType:      string,
 *   bgColor:     string,
 *   blurAmount:  number,
 *   bgImage:     HTMLImageElement|null,
 * }} opts
 */
export function renderFrame({ ctx, video, maskData, bgType, bgColor, blurAmount, bgImage }) {
  const { width, height } = ctx.canvas;

  // Синхронизируем размер временного canvas
  if (tempCanvas.width !== width || tempCanvas.height !== height) {
    tempCanvas.width  = width;
    tempCanvas.height = height;
  }

  ctx.clearRect(0, 0, width, height);

  // --- Фон ---
  drawBackground({ ctx, video, bgType, bgColor, blurAmount, bgImage, width, height });

  // --- Передний план (человек) ---
  if (maskData) {
    const mask = buildMask(maskData);

    tempCtx.clearRect(0, 0, width, height);
    tempCtx.drawImage(video, 0, 0, width, height);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(mask, 0, 0, width, height);
    tempCtx.globalCompositeOperation = 'source-over';

    ctx.drawImage(tempCanvas, 0, 0);
  } else {
    // Нет маски — показываем исходное видео
    ctx.drawImage(video, 0, 0, width, height);
  }
}

function drawBackground({ ctx, video, bgType, bgColor, blurAmount, bgImage, width, height }) {
  switch (bgType) {
    case 'blur':
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(video, 0, 0, width, height);
      ctx.filter = 'none';
      break;

    case 'image':
    case 'custom':
      if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, width, height);
        break;
      }
      // fallthrough → color

    default: // 'color'
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
  }
}
