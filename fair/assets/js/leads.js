// The "leave your contact" form, written for an international trade-fair crowd:
// ten interface languages (Arabic right-to-left), country names in the
// visitor's language via Intl.DisplayNames, E.164 calling codes, one full-name
// field rather than first/last, a business-card photo instead of typing, and
// at least one way to reach them — email or phone. Everything is saved on the
// tablet first (db.js); nothing depends on the venue network.

import { LANGUAGES, STRINGS } from './form-i18n.js';
import { putLead } from './db.js';
import { settings } from './settings.js';

// ISO 3166-1 alpha-2 → ITU-T E.164 country calling code
const CALLING = 'AD376 AE971 AF93 AG1 AI1 AL355 AM374 AO244 AR54 AS1 AT43 AU61 AW297 AX358 AZ994 BA387 BB1 BD880 BE32 BF226 BG359 BH973 BI257 BJ229 BL590 BM1 BN673 BO591 BQ599 BR55 BS1 BT975 BW267 BY375 BZ501 CA1 CD243 CF236 CG242 CH41 CI225 CK682 CL56 CM237 CN86 CO57 CR506 CU53 CV238 CW599 CY357 CZ420 DE49 DJ253 DK45 DM1 DO1 DZ213 EC593 EE372 EG20 EH212 ER291 ES34 ET251 FI358 FJ679 FK500 FM691 FO298 FR33 GA241 GB44 GD1 GE995 GF594 GG44 GH233 GI350 GL299 GM220 GN224 GP590 GQ240 GR30 GT502 GU1 GW245 GY592 HK852 HN504 HR385 HT509 HU36 ID62 IE353 IL972 IM44 IN91 IO246 IQ964 IR98 IS354 IT39 JE44 JM1 JO962 JP81 KE254 KG996 KH855 KI686 KM269 KN1 KP850 KR82 KW965 KY1 KZ7 LA856 LB961 LC1 LI423 LK94 LR231 LS266 LT370 LU352 LV371 LY218 MA212 MC377 MD373 ME382 MF590 MG261 MH692 MK389 ML223 MM95 MN976 MO853 MP1 MQ596 MR222 MS1 MT356 MU230 MV960 MW265 MX52 MY60 MZ258 NA264 NC687 NE227 NF672 NG234 NI505 NL31 NO47 NP977 NR674 NU683 NZ64 OM968 PA507 PE51 PF689 PG675 PH63 PK92 PL48 PM508 PR1 PS970 PT351 PW680 PY595 QA974 RE262 RO40 RS381 RU7 RW250 SA966 SB677 SC248 SD249 SE46 SG65 SH290 SI386 SK421 SL232 SM378 SN221 SO252 SR597 SS211 ST239 SV503 SX1 SY963 SZ268 TC1 TD235 TG228 TH66 TJ992 TK690 TL670 TM993 TN216 TO676 TR90 TT1 TV688 TW886 TZ255 UA380 UG256 US1 UY598 UZ998 VA39 VC1 VE58 VG1 VI1 VN84 VU678 WF681 WS685 XK383 YE967 YT262 ZA27 ZM260 ZW263'
  .split(' ').map((s) => [s.slice(0, 2), s.slice(2)]);
const DIAL = Object.fromEntries(CALLING);

const GROUPS = {
  business: ['biz_distributor', 'biz_importer', 'biz_retail', 'biz_brand', 'biz_care', 'biz_project', 'biz_other'],
  interests: ['int_beds', 'int_mobility', 'int_bath', 'int_home', 'int_desks', 'int_robot', 'int_imaging', 'int_parts'],
  next: ['next_quote', 'next_catalogue', 'next_samples', 'next_visit', 'next_agency', 'next_call'],
};
const VOLUMES = ['vol_unsure', 'vol_trial', 'vol_small', 'vol_mid', 'vol_large'];
const CATEGORY_INTEREST = { beds: 'int_beds', mobility: 'int_mobility', bath: 'int_bath', home: 'int_home', desks: 'int_desks', rehab: 'int_mobility' };

const dialog = document.getElementById('lead');
const form = document.getElementById('lead-form');
const thanks = document.getElementById('lead-thanks');
const errorBox = document.getElementById('lead-error');
const f = form.elements;

let lang = 'en';
let dialTouched = false;
let cardPhoto = '';
let closeTimer = 0;
let onSaved = () => {};

const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;

// Hong Kong, Macao and Taiwan are listed as regions of China, as is usual for a
// mainland exhibitor; everything else uses the platform's own localised name.
function countryName(code, names, china) {
  if (code === 'TW') return lang === 'zh' ? '中国台湾' : `${names.of('TW')}, ${china}`;
  if (code === 'HK' && lang === 'zh') return '中国香港';
  if (code === 'MO' && lang === 'zh') return '中国澳门';
  return names.of(code);
}

