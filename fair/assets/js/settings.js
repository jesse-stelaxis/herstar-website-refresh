// Booth settings, changed from the staff panel and kept on this tablet.
// localStorage is fine here: losing them only means falling back to defaults.

const KEY = 'hosun-fair-settings';

export const DEFAULTS = {
  booth: 'Canton Fair 2026',      // stamped on every lead, so two tablets can be told apart
  pin: '2002',                    // staff panel PIN — change it on the first day
  idleSeconds: 90,                // explore mode returns to the showreel after this long untouched
  slidePace: 1,                   // multiplies every scene's duration
  skin: 'daylight',               // what the booth falls back to after idle: 'daylight' | 'rising'
  pumpkins: true,                 // the occasional wandering pumpkin
  pumpkinMin: 35,                 // seconds between pumpkin visits, lower bound
  pumpkinMax: 80,                 // … and upper bound
  syncUrl: '',                    // optional: leads are POSTed here as JSON when online
};

let cache;

export function settings() {
  if (!cache) {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* private mode or corrupt — use defaults */ }
    cache = { ...DEFAULTS, ...saved };
  }
  return cache;
}

export function saveSettings(patch) {
  cache = { ...settings(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage unavailable; the change lasts for this session */ }
  window.dispatchEvent(new CustomEvent('settings', { detail: cache }));
  return cache;
}
