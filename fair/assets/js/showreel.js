// The attract loop: themed photo runs, product spotlights and intercut
// slogans, each scene rising into place over the last. Scenes are built
// from REEL in content.js; this file only knows how to draw each type.

import {
  REEL, PRODUCTS, STATS, CERTIFICATES, OTHER_SYSTEMS, PARTNERS, PARTNER_LABELS, MILESTONES, FILM, RISING_LINES, COMPANY, img,
} from './content.js';
import { localUrl } from './offline.js';

const TITLE_SECONDS = 4;
const rising = () => document.body.classList.contains('rising');
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const certIsCurrent = (cert, today = new Date()) =>
  !cert.validUntil || new Date(`${cert.validUntil}T23:59:59`) >= today;

const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// a chapter becomes its title card followed by one scene per photo
function playlist() {
  return REEL.flatMap((scene) => scene.type !== 'chapter' ? [scene] : [
    { type: 'title', seconds: TITLE_SECONDS, chapter: scene },
    ...scene.photos.map(([photo, caption]) => ({ type: 'photo', seconds: scene.seconds, photo, caption, chapter: scene })),
  ]);
}

const pick = (scene, key) => (rising() && scene.rising?.[key]) || scene[key];

const ROBOT_ICON = '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="34" y="14" width="52" height="40" rx="12"/><circle cx="50" cy="34" r="5"/><circle cx="70" cy="34" r="5"/><path d="M60 54v12M30 66h60v22H30zM38 88v14M82 88v14M24 102h72M18 76h12M90 76h12"/></svg>';

