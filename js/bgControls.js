/**
 * bgControls.js
 * Управление настройками фона (тип, цвет, blur, изображение).
 */

const PRESET_URLS = {
  office:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
  library: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=800&fit=crop',
  home:    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop',
};

/**
 * @param {object} state  - реактивное состояние: { bgType, bgColor, blurAmount, bgImage }
 */
export function initBgControls(state) {
  // --- Переключение типа фона ---
  document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.bgType = btn.dataset.type;

      document.querySelectorAll('.bg-control-section').forEach(s => s.classList.add('hidden'));
      document.getElementById(`${state.bgType}-section`)?.classList.remove('hidden');
    });
  });

  // --- Выбор цвета ---
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.bgColor = opt.dataset.color;
    });
  });

  // --- Blur-ползунок ---
  const blurSlider = document.getElementById('blur-slider');
  const blurValue  = document.getElementById('blur-value');
  blurSlider?.addEventListener('input', (e) => {
    state.blurAmount = parseInt(e.target.value, 10);
    if (blurValue) blurValue.textContent = state.blurAmount;
  });

  // --- Пресеты изображений ---
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const img  = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { state.bgImage = img; };
      img.onerror = () => console.warn('Не удалось загрузить пресет:', btn.dataset.image);
      img.src = PRESET_URLS[btn.dataset.image];
    });
  });

  // --- Загрузка пользовательского изображения ---
  document.getElementById('custom-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img  = new Image();
      img.onload = () => { state.bgImage = img; };
      img.src    = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}
