// The explorable site behind the showreel: renders every section from
// content.js and runs the product and certificate sheets.

import {
  COMPANY, STATS, ABOUT, CORE_BUSINESS, PHILOSOPHY, FACTORIES, MILESTONES, CERTIFICATES, WELDING, PARTNERS,
  CATEGORIES, PRODUCTS, FILM, img, en, zh,
} from './content.js';
import { esc, bi, specItems, partnerTile, certIsCurrent } from './ui.js';
import { localUrl } from './offline.js';

const slot = (name) => document.querySelector(`[data-render="${name}"]`);
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const isCutout = (id) => id.startsWith('product/');

const STRIP = [
  ['factory/welding-robot', 'Robotic welding', '机器人焊接'],
  ['factory/machining', 'Machining', '机加工'],
  ['factory/robot-arm-2', 'Automated handling', '自动化上下料'],
  ['factory/painting-line', 'Automated spraying line', '自动喷涂线'],
  ['factory/assembly-1', 'Assembly', '装配'],
  ['factory/assembly-2', 'Assembly line', '装配线'],
  ['factory/assembly-3', 'Final assembly and testing', '总装与检测'],
  ['film/rnd', 'R&D team', '研发团队'],
  ['factory/showroom-1', 'Showroom', '展厅'],
  ['factory/partner-wall', 'Partner wall', '合作伙伴墙'],
];

const productCard = (p) => `
  <button class="product-card" type="button" data-product="${p.id}" data-cat="${p.cat}">
    <span class="thumb"><img${p.sceneThumb || !p.images[0].startsWith('product/') ? ' class="is-scene"' : ''} src="${img(p.images[0])}" alt="" loading="lazy" decoding="async"></span>
    <span class="model">${bi(p.model)}</span>
    <span class="name">${esc(en(p.name))}</span>
    <span class="name-zh zh">${esc(zh(p.name))}</span>
  </button>`;

