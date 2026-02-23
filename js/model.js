/**
 * model.js
 * Загрузка TFLite-модели сегментации фона.
 * Пробует делегаты в порядке: GPU → XNNPACK → CPU
 */

const MODEL_PATH = 'segmentation_model3.tflite';

export const MODEL_WIDTH  = 224;
export const MODEL_HEIGHT = 224;

let _model = null;

export async function loadModel() {
  if (_model) return _model;

  if (typeof tflite === 'undefined') {
    throw new Error('tflite.js не загружен. Добавьте скрипт tf-tflite.min.js на страницу.');
  }

  const candidates = [
    { options: { delegates: ['gpu'] },     label: 'GPU delegate' },
    { options: { delegates: ['xnnpack'] }, label: 'XNNPACK delegate' },
    { options: {},                          label: 'CPU (no delegate)' },
  ];

  for (const { options, label } of candidates) {
    try {
      console.info(`⏳ Загрузка модели (${label})...`);
      _model = await tflite.loadTFLiteModel(MODEL_PATH, options);
      console.info(`✅ Модель загружена: ${label}`);
      return _model;
    } catch (err) {
      console.warn(`⚠️  ${label} не доступен:`, err.message);
    }
  }

  throw new Error('Не удалось загрузить TFLite-модель ни с одним делегатом.');
}

/**
 * Запускает инференс.
 * @param {HTMLVideoElement} video
 * @returns {Float32Array|null}
 */
export async function runSegmentation(video) {
  if (!_model) return null;

  const input = tf.tidy(() => {
    return tf.browser
      .fromPixels(video)
      .toFloat()
      .resizeBilinear([MODEL_HEIGHT, MODEL_WIDTH])
      .div(255.0)
      .expandDims(0);
  });

  try {
    const output = _model.predict(input);
    const data   = await output.data();
    output.dispose();
    return data;
  } catch (err) {
    console.error('Ошибка инференса:', err);
    return null;
  } finally {
    input.dispose();
  }
}