const BUILD = {
  cover() {
    const node = el('div', 'scene scene-cover');
    node.append(el('div', 'cover-ghost', 'HOSUN'), el('div', 'cover-mark'));
    const copy = el('div', 'cover-copy');
    if (rising()) {
      copy.innerHTML = `
        <p class="cover-kicker">${esc(RISING_LINES.coverKicker)}</p>
        <p class="cover-sign neon-ember">${esc(RISING_LINES.cover)}</p>
        <p class="cover-names">${esc(RISING_LINES.coverSub)}</p>
        <ul class="cover-lines">${COMPANY.taglines.map(([en, zh]) => `<li>${esc(en)}<span class="zh">${zh}</span></li>`).join('')}</ul>`;
    } else {
      copy.innerHTML = `
        <h1 class="cover-title"><span class="cover-word">HOSUN</span><span class="cover-zh">恒升集团</span></h1>
        <p class="cover-names">${COMPANY.names.map(esc).join('<br>')}</p>
        <ul class="cover-lines">${COMPANY.taglines.map(([en, zh]) => `<li><span class="zh">${zh}</span>${esc(en)}</li>`).join('')}</ul>`;
    }
    node.append(copy);
    const herstar = el('img', 'cover-herstar logo-herstar');
    herstar.src = 'assets/logos/herstar.svg';
    herstar.alt = '';
    node.append(herstar);
    return node;
  },

  slogan(scene) {
    const node = el('div', 'scene scene-slogan');
    if (scene.bg) node.append(Object.assign(el('img', 'scene-bg'), { src: img(scene.bg), alt: '' }));
    node.append(el('div', 'slogan', `<p class="slogan-en">${esc(pick(scene, 'en'))}</p><p class="slogan-zh">${esc(pick(scene, 'zh'))}</p>`));
    return node;
  },

  title(scene) {
    const node = el('div', 'scene scene-title');
    node.append(el('div', 'cover-mark'), el('h2', '', `${esc(pick(scene.chapter, 'theme'))}<span class="zh">${esc(pick(scene.chapter, 'zh'))}</span>`));
    return node;
  },

  photo(scene) {
    const node = el('div', 'scene scene-photo');
    node.append(Object.assign(el('img'), { src: img(scene.photo), alt: scene.caption }));
    node.append(el('div', 'caption', `<p class="caption-theme">${esc(pick(scene.chapter, 'theme'))}</p><p class="caption-text">${esc(scene.caption)}</p>`));
    return node;
  },

  stats() {
    const node = el('div', 'scene scene-stats');
    node.append(el('div', 'cover-mark'));
    node.append(el('h2', '', `Hosun Group at a glance<span class="zh">恒升集团</span>`));
    node.append(el('div', 'stat-row', STATS.map((s) => `<div class="stat"><span class="stat-figure">${esc(s.figure)}</span><span class="stat-label">${esc(s.label)}<span class="zh">${s.zh}</span></span></div>`).join('')));
    return node;
  },

  spotlight(scene) {
    const p = byId[scene.product];
    const node = el('div', 'scene scene-spotlight');
    node.append(el('div', 'cover-mark'));
    const photo = p.images[0];
    const media = el('div', `spot-image${photo ? '' : ' is-empty'}${photo?.startsWith('film/') || photo?.startsWith('factory/') ? ' is-photo' : ''}`);
    media.innerHTML = photo
      ? `<img src="${img(photo)}" alt="${esc(p.name)}">`
      : `<div class="spot-placeholder">${ROBOT_ICON}<p>${esc(p.placeholder)}</p></div>`;
    const specs = p.specs.slice(0, 8).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('');
    node.append(media, el('div', 'spot-copy', `
      <p class="spot-model">${esc(p.model)}</p>
      <h2>${esc(p.name)}<span class="zh">${p.zh}</span></h2>
      ${p.lede ? `<p class="spot-lede">${esc(p.lede)}</p>` : ''}
      <ul class="spec-list">${specs}</ul>`));
    return node;
  },

  mosaic(scene) {
    const node = el('div', 'scene scene-mosaic');
    node.append(el('div', 'cover-mark'), el('h2', '', `${esc(pick(scene, 'title'))}<span class="zh">${esc(pick(scene, 'zh'))}</span>`));
    const items = PRODUCTS.filter((p) => p.cat === scene.category && p.images.length);
    node.append(el('div', 'mosaic', items.map((p, i) => `<figure style="--i:${i}"><img src="${img(p.images[0])}" alt=""><figcaption>${esc(p.name)}</figcaption></figure>`).join('')));
    return node;
  },

  certs() {
    const node = el('div', 'scene scene-board');
    node.append(el('div', 'cover-mark'), el('h2', '', 'Certified management systems<span class="zh">体系认证</span>'));
    const current = CERTIFICATES.filter((c) => certIsCurrent(c));
    node.append(el('div', 'cert-fan', current.map((c, i) => `<img style="--i:${i}" src="${img(c.image)}" alt="${esc(c.standard)} certificate">`).join('')));
    const standards = [...CERTIFICATES.map((c) => c.standard), ...OTHER_SYSTEMS];
    node.append(el('div', 'badge-row', standards.map((s) => `<span class="badge">${esc(s)}</span>`).join('')));
    return node;
  },

  partners() {
    const node = el('div', 'scene scene-board');
    node.append(el('div', 'cover-mark'), el('h2', '', 'Trusted by global brands<span class="zh">合作客户</span>'));
    node.append(el('div', 'logo-wall', PARTNERS.map((p, i) => `<div class="logo-tile" style="--i:${i}"><div class="logo-ink" role="img" aria-label="${esc(PARTNER_LABELS[p.id])}" style="--logo:url('${new URL(p.src, document.baseURI).href}')"></div>${p.text ? `<span class="logo-text">${p.text}</span>` : ''}</div>`).join('')));
    return node;
  },

  timeline() {
    const node = el('div', 'scene scene-board');
    node.append(el('div', 'cover-mark'), el('h2', '', 'Twenty-five years of rising<span class="zh">发展历程</span>'));
    node.append(el('ol', 'year-line', MILESTONES.map(([y, t], i) => `<li style="--i:${i}"><b>${y}</b><span>${esc(t)}</span></li>`).join('')));
    return node;
  },

  cta() {
    const node = el('div', 'scene scene-cta');
    node.append(el('div', 'cover-mark'));
    const night = rising();
    node.append(
      el('h2', '', esc(night ? RISING_LINES.cta : 'Let’s build what comes next, together.')),
      el('p', 'zh-line', night ? '不给糖就捣蛋？留下名片吧' : '连接合作，共创未来'),
      el('p', '', esc(night ? RISING_LINES.ctaSub : 'Leave your details on this tablet and our team will follow up after the fair — in your language.')),
      el('button', 'button button-primary button-large', 'Leave your contact'),
    );
    Object.assign(node.querySelector('button'), { type: 'button' }).dataset.action = 'lead';
    return node;
  },

  film() {
    const node = el('div', 'scene scene-film');
    const video = el('video');
    Object.assign(video, { muted: true, playsInline: true, autoplay: false, preload: 'auto', poster: img(FILM.poster) });
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    node.append(video);
    return node;
  },
};

