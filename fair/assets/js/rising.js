// The way into the hidden Halloween skin: a small pumpkin that turns up now
// and then somewhere along the edge of the screen, plus the pumpkin buttons
// (reel bar, site header, footer). Tapping either cuts the lights and
// switches the neon "The Rising" sign on.

import { settings } from './settings.js';

const body = document.body;
const pumpkin = document.getElementById('wild-pumpkin');
const curtain = document.getElementById('curtain');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const PEEK_SECONDS = 9;

let visitTimer = 0;
let leaveTimer = 0;
let onChange = () => {};

export const isRising = () => body.classList.contains('rising');

function apply(on) {
  body.classList.toggle('rising', on);
  document.querySelector('meta[name="theme-color"]').content = on ? '#0b0710' : '#f3c9a1';
  document.querySelectorAll('[data-action="toggle-rising"][aria-label]').forEach((b) => {
    b.setAttribute('aria-label', on ? 'Back to daylight' : 'Halloween mode');
  });
  onChange(on);
}

export function setRising(on, { animate = true } = {}) {
  if (on === isRising()) return;
  hidePumpkin();
  if (!animate || reduced.matches) { apply(on); return; }
  curtain.classList.remove('is-leaving', 'is-dawn');
  curtain.classList.toggle('is-dawn', !on);
  curtain.querySelector('.curtain-sign').textContent = on ? 'The Rising' : 'Good morning';
  curtain.classList.add('is-on');
  setTimeout(() => apply(on), on ? 900 : 300);
  setTimeout(() => curtain.classList.add('is-leaving'), on ? 1500 : 700);
  setTimeout(() => curtain.classList.remove('is-on', 'is-leaving', 'is-dawn'), on ? 2050 : 1250);
}

export const toggleRising = () => setRising(!isRising());

// --- the wandering pumpkin ------------------------------------------------------
function hidePumpkin() {
  clearTimeout(leaveTimer);
  pumpkin.classList.remove('is-peeking');
  setTimeout(() => { if (!pumpkin.classList.contains('is-peeking')) pumpkin.hidden = true; }, 900);
}

// somewhere along an edge, clear of the button bar and the logos
function placePumpkin() {
  const w = innerWidth;
  const h = innerHeight;
  const spots = [
    () => ({ left: w * (0.3 + Math.random() * 0.4), top: h - 150 }),          // above the button bar
    () => ({ left: w - 70, top: h * (0.25 + Math.random() * 0.15) }),         // right edge, above the column gauge
    () => ({ left: 18, top: h * (0.3 + Math.random() * 0.3) }),               // left edge
    () => ({ left: w * (0.45 + Math.random() * 0.25), top: 90 }),             // under the top bar
  ];
  const { left, top } = spots[Math.floor(Math.random() * spots.length)]();
  pumpkin.style.left = `${Math.round(left)}px`;
  pumpkin.style.top = `${Math.round(top)}px`;
}

function visit() {
  scheduleVisit();
  const busy = document.querySelector('dialog[open]');
  if (isRising() || busy || !settings().pumpkins || document.hidden) return;
  placePumpkin();
  pumpkin.hidden = false;
  setTimeout(() => pumpkin.classList.add('is-peeking'), 40); // after the unhide has painted, so it slides in
  leaveTimer = setTimeout(hidePumpkin, PEEK_SECONDS * 1000);
}

function scheduleVisit() {
  clearTimeout(visitTimer);
  const { pumpkinMin, pumpkinMax } = settings();
  const wait = pumpkinMin + Math.random() * Math.max(0, pumpkinMax - pumpkinMin);
  visitTimer = setTimeout(visit, wait * 1000);
}

export function initRising({ changed } = {}) {
  onChange = changed ?? onChange;
  pumpkin.addEventListener('click', (event) => {
    event.stopPropagation();
    setRising(true);
  });
  scheduleVisit();
  window.addEventListener('settings', scheduleVisit);
}
