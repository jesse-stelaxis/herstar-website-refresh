// The attract loop: themed photo runs, product spotlights and intercut
// slogans, each scene rising into place over the last. Scenes are built
// from REEL in content.js; this file only knows how to draw each type.

import {
  REEL, PRODUCTS, STATS, CERTIFICATES, WELDING, PARTNERS, MILESTONES, FILM, RISING_LINES, COMPANY, img, en, zh,
} from './content.js';
import { esc, bi, specItems, partnerTile, certIsCurrent } from './ui.js';
import { localUrl } from './offline.js';

const TITLE_SECONDS = 4;
const rising = () => document.body.classList.contains('rising');
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

// a chapter becomes its title card followed by one scene per photo
function playlist() {
  return REEL.flatMap((scene) => scene.type !== 'chapter' ? [scene] : [
    { type: 'title', seconds: TITLE_SECONDS, chapter: scene },
    ...scene.photos.map(([photo, e, z]) => ({ type: 'photo', seconds: scene.seconds, photo, caption: [e, z], chapter: scene })),
  ]);
}

const pick = (scene, key) => (rising() && scene.rising?.[key]) || scene[key];
const heading = (e, z) => `${esc(e)}<span class="zh">${esc(z)}</span>`;

const BUILD = {
  // the same slide-1 cover as the browsing site's first page
  cover() {
    const node = el('div', 'scene slide-cover scene-slide');
    node.innerHTML = `
      <div class="slide-logos">
        <img class="logo-hosun" src="assets/img/cover/hosun.webp" alt="HOSUN 恒升">
        <img class="logo-herstar" src="assets/img/cover/herstar.webp" alt="HERSTAR 恒而思达">
      </div>
      <div class="slide-copy">
        ${rising() ? `<p class="cover-kicker">${bi(RISING_LINES.coverKicker)}</p>` : ''}
        <h1 class="slide-title"><span class="slide-title-zh">恒升集团</span><span class="slide-title-en">THE HOSUN GROUP</span></h1>
        <p class="slide-lines-zh">${COMPANY.taglines.map(([, z]) => `<span>${esc(z)}</span>`).join('')}</p>
        <p class="slide-lines-en">${COMPANY.taglines.map(([e]) => `<span>${esc(e)}</span>`).join('')}</p>
      </div>
      <img class="slide-company" src="assets/img/cover/company-name.webp" alt="苏州恒而思达医疗科技有限公司 Suzhou Herstar Medical Technology Co., Ltd.">`;
    return node;
  },

  slogan(scene) {
    const node = el('div', 'scene scene-slogan');
    if (scene.bg) node.append(Object.assign(el('img', 'scene-bg'), { src: img(scene.bg), alt: '' }));
    const line = pick(scene, 'line');
    node.append(el('div', 'slogan', `<p class="slogan-en">${esc(en(line))}</p><p class="slogan-zh">${esc(zh(line))}</p>`));
    return node;
  },

  title(scene) {
    const node = el('div', 'scene scene-title');
    node.append(el('div', 'cover-mark'), el('h2', '', bi(pick(scene.chapter, 'theme'))));
    return node;
  },

  photo(scene) {
    const node = el('div', 'scene scene-photo');
    node.append(Object.assign(el('img'), { src: img(scene.photo), alt: en(scene.caption) }));
    node.append(el('div', 'caption', `<p class="caption-theme">${bi(pick(scene.chapter, 'theme'))}</p><p class="caption-text">${bi(scene.caption)}</p>`));
    return node;
  },

  stats() {
    const node = el('div', 'scene scene-stats');
    node.append(el('div', 'cover-mark'));
    node.append(el('h2', '', bi(COMPANY.group)));
    node.append(el('div', 'stat-row', STATS.map((s) => `<div class="stat"><span class="stat-figure">${esc(s.figure)}${s.unit ? `<small>${s.unit}</small>` : ''}</span><span class="stat-label">${bi(s.label)}</span></div>`).join('')));
    return node;
  },

  spotlight(scene) {
    const p = byId[scene.product];
    const node = el('div', 'scene scene-spotlight');
    node.append(el('div', 'cover-mark'));
    const photo = p.images[0];
    const media = el('div', `spot-image${photo.startsWith('product/') ? '' : ' is-photo'}`);
    media.innerHTML = `<img src="${img(photo)}" alt="${esc(en(p.name))}">`;
    node.append(media, el('div', 'spot-copy', `
      <p class="spot-model">${bi(p.model)}</p>
      <h2>${bi(p.name)}</h2>
      ${p.lede ? `<p class="spot-lede">${esc(en(p.lede))}<span class="zh">${esc(zh(p.lede))}</span></p>` : ''}
      <ul class="spec-list">${specItems(p.specs, 6)}</ul>`));
    return node;
  },

  mosaic(scene) {
    const node = el('div', 'scene scene-mosaic');
    node.append(el('div', 'cover-mark'), el('h2', '', bi(pick(scene, 'title'))));
    const items = PRODUCTS.filter((p) => p.cat === scene.category && p.images.length);
    node.append(el('div', 'mosaic', items.map((p, i) => `<figure style="--i:${i}"><img src="${img(p.images[0])}" alt=""><figcaption>${bi(p.name)}</figcaption></figure>`).join('')));
    return node;
  },

  certs() {
    const node = el('div', 'scene scene-board');
    node.append(el('div', 'cover-mark'), el('h2', '', heading('Certification', '体系认证')));
    const current = CERTIFICATES.filter((c) => c.image && certIsCurrent(c));
    node.append(el('div', 'cert-fan', current.map((c, i) => `<img style="--i:${i}" src="${img(c.image)}" alt="${esc(c.standard)} certificate">`).join('')));
    const standards = [...CERTIFICATES.map((c) => c.standard), ...(WELDING.show ? [WELDING.standard] : [])];
    node.append(el('div', 'badge-row', standards.map((s) => `<span class="badge">${esc(s)}</span>`).join('')));
    return node;
  },

  partners() {
    const node = el('div', 'scene scene-board scene-partners');
    node.append(el('div', 'cover-mark'), el('h2', '', heading('Major Customers', '主要客户')));
    node.append(el('div', 'logo-wall', PARTNERS.map((p, i) => partnerTile(p, i)).join('')));
    return node;
  },

  timeline() {
    const node = el('div', 'scene scene-board');
    node.append(el('div', 'cover-mark'), el('h2', '', heading('The Hosun Group Development History', '发展历程')));
    node.append(el('ol', 'year-line', MILESTONES.map(([y, e, z], i) => `<li style="--i:${i}"><b>${y}</b><span>${esc(e)}</span><span class="zh">${esc(z)}</span></li>`).join('')));
    return node;
  },

  cta() {
    const node = el('div', 'scene scene-cta');
    node.append(el('div', 'cover-mark'));
    const night = rising();
    const title = night ? RISING_LINES.cta : ['Let’s build what comes next, together.', '连接合作，共创未来'];
    const body = night ? RISING_LINES.ctaSub : ['Leave your details on this tablet and our team will follow up after the fair — in your language.', '在这台平板上留下您的联系方式，展会结束后我们的团队会用您的语言与您联系。'];
    node.append(
      el('h2', '', esc(en(title))),
      el('p', 'zh-line', esc(zh(title))),
      el('p', 'cta-body', bi(body)),
      el('button', 'button button-primary button-large', 'Leave your contact <span class="zh">留下联系方式</span>'),
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
    chapterEl.innerHTML = chapter ? bi(pick(chapter, 'theme')) : '';
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
    video.src = await localUrl(FILM.versions[FILM.default].src);
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
