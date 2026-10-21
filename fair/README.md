# HOSUN · HERSTAR — Canton Fair tablet kiosk

A self-contained site for the booth tablet. It loops a showreel of themed photo runs,
product spotlights and intercut slogans; any tap opens the full site; a contact form
collects business leads in ten languages. Everything — photos, fonts, both cuts of the brand film —
is saved on the tablet on first load, so the venue Wi-Fi can drop at any time.

Two looks:

- **Daylight** (default) — the approved brochure cover (`Image_20261020221117_701_268.png`)
  and `HOSUN_spreads_v4.pdf`: peach-to-sun gradient, ghosted HOSUN letters, the H mark as a
  watermark, white spec cards ruled in sun orange.
- **The Rising** (hidden Halloween skin) — the B2C campaign's night palette and three neons
  (`b2c/assets/css/halloween.css`). Visitors find it through a small pumpkin that peeks in
  from a screen edge every 35–80 s, or the pumpkin button at the end of the showreel's button
  bar, in the site header and in the footer. It flips back to daylight when the booth goes idle
  (configurable).

## Where the words and pictures come from

- **Every line is English with its Chinese**, on the site and in the showreel.
- **Company copy is word for word from `canton fair/物料/恒升介绍英文版.pptx`**: the cover is
  slide 1, rebuilt in HTML at the slide's proportions with the slide's own logo images (its
  title font, Douyin Sans, isn't available to browsers, so the nearest bold sans faces stand
  in). About us = slide 2, Core Business = slide 3 (the group is presented by line of
  business — Precision Parts, Health & Wellness, Medical Imaging — not by company),
  milestones = slide 4, Business Philosophy = slide 5, Major Customers order = slide 6,
  certificates = slide 7, ISO 3834-2 and the welders (its own row) = slide 8, factories =
  slides 9–12, contact and the four social-media QR codes = slide 18. The browsing cover and
  the showreel's opening scene are both slide 1, on the artwork in `canton fair/产品/cover.pdf`.
- **The brand film** comes in two cuts: English (`恒而思达英文版2026.m4v`, 3:03) plays by
  default in the showreel and on the page; visitors can switch the page's player to the
  Chinese cut (`恒而思达中文版2026.m4v`, 2:48).
  Slide 12's English says “6 bread production facilities” (面包房 = curing ovens); it is
  reproduced as written — correct it in the deck and in `content.js` together.
- Product copy comes from 广交会资料.xls, the spec sheets and the product .docx files.
- Customer logos are full colour, from slide 6 and `canton fair/logo/`, ordered as on slide 6
  with the newer logos joining the row of their kind (industrial, medical imaging, care
  equipment, lifting systems, care groups). Hubei Health and Elderly Care Group is left out.

## Run it locally

```bash
python3 -m http.server 8791 --directory .   # from the repository root
```

Open **http://localhost:8791/fair/**. Add `?debug` to get `window.fair.reel.jump(n)` for
stepping through scenes. The service worker (offline copy) only works over `https://` or
`localhost` — not over a LAN IP such as `http://192.168.x.x`.

## Put it on the tablet

It is published with the other sites by `.github/workflows/pages.yml` at `<pages-url>/fair/`.

**iPad (recommended)**

1. On good Wi-Fi, open the `/fair/` URL in Safari and wait for *“Everything is saved on this
   tablet.”* (~102 MB, most of it the two films).
2. Share → **Add to Home Screen**. Open it from the Home Screen icon — it runs full screen,
   and Safari protects a Home Screen app's storage from automatic clean-up. **The Home Screen
   app has its own storage**, so let it finish downloading once more when you first open it.
3. Settings → Display & Brightness → Auto-Lock → **Never**. Settings → Accessibility →
   **Guided Access** on; triple-click the side button inside the app to lock the tablet to it.
4. Turn on Airplane Mode to prove it: close and reopen the app — it should start normally.

**Android tablet** — open in Chrome, wait for the saved message, ⋮ → **Install app**. The
first touch also requests full screen. Use *App pinning* to lock it.

The page keeps the screen awake with the Screen Wake Lock API where the browser allows it.

## Staff panel

**Hold either logo for two seconds**, enter the PIN (**2002** until you change it — change it
on day one). The panel shows:

- **Contacts on this tablet** — export as **CSV** (opens in Excel with Chinese/Arabic intact;
  formula-injection safe), **vCard** (imports straight into iPhone Contacts / Outlook, business
  card photo attached) or **JSON** (everything, including card photos). On an iPad the share
  sheet opens, so AirDrop or Mail works. **Export at the end of every day** — leads live only
  on the tablet unless a sync URL is set.
- **Offline copy** — files saved, version, whether storage is protected; buttons to fetch
  updates or re-download everything.
- **Settings** — booth name (stamped on every lead, so two tablets can be told apart), PIN,
  idle timeout (default 90 s), showreel pace, which look to return to after idle, wandering
  pumpkin on/off, optional **sync URL** (each lead is POSTed as JSON when online, then marked
  synced).
- **Delete all contacts** — type `DELETE` first.

## The contact form

- Ten interface languages: English, 简体中文, Español, Français, Português, Русский, العربية
  (right-to-left), Deutsch, 日本語, 한국어. Copy is in `assets/js/form-i18n.js` and is
  **machine-assisted — have native speakers check it** before the fair.
- Country list is localised by the browser (`Intl.DisplayNames`) and sorted in the visitor's
  language; picking a country presets its E.164 calling code. Hong Kong, Macao and Taiwan are
  shown as regions of China.
- One full-name field (not first/last), email **or** phone required, optional messaging app
  (WhatsApp, WeChat, Telegram, LINE, Viber, KakaoTalk, Zalo, Signal), business type, interests,
  next step, yearly volume, reply language, message, and a **business-card photo** taken with
  the tablet camera (resized to 1600 px).
- Consent is required; the exact consent sentence the visitor saw, in their language, is
  stored with the lead.
- Saved to IndexedDB on the tablet. When a visitor walks away the booth returns to the
  showreel after the idle timeout (10-second warning) and the form is wiped.

## Changing content

All copy, specs and the showreel playlist are in **`assets/js/content.js`**. After editing
anything under `fair/`, run:

```bash
python3 fair/tools/build_precache.py
```

That re-hashes every file; tablets pick up the new version the next time they start online
(and reload themselves once).

Images, logos, icons and the films are generated from the untracked source material at the
repository root (`canton fair/`, `HOSUN_spreads_v4.pdf`, and `1.png` / `C-arm-xray.jpg` — the
transfer-robot and X-ray feature photos):

```bash
python3 -m venv .venv && .venv/bin/pip install Pillow pillow-heif python-pptx opencv-python-headless
.venv/bin/python fair/tools/build_assets.py          # add --film to re-encode both films
python3 fair/tools/build_precache.py
```

Needs `ffmpeg` and poppler (`pdfimages`, `pdftocairo`).

## Before the fair — open items

1. **ISO 13485 runs out on 2026-12-18.** Slide 7's copy expired in 2020, so the site shows the
   folder scan instead. The other certificates are the slide 7 versions (IATF 16949 to
   2029-08-08, ISO 9001 to 2029-08-30, ISO 14001 to 2029-09-27, ISO 45001 to 2028-12-01,
   SA8000 to 2028-09-22). Any scan past its `validUntil` date in `content.js` hides itself.
2. **Product photos that are AI-generated or AI-edited** in the client folder (file names say
   so): powered toilet lift (`Gemini_Generated_Image_*`), one folding-shower-chair image, and two
   hoist images (`图片生成与修改*`). Confirm these may be shown to buyers as product photos.
3. **“6 bread production facilities”** on the painting factory card — see above.
4. **Slide 8’s scans are out of date.** The ISO 3834 certificate reads “valid until
   September 18, 2022” and the eight welder certificates also end in 2022. They are shown
   because the deck shows them; set `WELDING.show = false` in `content.js` to hide the row,
   or drop renewed scans into the deck and rebuild.
5. **EM-5001** — the spec sheet calls it OMB-5001 (the spread flags this too).
6. **Desk names ↔ images** were paired by matching the spread’s layout; check the coffee table,
   executive desk and the pneumatic tables.
7. **Translations** of the contact form need a native read (see above); the site's Chinese for
   product details was written from the Chinese source documents.
8. **Change the staff PIN** and the booth name on each tablet.
