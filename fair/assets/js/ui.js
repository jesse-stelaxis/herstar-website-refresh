// Small HTML helpers shared by the showreel and the site. Every visible line
// is rendered as English followed by its Chinese, in one consistent pattern.

import { en, zh } from './content.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// "English<span class=zh>中文</span>" — the CSS decides inline or stacked
export const bi = (pair) => {
  const e = en(pair);
  const z = zh(pair);
  return z && z !== e ? `${esc(e)}<span class="zh">${esc(z)}</span>` : esc(e);
};

export const specItems = (specs, limit = Infinity) => specs.slice(0, limit).map(([le, lz, ve, vz]) =>
  `<li><b>${esc(le)}<span class="zh">${esc(lz)}</span></b><span>${esc(ve)}</span>${vz && vz !== ve ? `<span class="zh">${esc(vz)}</span>` : ''}</li>`).join('');

export const partnerTile = (p, i = 0) =>
  `<div class="logo-tile" style="--i:${i}"><img src="${p.src}" alt="${esc(p.label)}" loading="lazy" decoding="async">${p.text ? `<span class="logo-text">${esc(p.text)}</span>` : ''}</div>`;

export const certIsCurrent = (cert, today = new Date()) =>
  !cert.validUntil || new Date(`${cert.validUntil}T23:59:59`) >= today;
