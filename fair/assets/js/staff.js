// Staff panel — hold either logo for two seconds, then enter the PIN.
// Exports leads as CSV (Excel-safe UTF-8), vCard 3.0 (straight into Contacts
// or Outlook) and JSON (everything, card photos included); optionally pushes
// them to a URL when the tablet is online.

import { allLeads, clearLeads, putLead } from './db.js';
import { settings, saveSettings } from './settings.js';
import { STRINGS } from './form-i18n.js';
import { cacheStatus, prepareOffline, clearOffline, offlineSupported } from './offline.js';

const dialog = document.getElementById('staff');
const lock = document.getElementById('staff-lock');
const panel = document.getElementById('staff-panel');
const pinInput = document.getElementById('staff-pin');
const pinMsg = document.getElementById('staff-pin-msg');

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const label = (key) => STRINGS.en[key] ?? key;
const labels = (keys) => (keys || []).map(label).join('; ');
const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

async function everyLead() {
  const stored = await allLeads().catch(() => []);
  let unsaved = [];
  try { unsaved = JSON.parse(localStorage.getItem('hosun-fair-unsaved') || '[]'); } catch { /* ignore */ }
  return [...stored, ...unsaved].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

// --- exports ------------------------------------------------------------------
const COLUMNS = [
  ['Saved at', (l) => l.createdAt], ['Booth', (l) => l.booth], ['Name', (l) => l.name], ['Company', (l) => l.company],
  ['Job title', (l) => l.title], ['Country', (l) => l.countryName], ['Country code', (l) => l.country], ['Email', (l) => l.email],
  ['Phone (E.164)', (l) => l.phoneE164], ['Phone as typed', (l) => l.phone], ['Messaging app', (l) => l.messenger], ['Messaging ID', (l) => l.messengerId],
  ['Business type', (l) => labels(l.business)], ['Interested in', (l) => labels(l.interests)], ['Wants', (l) => labels(l.next)],
  ['Yearly volume', (l) => label(l.volume || '')], ['Reply in', (l) => l.replyLanguage], ['Form language', (l) => l.formLanguage],
  ['Message', (l) => l.message], ['Card photo', (l) => (l.cardPhoto ? 'yes — see JSON export' : '')], ['Skin', (l) => l.skin], ['ID', (l) => l.id],
];

// cells that start with = + - @ would run as formulas in Excel (CSV injection)
const cell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};
const toCsv = (leads) => '\ufeff' + [COLUMNS.map(([h]) => cell(h)).join(','), ...leads.map((l) => COLUMNS.map(([, get]) => cell(get(l))).join(','))].join('\r\n');

