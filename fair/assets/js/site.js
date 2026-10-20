// The explorable site behind the showreel: renders every section from
// content.js and runs the product and certificate sheets.

import {
  COMPANY, STATS, STORY, DIVISIONS, FACTORIES, MILESTONES, CERTIFICATES, OTHER_SYSTEMS, PARTNERS, PARTNER_LABELS,
  CATEGORIES, PRODUCTS, FILM, img,
} from './content.js';
import { certIsCurrent } from './showreel.js';
import { localUrl } from './offline.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slot = (name) => document.querySelector(`[data-render="${name}"]`);
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const isCutout = (id) => id.startsWith('product/');

const STRIP = [
  ['factory/welding-robot', 'Robotic welding'], ['factory/machining', 'CNC machining'], ['factory/robot-arm-2', 'Automated handling'],
  ['factory/painting', 'Coating'], ['factory/assembly-1', 'Assembly'], ['factory/assembly-3', 'Final assembly and testing'],
  ['factory/lifting-columns', 'Lifting columns'], ['film/rnd', 'R&D team'], ['factory/showroom-1', 'Showroom'],
  ['factory/partner-wall', 'Partner wall'], ['factory/team', 'The Herstar team'], ['factory/new-campus-2', 'New campus plan'],
];

function renderStatic() {
  slot('taglines').innerHTML = COMPANY.taglines.map(([en, zh]) => `<li><span class="zh">${zh}</span>${esc(en)}</li>`).join('');
  slot('stats').innerHTML = STATS.map((s) => `<div class="stat"><span class="stat-figure">${esc(s.figure)}</span><span class="stat-label">${esc(s.label)}<span class="zh">${s.zh}</span></span></div>`).join('');
  slot('story').innerHTML = STORY.map((p) => `<p>${esc(p)}</p>`).join('');
  slot('divisions').innerHTML = DIVISIONS.map((d) => `
    <article class="division">
      <h3>${esc(d.name)}<span class="zh">${d.zh}</span></h3>
      <p class="unit">${esc(d.unit)}</p>
      <dl>${d.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <p class="keywords">${esc(d.keywords)}</p>
    </article>`).join('');

  slot('featured').innerHTML = PRODUCTS.filter((p) => p.cat === 'featured').map((p) => {
    const first = p.images[0];
    const media = first
      ? `<img src="${img(first)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="spot-placeholder"><svg viewBox="0 0 120 120" aria-hidden="true"><rect x="34" y="14" width="52" height="40" rx="12"/><circle cx="50" cy="34" r="5"/><circle cx="70" cy="34" r="5"/><path d="M60 54v12M30 66h60v22H30zM38 88v14M82 88v14M24 102h72M18 76h12M90 76h12"/></svg><p>${esc(p.placeholder)}</p></div>`;
    return `
      <article class="feature">
        <div class="feature-media${first && isCutout(first) ? ' is-cutout' : ''}${first ? '' : ' is-empty'}">${media}</div>
        <div class="feature-copy">
          <p class="spot-model">${esc(p.model)}</p>
          <h3>${esc(p.name)}<span class="zh">${p.zh}</span></h3>
          <p>${esc(p.lede)}</p>
          <ul class="spec-list">${p.specs.slice(0, 6).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
          <button class="button button-ghost button-small" type="button" data-product="${p.id}">All specifications</button>
        </div>
      </article>`;
  }).join('');

  slot('filters').innerHTML = [{ id: 'all', name: 'All', zh: '全部' }, ...CATEGORIES.filter((c) => c.id !== 'featured')]
    .map((c, i) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${i === 0}">${esc(c.name)}<span class="zh">${c.zh}</span></button>`).join('');
  slot('catalogue').innerHTML = PRODUCTS.filter((p) => p.cat !== 'featured' && p.images.length).map((p) => `
    <button class="product-card" type="button" data-product="${p.id}" data-cat="${p.cat}">
      <span class="thumb"><img src="${img(p.images[0])}" alt="" loading="lazy"></span>
      <span class="model">${esc(p.model)}</span>
      <span class="name">${esc(p.name)}</span>
      <span class="name-zh zh">${p.zh}</span>
    </button>`).join('');

  slot('factories').innerHTML = FACTORIES.map((f) => `
    <article class="factory">
      <img src="${img(f.image)}" alt="" loading="lazy">
      <div><p class="area">${f.area}</p><h3>${esc(f.name)}<span class="zh">${f.zh}</span></h3><p>${esc(f.note)}</p></div>
    </article>`).join('');
  slot('strip').innerHTML = STRIP.map(([id, cap]) => `<figure><img src="${img(id)}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join('');

  const today = new Date();
  slot('certs').innerHTML = CERTIFICATES.map((c) => certIsCurrent(c, today)
    ? `<button class="cert" type="button" data-cert="${c.id}"><img src="${img(c.image)}" alt="${esc(c.standard)} certificate" loading="lazy"><h3>${esc(c.standard)}</h3><p>${esc(c.scope)}</p><p>${esc(c.body)}${c.validUntil ? ` · valid to ${c.validUntil}` : ''}</p></button>`
    // past its printed expiry: show the standard, not the out-of-date scan
    : `<div class="cert"><div class="cert-badge"><strong>${esc(c.standard)}</strong><small>Current certificate available from our team on request</small></div><h3>${esc(c.standard)}</h3><p>${esc(c.scope)}</p></div>`,
  ).join('') + `<p class="systems"><span>Also certified:</span>${OTHER_SYSTEMS.map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</p>`;

  slot('partners').innerHTML = PARTNERS.map((p) => `<div class="logo-tile"><div class="logo-ink" role="img" aria-label="${esc(PARTNER_LABELS[p.id])}" style="--logo:url('${new URL(p.src, document.baseURI).href}')"></div>${p.text ? `<span class="logo-text">${p.text}</span>` : ''}</div>`).join('');
  slot('timeline').innerHTML = MILESTONES.map(([y, t, d]) => `<li><b>${y}</b><strong>${esc(t)}</strong><p>${esc(d)}</p></li>`).join('');
  slot('contact').innerHTML = `
    <div><dt>Companies</dt>${COMPANY.names.map((n) => `<dd>${esc(n)}</dd>`).join('')}${COMPANY.namesZh.map((n) => `<dd class="zh">${n}</dd>`).join('')}</div>
    <div><dt>Website</dt><dd>${COMPANY.web}</dd></div>
    <div><dt>Telephone</dt><dd dir="ltr">${COMPANY.phone}</dd><dd dir="ltr">${COMPANY.mobile}</dd></div>
    <div><dt>Email</dt><dd>${COMPANY.email}</dd></div>
    <div><dt>Address</dt><dd>${esc(COMPANY.address)}</dd></div>`;
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
  const caption = (src) => p.captions?.[src] ?? '';
  sheetBody.innerHTML = `
    <div class="gallery">
      <figure class="gallery-main">${images.length
        ? `<img src="${img(images[0])}" alt="${esc(p.name)}"><figcaption ${caption(images[0]) ? '' : 'hidden'}>${esc(caption(images[0]))}</figcaption>`
        : '<div class="spot-placeholder"><p>On the stand — come and see it move.</p></div>'}</figure>
      ${images.length > 1 ? `<div class="gallery-thumbs">${images.map((src, i) => `<button type="button" data-src="${src}" aria-current="${i === 0}" aria-label="Picture ${i + 1}"><img src="${img(src)}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="sheet-info">
      <p class="spot-model">${esc(p.model)}</p>
      <h2 id="sheet-title">${esc(p.name)}<span class="zh">${p.zh}</span></h2>
      ${p.lede ? `<p class="spot-lede">${esc(p.lede)}</p>` : ''}
      ${p.specs.length ? `<ul class="spec-list">${p.specs.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>` : '<p class="spot-lede">Full specifications are available from our team at the stand.</p>'}
      <button class="button button-primary" type="button" data-action="lead" data-interest="${p.cat}">Ask about this product</button>
    </div>`;
  sheetBody.querySelector('.gallery-thumbs')?.addEventListener('click', (event) => {
    const thumb = event.target.closest('[data-src]');
    if (!thumb) return;
    const main = sheetBody.querySelector('.gallery-main');
    main.querySelector('img').src = img(thumb.dataset.src);
    const cap = main.querySelector('figcaption');
    cap.textContent = caption(thumb.dataset.src);
    cap.hidden = !cap.textContent;
    sheetBody.querySelectorAll('.gallery-thumbs button').forEach((b) => b.setAttribute('aria-current', String(b === thumb)));
  });
  sheet.showModal();
  sheet.scrollTop = 0;
}

const certSheet = document.getElementById('cert-sheet');
function openCert(id) {
  const c = CERTIFICATES.find((x) => x.id === id);
  const image = document.getElementById('cert-image');
  image.src = img(c.image);
  image.alt = `${c.standard} certificate`;
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

export async function prepareFilm() {
  const player = document.getElementById('film-player');
  if (!player.src) player.src = await localUrl(FILM.src);
}

export function initSite() {
  renderStatic();
  wireCatalogue();
  wireNav();
  document.addEventListener('click', (event) => {
    const product = event.target.closest('[data-product]');
    if (product) openProduct(product.dataset.product);
    const cert = event.target.closest('[data-cert]');
    if (cert) openCert(cert.dataset.cert);
  });
  // tapping outside a sheet closes it
  [sheet, certSheet].forEach((d) => d.addEventListener('click', (event) => { if (event.target === d) d.close(); }));
}

export function resetSite() {
  [sheet, certSheet].forEach((d) => d.open && d.close());
  document.getElementById('film-player').pause();
  slot('filters').querySelector('[data-filter="all"]')?.click();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