export function createReel({ stage, chapterEl, liftEl }) {
  const scenes = playlist();
  let index = -1;
  let filmPass = 0;
  let timer = 0;
  let running = false;
  let pace = 1;
  let current = null;
  let generation = 0;   // bumps on every scene change; a build that finishes late is dropped

  const setChapter = (scene) => {
    const chapter = scene.chapter;
    chapterEl.innerHTML = chapter ? `${esc(pick(chapter, 'theme'))}<span class="zh">${esc(pick(chapter, 'zh'))}</span>` : '';
  };

  const runLift = (seconds) => {
    liftEl.style.transition = 'none';
    liftEl.style.height = '0%';
    void liftEl.offsetHeight;
    liftEl.style.transition = `height ${seconds}s linear`;
    liftEl.style.height = '100%';
  };

  const ready = (node) => Promise.race([
    Promise.all([...node.querySelectorAll('img')].map((i) => i.decode?.().catch(() => {}))),
    new Promise((r) => setTimeout(r, 1500)),
  ]);

  async function startFilm(node, seconds) {
    const video = node.querySelector('video');
    const [from, to] = FILM.segments[filmPass++ % FILM.segments.length];
    video.src = await localUrl(FILM.src);
    video.currentTime = from;
    video.addEventListener('timeupdate', () => { if (video.currentTime >= to) video.pause(); });
    try { await video.play(); } catch { /* autoplay refused — the poster still shows */ }
    return Math.min(seconds, to - from);
  }

  async function show(i) {
    const mine = ++generation;
    const stale = () => !running || mine !== generation;
    const scene = scenes[i];
    const node = BUILD[scene.type](scene);
    let seconds = scene.seconds * pace;
    node.style.setProperty('--dur', `${seconds + 1.2}s`);
    await ready(node);
    if (stale()) return;
    stage.append(node);
    if (scene.type === 'film') seconds = await startFilm(node, seconds);
    if (stale()) {
      node.querySelector('video')?.pause();
      node.remove();
      return;
    }
    setChapter(scene);
    runLift(seconds);
    const previous = current;
    current = node;
    requestAnimationFrame(() => {
      previous?.classList.add('is-out');
      node.classList.add('is-in');
    });
    // the old scene leaves once the new one has fully risen over it
    setTimeout(() => { previous?.querySelector('video')?.pause(); previous?.remove(); }, 1200);
    timer = setTimeout(next, seconds * 1000);
  }

  function next() {
    if (!running) return;
    index = (index + 1) % scenes.length;
    show(index);
  }

  return {
    start({ fromTop = false, slidePace = 1 } = {}) {
      pace = slidePace;
      if (fromTop) index = -1;
      if (running) return;
      running = true;
      next();
    },
    stop() {
      running = false;
      generation += 1;
      clearTimeout(timer);
      stage.querySelectorAll('video').forEach((v) => v.pause());
    },
    // rebuild the scene on screen, e.g. after the skin changes
    refresh() {
      if (!running) return;
      clearTimeout(timer);
      index -= 1;
      next();
    },
    // ?debug only: jump to scene i of the flattened playlist
    jump(i) {
      clearTimeout(timer);
      index = i - 1;
      running = true;
      next();
    },
    get length() { return scenes.length; },
    get running() { return running; },
  };
}