function fillCountries() {
  let names;
  try { names = new Intl.DisplayNames([lang, 'en'], { type: 'region' }); } catch { names = { of: (c) => c }; }
  const china = names.of('CN');
  const collator = new Intl.Collator(lang);
  const rows = CALLING.map(([code, dial]) => ({ code, dial, name: countryName(code, names, china) }))
    .sort((a, b) => collator.compare(a.name, b.name));
  const keepCountry = f.country.value;
  const keepDial = f.dial.value;
  f.country.innerHTML = `<option value="">${t('country_ph')}</option>` + rows.map((r) => `<option value="${r.code}">${r.name}</option>`).join('');
  f.dial.innerHTML = `<option value="">+ …</option>` + rows.map((r) => `<option value="${r.code}">+${r.dial} · ${r.name}</option>`).join('');
  f.country.value = keepCountry;
  f.dial.value = keepDial;
}

function fillChoices() {
  form.querySelectorAll('[data-group]').forEach((box) => {
    const group = box.dataset.group;
    const kind = box.dataset.kind;
    const checked = new Set([...box.querySelectorAll('input:checked')].map((i) => i.value));
    box.innerHTML = GROUPS[group].map((key) =>
      `<label class="chip"><input type="${kind}" name="${group}" value="${key}"${checked.has(key) ? ' checked' : ''}>${t(key)}</label>`).join('');
  });
  const volume = f.volume.value;
  f.volume.innerHTML = `<option value="">—</option>` + VOLUMES.map((k) => `<option value="${k}">${t(k)}</option>`).join('');
  f.volume.value = volume;
  const reply = f.reply_lang.value || lang;
  f.reply_lang.innerHTML = LANGUAGES.map((l) => `<option value="${l.code}">${l.name}</option>`).join('');
  f.reply_lang.value = reply;
}

function setLanguage(code) {
  const previous = lang;
  lang = code;
  const meta = LANGUAGES.find((l) => l.code === code);
  dialog.lang = code === 'zh' ? 'zh-Hans' : code;
  dialog.dir = meta.dir;
  dialog.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t(n.dataset.t); });
  // in English the heading also carries its Chinese, like every other page heading
  if (code === 'en') {
    document.getElementById('lead-title').insertAdjacentHTML('beforeend', ` <span class="zh">${STRINGS.zh.title}</span>`);
    dialog.querySelector('.lead-lede').insertAdjacentHTML('beforeend', `<span class="zh">${STRINGS.zh.lede}</span>`);
  }
  dialog.querySelectorAll('[data-t-label]').forEach((n) => n.setAttribute('aria-label', t(n.dataset.tLabel)));
  dialog.querySelectorAll('[data-t-placeholder]').forEach((n) => { n.placeholder = t(n.dataset.tPlaceholder); });
  document.querySelectorAll('#lead-langs [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === code)));
  // follow the interface language for the reply, unless the visitor already chose one
  if (!f.reply_lang.value || f.reply_lang.value === previous) f.reply_lang.value = code;
  fillCountries();
  fillChoices();
  if (!errorBox.hidden) validate();
}

// --- validation -------------------------------------------------------------
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mark(input, message) {
  const field = input.closest('.field') || input.closest('.consent');
  let msg = field.querySelector('.field-msg');
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    if (!msg && field.classList.contains('field')) {
      msg = Object.assign(document.createElement('small'), { className: 'field-msg' });
      field.append(msg);
    }
    if (msg) msg.textContent = message;
    field.classList.toggle('is-invalid', field.classList.contains('consent'));
  } else {
    input.removeAttribute('aria-invalid');
    msg?.remove();
    field.classList.remove('is-invalid');
  }
  return !message;
}

function validate() {
  const results = [
    mark(f.name, f.name.value.trim() ? '' : t('err_required')),
    mark(f.company, f.company.value.trim() ? '' : t('err_required')),
    mark(f.country, f.country.value ? '' : t('err_required')),
  ];
  const email = f.email.value.trim();
  const phone = f.phone.value.replace(/[^\d]/g, '');
  const reachable = email || phone.length >= 5;
  results.push(mark(f.email, email && !EMAIL.test(email) ? t('err_email') : reachable ? '' : t('contact_rule')));
  results.push(mark(f.phone, reachable ? '' : t('contact_rule')));
  results.push(mark(f.consent, f.consent.checked ? '' : t('err_consent')));
  const ok = results.every(Boolean);
  errorBox.hidden = ok;
  errorBox.textContent = ok ? '' : t('err_fix');
  return ok;
}

