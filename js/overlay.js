/**
 * overlay.js
 * Управление оверлеем с данными сотрудника.
 */

export const PRIVACY_LEVELS = ['low', 'medium', 'high'];

export const DEFAULT_EMPLOYEE = {
  full_name:       'Иванов Сергей Петрович',
  position:        'Ведущий инженер по компьютерному зрению',
  company:         'ООО «Рога и Копыта»',
  department:      'Департамент компьютерного зрения',
  office_location: 'Новосибирск, технопарк «Идея»',
  contact: {
    email:    'sergey.ivanov@t1dp.ru',
    telegram: '@sergey_vision',
  },
  branding: {
    logo_url:         'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    corporate_colors: { primary: '#0052CC', secondary: '#FFFFFF' },
    slogan:           'Инновации в каждый кадр',
  },
  privacy_level: 'medium',
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Обновляет DOM-оверлей согласно текущему состоянию employeeData */
export function updateOverlay(employeeData) {
  const overlay = document.querySelector('.info-overlay');
  if (!overlay) return;

  const q = (sel) => overlay.querySelector(sel) ?? document.querySelector(sel);

  q('.overlay-name').textContent     = employeeData.full_name;
  q('.overlay-position').textContent = employeeData.position;
  q('.overlay-company').textContent  = employeeData.company;
  q('.overlay-department').textContent = employeeData.department;
  q('.overlay-location').textContent = employeeData.office_location;
  q('.overlay-slogan').textContent   = employeeData.branding.slogan;
  q('.overlay-email').textContent    = `📧 ${employeeData.contact.email}`;
  q('.overlay-telegram').textContent = `✈️ ${employeeData.contact.telegram}`;

  const logoEl  = q('.overlay-logo');
  logoEl.src    = employeeData.branding.logo_url;
  logoEl.style.display = employeeData.branding.logo_url ? 'block' : 'none';

  const { primary, secondary } = employeeData.branding.corporate_colors;
  overlay.style.backgroundColor = hexToRgba(primary, 0.85);
  overlay.style.color           = secondary;

  overlay.classList.remove('privacy-low', 'privacy-medium', 'privacy-high');
  overlay.classList.add(`privacy-${employeeData.privacy_level}`);

  const privacyLabel = document.getElementById('privacy-value');
  if (privacyLabel) {
    const lvl = employeeData.privacy_level;
    privacyLabel.textContent = lvl.charAt(0).toUpperCase() + lvl.slice(1);
  }
}

/**
 * Заполняет поля формы из объекта данных и вешает слушатели.
 * @param {object}   employeeData  - ссылка на реактивный объект
 * @param {Function} onChange      - callback после любого изменения
 */
export function initOverlayControls(employeeData, onChange) {
  const bind = (id, setter) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => { setter(e.target.value); onChange(); });
  };

  bind('emp-full_name',       v => { employeeData.full_name = v; });
  bind('emp-position',        v => { employeeData.position = v; });
  bind('emp-company',         v => { employeeData.company = v; });
  bind('emp-department',      v => { employeeData.department = v; });
  bind('emp-office_location', v => { employeeData.office_location = v; });
  bind('emp-email',           v => { employeeData.contact.email = v; });
  bind('emp-telegram',        v => { employeeData.contact.telegram = v; });
  bind('emp-logo_url',        v => { employeeData.branding.logo_url = v; });
  bind('emp-slogan',          v => { employeeData.branding.slogan = v; });
  bind('emp-primary_color',   v => { employeeData.branding.corporate_colors.primary = v; });
  bind('emp-secondary_color', v => { employeeData.branding.corporate_colors.secondary = v; });

  const privacySlider = document.getElementById('privacy-slider');
  if (privacySlider) {
    privacySlider.addEventListener('input', (e) => {
      employeeData.privacy_level = PRIVACY_LEVELS[parseInt(e.target.value, 10)];
      onChange();
    });
  }

  // Заполнить поля текущими значениями
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('emp-full_name',       employeeData.full_name);
  set('emp-position',        employeeData.position);
  set('emp-company',         employeeData.company);
  set('emp-department',      employeeData.department);
  set('emp-office_location', employeeData.office_location);
  set('emp-email',           employeeData.contact.email);
  set('emp-telegram',        employeeData.contact.telegram);
  set('emp-logo_url',        employeeData.branding.logo_url);
  set('emp-slogan',          employeeData.branding.slogan);
  set('emp-primary_color',   employeeData.branding.corporate_colors.primary);
  set('emp-secondary_color', employeeData.branding.corporate_colors.secondary);
  if (privacySlider) privacySlider.value = PRIVACY_LEVELS.indexOf(employeeData.privacy_level);
}
