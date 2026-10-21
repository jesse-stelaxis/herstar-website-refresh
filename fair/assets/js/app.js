// Kiosk entry point: boot (offline copy) → showreel ⇄ explore, with an idle
// timer that always brings the booth back to the showreel and a clean form.

import { registerWorker, prepareOffline } from './offline.js';
import { createReel } from './showreel.js';
import { initSite, resetSite, prepareFilm } from './site.js';
import { initLeads, openLead, closeLead } from './leads.js';
import { initStaff, syncLeads } from './staff.js';
import { initRising, setRising, toggleRising } from './rising.js';
import { settings } from './settings.js';

const body = document.body;
const $ = (id) => document.getElementById(id);

const reel = createReel({ stage: $('reel-stage'), chapterEl: $('reel-chapter'), liftEl: $('reel-lift') });

function setMode(mode) {
  body.dataset.mode = mode;
  if (mode === 'reel') {
    window.scrollTo(0, 0);
    reel.start({ slidePace: +settings().slidePace || 1 });
  } else {
    reel.stop();
  }
  if (mode === 'explore') prepareFilm();
  touch();
}

// --- idle: anyone walking away leaves the booth ready for the next visitor ------
const IDLE_WARNING = 10;
let lastTouch = Date.now();
let warning = 0;

function touch() {
  lastTouch = Date.now();
  if (warning) {
    clearInterval(warning);
    warning = 0;
    if ($('idle').open) $('idle').close();
  }
}

function returnToShowcase() {
  touch();
  closeLead();
  resetSite();
  document.querySelectorAll('dialog[open]').forEach((d) => d.close());
  setRising(settings().skin === 'rising');
  setMode('reel');
}

function checkIdle() {
  if (warning || body.dataset.mode === 'boot') return;
  const somethingOpen = body.dataset.mode === 'explore' || document.querySelector('dialog[open]:not(#idle)');
  if (!somethingOpen) return;
  if (Date.now() - lastTouch < settings().idleSeconds * 1000) return;
  const shownAt = Date.now();
  $('idle-count').textContent = IDLE_WARNING;
  $('idle').showModal();
  // counted from the clock, not from ticks, so a throttled timer cannot stretch it
  warning = setInterval(() => {
    const left = IDLE_WARNING - Math.floor((Date.now() - shownAt) / 1000);
    $('idle-count').textContent = Math.max(left, 0);
    if (left <= 0) returnToShowcase();
  }, 250);
}

// --- actions -------------------------------------------------------------------
document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]');
  if (action) {
    const what = action.dataset.action;
    if (what === 'explore') setMode('explore');
    if (what === 'reel') setMode('reel');
    if (what === 'toggle-rising') toggleRising();
    if (what === 'lead') {
      document.querySelectorAll('dialog.sheet[open]').forEach((d) => d.close());
      openLead({ interest: action.dataset.interest });
    }
    return;
  }
  // any other tap on the showreel opens the site
  if (body.dataset.mode === 'reel' && event.target.closest('#reel') && !$('staff').open) setMode('explore');
});
$('idle-stay').addEventListener('click', touch);
$('idle').addEventListener('cancel', (event) => { event.preventDefault(); touch(); });
['pointerdown', 'keydown', 'input', 'wheel'].forEach((type) => document.addEventListener(type, touch, { passive: true }));
document.addEventListener('scroll', touch, { passive: true });

// --- kiosk hygiene ----------------------------------------------------------------
let wakeLock = null;
async function keepAwake() {
  if (!('wakeLock' in navigator) || document.hidden || wakeLock) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch { /* not granted yet — retried on the next tap */ }
}
document.addEventListener('visibilitychange', keepAwake);
document.addEventListener('pointerdown', keepAwake, { passive: true });
// pinch-zoom on iPad would strand the next visitor in a zoomed page
document.addEventListener('gesturestart', (event) => event.preventDefault());
// on Android tablets, the first touch takes the page full screen (iPad uses Home Screen mode instead)
document.addEventListener('pointerdown', () => {
  const standalone = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  if (!standalone && matchMedia('(pointer: coarse)').matches && document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
}, { once: true, passive: true });

// --- boot ----------------------------------------------------------------------------
async function boot() {
  initSite();
  initLeads({ saved: () => syncLeads() });
  initStaff();
  initRising({ changed: () => reel.refresh() });
  setRising(settings().skin === 'rising', { animate: false });
  setInterval(checkIdle, 1000);
  keepAwake();

  const bar = $('boot-bar');
  const count = $('boot-count');
  const skip = $('boot-skip');
  let started = false;
  const start = () => { if (!started) { started = true; setMode('reel'); } };
  skip.addEventListener('click', start);
  const skipLater = setTimeout(() => { skip.hidden = false; }, 12000);

  await registerWorker();
  const result = await prepareOffline(({ done, total, bytes, totalBytes }) => {
    bar.style.width = `${Math.round((bytes / Math.max(totalBytes, 1)) * 100)}%`;
    const mb = `${(bytes / 1e6).toFixed(0)} / ${(totalBytes / 1e6).toFixed(0)} MB`;
    count.innerHTML = `${done} of ${total} files · ${mb}<span class="zh">已保存 ${done} / ${total} 个文件 · ${mb}</span>`;
  });
  clearTimeout(skipLater);

  if (result.unsupported) {
    count.innerHTML = 'This browser cannot keep an offline copy here — open the page over https.<span class="zh">此浏览器无法在此保存离线副本，请通过 https 打开。</span>';
    skip.hidden = false;
    setTimeout(start, 4000);
    return;
  }
  if (!result.ok) {
    count.innerHTML = result.missing === Infinity
      ? 'No connection, and nothing saved on this tablet yet. Connect to Wi-Fi once to prepare the showcase.<span class="zh">无网络连接，本平板尚未保存内容。请先连接一次 Wi-Fi 以完成准备。</span>'
      : `${result.missing} files could not be saved. They will be retried the next time the page opens online.<span class="zh">${result.missing} 个文件未能保存，下次联网打开时将自动重试。</span>`;
    skip.hidden = false;
    return;
  }
  // a newer version just replaced the old copy: load it once, so the code on screen matches
  if (result.updated && sessionStorage.getItem('fair-reloaded') !== result.version) {
    sessionStorage.setItem('fair-reloaded', result.version);
    location.reload();
    return;
  }
  count.innerHTML = 'Everything is saved on this tablet.<span class="zh">所有内容已保存在本平板。</span>';
  bar.style.width = '100%';
  setTimeout(start, 600);
}

boot();

if (new URLSearchParams(location.search).has('debug')) window.fair = { reel, setMode, setRising };