// --- business card photo ------------------------------------------------------
async function shrinkPhoto(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  const source = bitmap || await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
  const canvas = Object.assign(document.createElement('canvas'), { width: Math.round(source.width * scale), height: Math.round(source.height * scale) });
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

function showCard(dataUrl) {
  cardPhoto = dataUrl;
  const preview = form.querySelector('.card-preview');
  if (dataUrl) preview.src = dataUrl;
  else preview.removeAttribute('src');
  preview.hidden = !dataUrl;
  form.querySelector('.card-remove').hidden = !dataUrl;
  form.querySelector('.card-take [data-t]').dataset.t = dataUrl ? 'card_retake' : 'card_take';
  form.querySelector('.card-take [data-t]').textContent = t(dataUrl ? 'card_retake' : 'card_take');
}

// --- save ---------------------------------------------------------------------
const uuid = () => crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function collect() {
  const values = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
  const english = new Intl.DisplayNames(['en'], { type: 'region' });
  const digits = f.phone.value.replace(/[^\d]/g, '').replace(/^0+/, '');
  const dial = DIAL[f.dial.value] ?? '';
  return {
    id: uuid(),
    createdAt: new Date().toISOString(),
    booth: settings().booth,
    skin: document.body.classList.contains('rising') ? 'rising' : 'daylight',
    formLanguage: lang,
    name: f.name.value.trim(),
    company: f.company.value.trim(),
    title: f.title.value.trim(),
    country: f.country.value,
    countryName: f.country.value === 'TW' ? 'Taiwan, China' : english.of(f.country.value),
    email: f.email.value.trim(),
    phone: f.phone.value.trim(),
    phoneE164: digits ? `+${dial}${digits}` : '',
    dialCountry: f.dial.value,
    messenger: f.messenger.value,
    messengerId: f.messenger_id.value.trim(),
    business: values('business'),
    interests: values('interests'),
    next: values('next'),
    volume: f.volume.value,
    replyLanguage: f.reply_lang.value,
    message: f.message.value.trim(),
    cardPhoto,
    consent: true,
    consentText: t('consent'),
    synced: false,
  };
}

function reset() {
  form.reset();
  errorBox.hidden = true;
  form.querySelectorAll('[aria-invalid]').forEach((n) => mark(n, ''));
  dialTouched = false;
  showCard('');
  form.hidden = false;
  thanks.hidden = true;
  setLanguage('en');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validate()) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = t('saving');
  const lead = collect();
  try {
    await putLead(lead);
  } catch (error) {
    // never lose a lead silently: keep a copy where the staff panel can still find it
    console.error('[fair] IndexedDB save failed', error);
    try {
      const backup = JSON.parse(localStorage.getItem('hosun-fair-unsaved') || '[]');
      backup.push({ ...lead, cardPhoto: '' });
      localStorage.setItem('hosun-fair-unsaved', JSON.stringify(backup));
    } catch { /* nothing more we can do on this device */ }
  }
  button.disabled = false;
  button.textContent = t('submit');
  document.getElementById('thanks-title').textContent = t('thanks_title').replace('{name}', lead.name.split(/\s+/)[0]);
  document.getElementById('thanks-body').textContent = t('thanks_body');
  document.getElementById('thanks-done').textContent = t('thanks_done');
  form.hidden = true;
  thanks.hidden = false;
  closeTimer = setTimeout(() => dialog.open && dialog.close(), 15000);
  onSaved(lead);
});

export function openLead({ interest } = {}) {
  reset();
  const key = CATEGORY_INTEREST[interest];
  if (key) form.querySelector(`input[name="interests"][value="${key}"]`).checked = true;
  dialog.showModal();
  form.scrollTop = 0;
}

export function closeLead() {
  if (dialog.open) dialog.close();
  reset(); // now, not on the queued close event — nothing typed may outlive the visitor
}

export function initLeads({ saved } = {}) {
  onSaved = saved ?? onSaved;
  document.getElementById('lead-langs').innerHTML = LANGUAGES.map((l) =>
    `<button class="chip" type="button" data-lang="${l.code}" lang="${l.code}" aria-pressed="false">${l.name}</button>`).join('');
  document.getElementById('lead-langs').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-lang]');
    if (chip) setLanguage(chip.dataset.lang);
  });
  f.country.addEventListener('change', () => { if (!dialTouched) f.dial.value = f.country.value; });
  f.dial.addEventListener('change', () => { dialTouched = true; });
  form.addEventListener('input', () => { if (!errorBox.hidden) validate(); });
  f.card.addEventListener('change', async () => {
    const file = f.card.files[0];
    if (file) showCard(await shrinkPhoto(file).catch(() => ''));
    f.card.value = '';
  });
  form.querySelector('.card-remove').addEventListener('click', () => showCard(''));
  dialog.addEventListener('close', () => { clearTimeout(closeTimer); reset(); });
  dialog.addEventListener('click', (event) => { if (event.target.closest('[data-close]')) dialog.close(); });
  reset();
}