const vEsc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const fold = (line) => line.length <= 75 ? line : line.match(/.{1,74}/g).join('\r\n ');
function toVcard(leads) {
  return leads.map((l) => {
    const note = [
      l.business?.length && `Business: ${labels(l.business)}`,
      l.interests?.length && `Interested in: ${labels(l.interests)}`,
      l.next?.length && `Wants: ${labels(l.next)}`,
      l.volume && `Volume: ${label(l.volume)}`,
      l.messenger && `${l.messenger}: ${l.messengerId}`,
      `Reply in: ${l.replyLanguage}`,
      l.message && `Message: ${l.message}`,
      `Met at ${l.booth}, ${l.createdAt.slice(0, 10)}`,
    ].filter(Boolean).join('\n');
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${vEsc(l.name)}`, `N:${vEsc(l.name)};;;;`,
      `ORG:${vEsc(l.company)}`,
      l.title && `TITLE:${vEsc(l.title)}`,
      l.email && `EMAIL;TYPE=INTERNET,WORK:${vEsc(l.email)}`,
      l.phoneE164 && `TEL;TYPE=CELL:${l.phoneE164}`,
      l.countryName && `ADR;TYPE=WORK:;;;;;;${vEsc(l.countryName)}`,
      `NOTE:${vEsc(note)}`,
      l.cardPhoto && `PHOTO;ENCODING=b;TYPE=JPEG:${l.cardPhoto.split(',')[1]}`,
      `REV:${l.createdAt}`,
      'END:VCARD',
    ].filter(Boolean).map(fold);
    return lines.join('\r\n');
  }).join('\r\n');
}

async function deliver(name, type, body) {
  const blob = new Blob([body], { type });
  const file = new File([blob], name, { type });
  // on a tablet, the share sheet (AirDrop, Mail, Files) is the fastest way off the device
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (error) { if (error.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// --- optional sync ------------------------------------------------------------
let syncing = false;
export async function syncLeads() {
  const url = settings().syncUrl;
  if (!url || syncing || !navigator.onLine) return { sent: 0 };
  syncing = true;
  let sent = 0;
  try {
    for (const lead of (await allLeads()).filter((l) => !l.synced)) {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!res.ok) break;
      await putLead({ ...lead, synced: true, syncedAt: new Date().toISOString() });
      sent += 1;
    }
  } catch (error) {
    console.warn('[fair] sync paused', error.message);
  } finally {
    syncing = false;
  }
  return { sent };
}

// --- panel ----------------------------------------------------------------------
async function renderPanel() {
  const s = settings();
  const leads = await everyLead();
  const status = await cacheStatus();
  const mb = (n) => (n / 1e6).toFixed(0);
  panel.innerHTML = `
    <button class="sheet-close" type="button" data-close aria-label="Close">×</button>
    <h2>Staff · ${esc(s.booth)}</h2>

    <h3>Contacts on this tablet: ${leads.length}${leads.some((l) => !l.synced) && s.syncUrl ? ` · ${leads.filter((l) => !l.synced).length} not yet synced` : ''}</h3>
    <div class="staff-row">
      <button class="button button-primary button-small" data-export="csv" type="button">Export spreadsheet (CSV)</button>
      <button class="button button-ghost button-small" data-export="vcf" type="button">Export contacts (vCard)</button>
      <button class="button button-ghost button-small" data-export="json" type="button">Export everything (JSON, with card photos)</button>
      ${s.syncUrl ? '<button class="button button-ghost button-small" data-sync type="button">Sync now</button>' : ''}
    </div>
    <p class="staff-note">Export at the end of every day. Leads live only on this tablet until exported${s.syncUrl ? ' or synced' : ''}.</p>
    <table class="staff-table">
      <thead><tr><th>Saved</th><th>Name</th><th>Company</th><th>Country</th><th>Reach</th><th>Card</th></tr></thead>
      <tbody>${leads.slice(-30).reverse().map((l) => `<tr><td>${esc(new Date(l.createdAt).toLocaleString())}</td><td>${esc(l.name)}</td><td>${esc(l.company)}</td><td>${esc(l.countryName)}</td><td>${esc(l.email || l.phoneE164)}</td><td>${l.cardPhoto ? '✓' : ''}</td></tr>`).join('') || '<tr><td colspan="6">No contacts yet.</td></tr>'}</tbody>
    </table>

    <h3>Offline copy</h3>
    <p>${status.supported
      ? `<span class="status-dot ${status.have === status.total && status.total ? 'ok' : ''}"></span>${status.have} of ${status.total} files saved · version ${esc(status.version ?? '—')} · ${status.usage ? `${mb(status.usage)} MB used` : ''} · storage ${status.persisted ? 'protected from clean-up' : 'not protected — add the page to the Home Screen'}`
      : '<span class="status-dot"></span>Not available: the page must be opened over https (or localhost) to save itself.'}</p>
    <div class="staff-row">
      <button class="button button-ghost button-small" data-recache type="button" ${offlineSupported ? '' : 'disabled'}>Check for updates and fill gaps</button>
      <button class="button button-ghost button-small" data-rebuild type="button" ${offlineSupported ? '' : 'disabled'}>Download everything again</button>
      <span class="staff-note" id="staff-cache-msg"></span>
    </div>

    <h3>Settings</h3>
    <form class="staff-grid" id="staff-settings">
      <label>Booth name (stamped on each contact)<input name="booth" value="${esc(s.booth)}"></label>
      <label>Staff PIN<input name="pin" value="${esc(s.pin)}" inputmode="numeric" maxlength="8"></label>
      <label>Return to showcase after (s)<input name="idleSeconds" type="number" min="20" max="900" value="${s.idleSeconds}"></label>
      <label>Showcase pace<select name="slidePace">${[[0.75, 'Faster'], [1, 'Normal'], [1.35, 'Slower']].map(([v, n]) => `<option value="${v}"${+s.slidePace === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label>Look after idle<select name="skin"><option value="daylight"${s.skin === 'daylight' ? ' selected' : ''}>Daylight (regular)</option><option value="rising"${s.skin === 'rising' ? ' selected' : ''}>The Rising (Halloween)</option></select></label>
      <label>Wandering pumpkin<select name="pumpkins"><option value="true"${s.pumpkins ? ' selected' : ''}>On</option><option value="false"${s.pumpkins ? '' : ' selected'}>Off</option></select></label>
      <label style="grid-column: 1 / -1">Sync URL (optional — each contact is POSTed as JSON when online)<input name="syncUrl" type="url" value="${esc(s.syncUrl)}" placeholder="https://…"></label>
      <div class="staff-row"><button class="button button-primary button-small" type="submit">Save settings</button><span class="staff-note" id="staff-saved"></span></div>
    </form>

    <h3>Clear this tablet</h3>
    <div class="staff-row">
      <input id="staff-wipe-word" placeholder="Type DELETE" aria-label="Type DELETE to confirm" style="min-height:44px;padding:8px 10px;border:1.5px solid var(--line);border-radius:10px">
      <button class="button button-ghost button-small" data-wipe type="button">Delete all contacts</button>
      <span class="staff-note">Export first. This cannot be undone.</span>
    </div>`;
}

async function onPanelClick(event) {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.matches('[data-close]')) return dialog.close();
  const leads = await everyLead();
  const kind = target.dataset.export;
  if (kind === 'csv') return deliver(`hosun-leads-${stamp()}.csv`, 'text/csv;charset=utf-8', toCsv(leads));
  if (kind === 'vcf') return deliver(`hosun-leads-${stamp()}.vcf`, 'text/vcard;charset=utf-8', toVcard(leads));
  if (kind === 'json') return deliver(`hosun-leads-${stamp()}.json`, 'application/json', JSON.stringify(leads, null, 2));
  if (target.matches('[data-sync]')) { const { sent } = await syncLeads(); target.textContent = `Sent ${sent}`; return; }
  const msg = document.getElementById('staff-cache-msg');
  if (target.matches('[data-recache], [data-rebuild]')) {
    if (target.matches('[data-rebuild]')) await clearOffline();
    const result = await prepareOffline(({ done, total }) => { msg.textContent = `${done} / ${total}`; });
    msg.textContent = result.ok ? 'All files saved.' : `${result.missing} files could not be saved — check the connection and try again.`;
    return;
  }
  if (target.matches('[data-wipe]')) {
    if (document.getElementById('staff-wipe-word').value.trim() !== 'DELETE') return;
    await clearLeads();
    localStorage.removeItem('hosun-fair-unsaved');
    renderPanel();
  }
}

function onSettings(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  saveSettings({
    booth: data.booth.trim() || 'Canton Fair',
    pin: data.pin.trim() || settings().pin,
    idleSeconds: Math.max(20, +data.idleSeconds || 90),
    slidePace: +data.slidePace || 1,
    skin: data.skin,
    pumpkins: data.pumpkins === 'true',
    syncUrl: data.syncUrl.trim(),
  });
  document.getElementById('staff-saved').textContent = 'Saved.';
}

export function openStaff() {
  lock.hidden = false;
  panel.hidden = true;
  pinInput.value = '';
  pinMsg.textContent = '';
  dialog.showModal();
  pinInput.focus();
}

export function initStaff() {
  document.getElementById('staff-pin-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pinInput.value !== String(settings().pin)) {
      pinMsg.textContent = 'That PIN is not right.';
      pinInput.select();
      return;
    }
    lock.hidden = true;
    panel.hidden = false;
    await renderPanel();
  });
  lock.addEventListener('click', (event) => { if (event.target.closest('[data-close]')) dialog.close(); });
  panel.addEventListener('click', onPanelClick);
  panel.addEventListener('submit', onSettings);

  // hold a logo for two seconds — invisible to visitors, easy for staff
  let hold = 0;
  const start = (event) => {
    if (!event.target.closest('[data-staff-hold]')) return;
    hold = setTimeout(() => { hold = 0; openStaff(); }, 2000);
  };
  const cancel = () => { clearTimeout(hold); hold = 0; };
  document.addEventListener('pointerdown', start);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => document.addEventListener(type, cancel));
  // a logo held down must not also count as a tap that leaves the showreel
  document.addEventListener('contextmenu', (event) => { if (event.target.closest('[data-staff-hold]')) event.preventDefault(); });

  window.addEventListener('online', syncLeads);
  setInterval(syncLeads, 120000);
}