function renderStatic() {
  slot('taglines-zh').innerHTML = COMPANY.taglines.map(([, z]) => `<span>${esc(z)}</span>`).join('');
  slot('taglines-en').innerHTML = COMPANY.taglines.map(([e]) => `<span>${esc(e)}</span>`).join('');
  slot('stats').innerHTML = STATS.map((s) => `<div class="stat"><span class="stat-figure">${esc(s.figure)}${s.unit ? `<small>${s.unit}</small>` : ''}</span><span class="stat-label">${bi(s.label)}</span></div>`).join('');
  slot('about').innerHTML = `
    <div class="about-col">${ABOUT.en.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <div class="about-col zh">${ABOUT.zh.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
  slot('core').innerHTML = CORE_BUSINESS.map((b) => `
    <article class="division">
      <h3>${bi(b.name)}</h3>
      <dl>${b.rows.map(([k, v]) => `<div><dt>${bi(k)}</dt><dd>${esc(en(v))}<span class="zh">${esc(zh(v))}</span></dd></div>`).join('')}</dl>
    </article>`).join('');
  slot('philosophy').innerHTML = PHILOSOPHY.map((m) => `
    <article class="creed"><h3>${bi(m.title)}</h3><p>${esc(m.en)}</p><p class="zh">${esc(m.zh)}</p></article>`).join('');

  slot('featured').innerHTML = PRODUCTS.filter((p) => p.cat === 'featured').map((p) => {
    const first = p.images[0];
    return `
      <article class="feature">
        <button class="feature-media${isCutout(first) ? ' is-cutout' : ''}" type="button" data-product="${p.id}" aria-label="${esc(en(p.name))} — pictures">
          <img src="${img(first)}" alt="${esc(en(p.name))}" loading="lazy" decoding="async">
        </button>
        <div class="feature-copy">
          <p class="spot-model">${bi(p.model)}</p>
          <h3>${bi(p.name)}</h3>
          <p>${esc(en(p.lede))}</p>
          <p class="zh">${esc(zh(p.lede))}</p>
          <ul class="spec-list">${specItems(p.specs, 6)}</ul>
          <button class="button button-ghost button-small" type="button" data-product="${p.id}">All specifications <span class="zh">全部参数</span></button>
        </div>
      </article>`;
  }).join('');

  slot('filters').innerHTML = [{ id: 'all', name: ['All', '全部'] }, ...CATEGORIES]
    .map((c, i) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${i === 0}">${bi(c.name)}</button>`).join('');
  slot('catalogue').innerHTML = PRODUCTS.filter((p) => p.images.length).map(productCard).join('');

  slot('factories').innerHTML = FACTORIES.map((f) => `
    <article class="factory">
      <img src="${img(f.image)}" alt="" loading="lazy" decoding="async">
      <div>
        <p class="area">${f.area}</p>
        <h3>${bi(f.name)}</h3>
        <p>${esc(f.en)}</p><p class="zh">${esc(f.zh)}</p>
        <p class="factory-products">${esc(en(f.products))}<span class="zh">${esc(zh(f.products))}</span></p>
      </div>
    </article>`).join('');
  slot('strip').innerHTML = STRIP.map(([id, e, z]) => `<figure><img src="${img(id)}" alt="${esc(e)}" loading="lazy" decoding="async"><figcaption>${esc(e)}<span class="zh">${esc(z)}</span></figcaption></figure>`).join('');

  const today = new Date();
  slot('certs').innerHTML = CERTIFICATES.map((c) => {
    const head = `<h3>${esc(c.standard)}</h3><p>${bi(c.scope)}</p>`;
    if (c.image && certIsCurrent(c, today)) {
      return `<button class="cert" type="button" data-cert="${c.id}"><img src="${img(c.image)}" alt="${esc(c.standard)} certificate" loading="lazy" decoding="async">${head}</button>`;
    }
    // past its printed expiry: show the standard, not an out-of-date scan
    return `<div class="cert"><div class="cert-badge"><strong>${esc(c.standard)}</strong><small>Current certificate available from our team on request<span class="zh">最新证书可向工作人员索取</span></small></div>${head}</div>`;
  }).join('');

  // slide 8: ISO 3834-2 on a row of its own
  slot('welding').hidden = !WELDING.show;
  slot('welding').innerHTML = `
    <div class="welding-copy">
      <p class="eyebrow">${esc(WELDING.standard)}</p>
      <h3>${bi(WELDING.title)}</h3>
      <ul class="welding-team">${WELDING.team.map(([e, z, n]) => `<li><b>${n}</b><span>${esc(e)}<span class="zh">${esc(z)}</span></span></li>`).join('')}</ul>
    </div>
    <button class="welding-cert" type="button" data-cert-image="${WELDING.certificate}" aria-label="${esc(WELDING.standard)} certificate"><img src="${img(WELDING.certificate)}" alt="" loading="lazy" decoding="async"></button>
    <div class="welding-people">${WELDING.welders.map((w, i) => `<button type="button" data-cert-image="${w}" aria-label="Welder certificate ${i + 1}" style="--i:${i}"><img src="${img(w)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>`;

  slot('partners').innerHTML = PARTNERS.map((p) => partnerTile(p)).join('');
  slot('timeline').innerHTML = MILESTONES.map(([y, e, z]) => `<li><b>${y}</b><strong>${esc(e)}</strong><span class="zh">${esc(z)}</span></li>`).join('');
  slot('contact').innerHTML = `
    <div><dt>Companies <span class="zh">公司</span></dt>${COMPANY.names.map((n, i) => `<dd>${esc(n)}<span class="zh">${COMPANY.namesZh[i]}</span></dd>`).join('')}</div>
    <div><dt>Telephone <span class="zh">电话</span></dt><dd dir="ltr">${COMPANY.phone}</dd><dd dir="ltr">${COMPANY.mobile}</dd></div>
    <div><dt>Email <span class="zh">邮箱</span></dt>${COMPANY.emails.map((e) => `<dd>${e}</dd>`).join('')}</div>
    <div><dt>Website <span class="zh">网站</span></dt>${COMPANY.webs.map((w) => `<dd>${w}</dd>`).join('')}</div>
    <div><dt>Address <span class="zh">地址</span></dt><dd>${bi(COMPANY.address)}</dd></div>`;
  slot('social').innerHTML = `
    <h3>Social Media Accounts <span class="zh">社交媒体账号</span></h3>
    <p class="social-lede">Scan to follow <span class="zh">扫码关注</span></p>
    <div class="qr-row">${COMPANY.social.map(([e, z, h, qr]) => `
      <figure class="qr"><img src="${img(qr)}" alt="QR code — ${esc(e)} ${esc(z)}" loading="lazy" decoding="async">
        <figcaption><b>${esc(e)}</b><span class="zh">${esc(z)}</span><em>${esc(h)}</em></figcaption></figure>`).join('')}</div>`;
}

function wireCatalogue() {
  const filters = slot('filters');
  filters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    const want = chip.dataset.filter;
    filters.querySelectorAll('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('.product-card').forEach((card) => { card.hidden = want !== 'all' && card.dataset.cat !== want; });
  });
}

// --- product sheet ------------------------------------------------------------
const sheet = document.getElementById('product-sheet');
const sheetBody = document.getElementById('sheet-body');

