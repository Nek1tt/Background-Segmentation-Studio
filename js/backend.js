/**
 * backend.js
 * Выбор оптимального backend для TensorFlow.js
 * Приоритет: WebGPU → WebGL → CPU
 */

export async function selectBackend() {
  const backends = [
    { name: 'webgpu', label: 'WebGPU (GPU)' },
    { name: 'webgl', label: 'WebGL (GPU fallback)' },
    { name: 'cpu',   label: 'CPU' },
  ];

  for (const { name, label } of backends) {
    try {
      const ok = await tf.setBackend(name);
      if (ok) {
        await tf.ready();
        console.info(`✅ Backend: ${label}`);
        return name;
      }
    } catch {
      // пробуем следующий
    }
  }

  throw new Error('Ни один backend TensorFlow.js не доступен');
}
