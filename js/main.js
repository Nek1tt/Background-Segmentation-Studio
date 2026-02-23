/**
 * main.js
 * Точка входа приложения.
 * Координирует backend, модель, камеру, рендер и UI.
 */

import { selectBackend }                    from './backend.js';
import { loadModel, runSegmentation }       from './model.js';
import { initCamera }                       from './camera.js';
import { renderFrame }                      from './renderer.js';
import { DEFAULT_EMPLOYEE, updateOverlay, initOverlayControls } from './overlay.js';
import { initBgControls }                   from './bgControls.js';
import { createFpsCounter }                 from './fps.js';

// --- Состояние фона ---
const bgState = {
  bgType:     'color',
  bgColor:    '#667eea',
  blurAmount: 10,
  bgImage:    null,
};

// --- Данные сотрудника (мутируемый объект) ---
const employeeData = structuredClone(DEFAULT_EMPLOYEE);

// --- DOM-узлы ---
const video  = document.querySelector('.camera-feed');
const canvas = document.querySelector('.output-canvas');
const ctx    = canvas.getContext('2d');
const fpsTick = createFpsCounter(document.querySelector('.fps-value'));

async function loop() {
  fpsTick();

  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    const maskData = await runSegmentation(video);
    renderFrame({ ctx, video, maskData, ...bgState });
  }

  requestAnimationFrame(loop);
}

async function init() {
  // Статусная строка
  const status = document.getElementById('status-message');
  const setStatus = (msg) => { if (status) status.textContent = msg; };

  try {
    setStatus('⏳ Выбор backend (WebGPU / WebGL / CPU)…');
    const backend = await selectBackend();
    setStatus(`⏳ Backend: ${backend}. Загрузка модели…`);

    await loadModel();
    setStatus('⏳ Запрос доступа к камере…');

    await initCamera(video, canvas);

    // Инициализация UI
    initBgControls(bgState);
    initOverlayControls(employeeData, () => updateOverlay(employeeData));
    updateOverlay(employeeData);

    setStatus('');
    requestAnimationFrame(loop);
  } catch (err) {
    console.error(err);
    setStatus(`❌ Ошибка: ${err.message}`);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