export function openProduct(id) {
  const p = byId[id];
  if (!p) return;
  const images = p.images;
  const caption = (src) => p.captions?.[src];
  const captionHtml = (src) => (caption(src) ? bi(caption(src)) : '');
  sheetBody.innerHTML = `
    <div class="gallery">
      <figure class="gallery-main"><img src="${img(images[0])}" alt="${esc(en(p.name))}"><figcaption ${caption(images[0]) ? '' : 'hidden'}>${captionHtml(images[0])}</figcaption></figure>
      ${images.length > 1 ? `<div class="gallery-thumbs">${images.map((src, i) => `<button type="button" data-src="${src}" aria-current="${i === 0}" aria-label="Picture ${i + 1}"><img src="${img(src)}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="sheet-info">
      <p class="spot-model">${bi(p.model)}</p>
      <h2 id="sheet-title">${bi(p.name)}</h2>
      ${p.lede ? `<p class="spot-lede">${esc(en(p.lede))}</p><p class="spot-lede zh">${esc(zh(p.lede))}</p>` : ''}
      ${p.specs.length ? `<ul class="spec-list">${specItems(p.specs)}</ul>` : '<p class="spot-lede">Full specifications are available from our team at the stand.<span class="zh">详细参数请咨询展台工作人员。</span></p>'}
      <button class="button button-primary" type="button" data-action="lead" data-interest="${p.cat}">Ask about this product <span class="zh">咨询此产品</span></button>
    </div>`;
  sheetBody.querySelector('.gallery-thumbs')?.addEventListener('click', (event) => {
    const thumb = event.target.closest('[data-src]');
    if (!thumb) return;
    const main = sheetBody.querySelector('.gallery-main');
    main.querySelector('img').src = img(thumb.dataset.src);
    const cap = main.querySelector('figcaption');
    cap.innerHTML = captionHtml(thumb.dataset.src);
    cap.hidden = !cap.innerHTML;
    sheetBody.querySelectorAll('.gallery-thumbs button').forEach((b) => b.setAttribute('aria-current', String(b === thumb)));
  });
  sheet.showModal();
  sheetBody.scrollTop = 0;
}

const certSheet = document.getElementById('cert-sheet');
function openCert(id, imageId) {
  const c = CERTIFICATES.find((x) => x.id === id);
  const image = document.getElementById('cert-image');
  image.onload = () => image.style.setProperty('--ratio', image.naturalWidth / image.naturalHeight);
  image.src = img(imageId ?? c.image);
  image.alt = c ? `${c.standard} certificate` : 'Certificate';
  certSheet.showModal();
}

// --- section highlighting in the nav ------------------------------------------
function wireNav() {
  const links = [...document.querySelectorAll('.site-nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && seen.observe(s));
}

// The factory filmstrip drifts on its own, looping without a seam (the photos
// are repeated once). A touch, drag or wheel stops it; it carries on from
// wherever the visitor left it a few seconds later. Off-screen, hidden or
// reduced-motion: it stays still.
function driftStrip() {
  const strip = slot('strip');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const originals = [...strip.children];
  originals.forEach((figure) => {
    const copy = figure.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach((i) => { i.alt = ''; });
    strip.append(copy);
  });
  const SPEED = 36; // px per second
  let pos = 0;
  let last = 0;
  let held = false;
  let visible = false;
  let resume = 0;
  const loop = () => strip.children[originals.length].offsetLeft - originals[0].offsetLeft;

  const hold = () => { held = true; clearTimeout(resume); };
  const release = () => {
    clearTimeout(resume);
    resume = setTimeout(() => { pos = strip.scrollLeft; held = false; }, 3500);
  };
  strip.addEventListener('pointerdown', hold);
  strip.addEventListener('wheel', () => { hold(); release(); }, { passive: true });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => strip.addEventListener(type, () => { if (held) release(); }));
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(strip);

  const frame = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!held && visible && !document.hidden && document.body.dataset.mode === 'explore') {
      const width = loop();
      pos += SPEED * dt;
      if (pos >= width) pos -= width;
      strip.scrollLeft = pos;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// the page's film player: English by default, Chinese on request
let filmVersion = FILM.default;
async function loadFilm(version) {
  const player = document.getElementById('film-player');
  const wasPlaying = !player.paused;
  filmVersion = version;
  player.src = await localUrl(FILM.versions[version].src);
  document.querySelectorAll('[data-film]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.film === version)));
  if (wasPlaying) player.play().catch(() => {});
}

export async function prepareFilm() {
  if (!document.getElementById('film-player').src) await loadFilm(filmVersion);
}

export function initSite() {
  renderStatic();
  document.querySelector('.film-switch').innerHTML = Object.entries(FILM.versions)
    .map(([key, v]) => `<button class="chip" type="button" data-film="${key}" aria-pressed="${key === FILM.default}">${bi(v.label)}</button>`).join('');
  document.querySelector('.film-switch').addEventListener('click', (event) => {
    const choice = event.target.closest('[data-film]');
    if (choice && choice.dataset.film !== filmVersion) loadFilm(choice.dataset.film);
  });
  wireCatalogue();
  wireNav();
  driftStrip();
  document.addEventListener('click', (event) => {
    const product = event.target.closest('[data-product]');
    if (product) openProduct(product.dataset.product);
    const cert = event.target.closest('[data-cert]');
    if (cert) openCert(cert.dataset.cert);
    const scan = event.target.closest('[data-cert-image]');
    if (scan) openCert(null, scan.dataset.certImage);
  });
  // the × button and a tap on the backdrop both close a sheet
  [sheet, certSheet].forEach((d) => d.addEventListener('click', (event) => {
    if (event.target === d || event.target.closest('[data-close]')) d.close();
  }));
}

export function resetSite() {
  [sheet, certSheet].forEach((d) => d.open && d.close());
  document.getElementById('film-player').pause();
  if (filmVersion !== FILM.default) loadFilm(FILM.default);
  slot('filters').querySelector('[data-filter="all"]')?.click();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
