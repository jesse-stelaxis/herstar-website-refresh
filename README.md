# Herstar website prototypes

This repository now contains two standalone, English-language landing pages:

- `b2b/` — overseas manufacturing and capabilities story
- `b2c/` — bright consumer standing-desk and movement story

The B2C landing page is available locally at **http://localhost:8787/b2c/**.

- `fair/` — offline-first Canton Fair booth tablet: showreel, explorable site, multilingual lead form,
  hidden Halloween skin. See **`fair/README.md`**.

## B2B prototype

A static design prototype for the overseas B2B site of **Suzhou Herstar / 苏州市恒升机械有限公司**.
Its job is to settle the visual direction and the scroll narrative before any of it is rebuilt
in Next.js + Payload. It is deliberately not a framework app yet.

## Run it

```bash
python3 -m http.server 8787 --directory /Users/jy3643/Code/business/herstar
```

Then open **http://localhost:8787/b2b/**

A server is required — `dissect.js` is an ES module and browsers block module imports over
`file://`. Port 8787 is used because 8080 is already taken on this machine.

## Layout

```
b2b/
  index.html              the page
  assets/css/site.css     design system + all layout
  assets/js/dissect.js    three.js exploded lifting column, scroll-driven
  assets/js/site.js       scroll reveals, form stub
  assets/img/             20 key visuals x 3 widths x jpg+webp
  vendor/three.module.js  three r160, vendored so the page has no network deps but fonts
```

## The scroll arc

Dark-dominant and image-first. Graphite `#0C1211` is the ground; photography carries the tone.
Each chapter is a full-bleed image with an overlaid headline, a short paragraph and at most one
button — the SpaceX pattern. Panels that overlap the image edge, the stat band and the capability
carousel are the WEIMA layer.

| # | Chapter | Image | Text side |
|---|---------|-------|-----------|
| 00 | Hero — *Every column leaves here measured* | Robot press cell | left, full viewport height |
| — | Stat band | — | overlaps the hero by ~96 px |
| 01 | **What we make — three lines of business** | pillar cards | — |
| 02 | Measurement — *Measured, not assumed* | CMM probe, red lasers | right |
| — | Metrology trio | Height gauge · laser scanner · dial gauge | — |
| 03 | Construction | the 3D dissection | right |
| 04 | Repeatability — *March and October leave identical* | Automated assembly | left |
| 05 | Manufacturing — **the seven 制造中心** | horizontal card carousel | — |
| 06 | Scale — *Four factories on the shore of Lake Tai* + **the four factories** | Machining hall | right |
| 06 | Campus | Aerial, soft scrim | chips |
| 07 | Forming — *Where tolerance survives, or quietly disappears* | Grinding sparks | left |
| 08 | Responsibility — *The people who make it* | Portrait, then **paper inversion** | left |
| 09 | **Certified since 2009** | six badges + the timeline | — |
| 10 | Quote | RFQ form | — |

**The one light section is deliberate.** Section 07 inverts to paper so the people get the light
in an otherwise dark site. If you want it dark like everything else, drop `on-paper` from that
section's class list — it is a one-word change.

Workers appear in only three places, so they read as genuine rather than as stock staffing.

## The two motifs

**The rule.** A millimetre scale, ticks every 8 px with a major every 48 px. It runs as the fixed
`.spine` down the left edge of every page (with an amber mark that tracks scroll position and the
current chapter number), under the bottom of every chapter, above every stat, above every pledge,
and as the footer dividers. One class, `.rule`, plus `.spine`.

**The net.** Measured off their own banner tile: pure black, **3 px pitch at 45°**, one line at
alpha 0.37 followed by two at 0.10. It is deliberately *restrained* — it appears in exactly three
places and nowhere else:

| Where | Token |
|---|---|
| Nav bar | `--net-light` |
| Buttons — ghost and solid | `--net-light` / `--net-spark` |
| The 3D dissection ground | `--net-light` |

It is no longer applied to photography, cards, the stat band, the certificate table or the footer.
`--net-spark` is a softened variant for the amber button, because the full-strength net over amber
reads as hazard striping.

## The three pillars

hosun.cn's 产品中心 names three lines of business. Only one of them is desk components, and the
other two are why the desk components are any good. All three now appear as section 01:

| Pillar | Evidence |
|---|---|
| Precision components | Stamping, machining, welding for appliance/automotive/industrial customers; 25–400 T presses |
| High-end medical | Complete-machine assembly for medical imaging; 20,000 m² factory; ISO 13485 since 2018 |
| Intelligent lifting systems | Lifting columns and desk frames; 10,000 m² factory since 2015 |

**The prototype is English-only.** The source terms are 精密零部件 / 高端医疗 / 智能升降系统 for the
pillars and 冲压 · 钣金 · 焊接 · 机加工 · 组装 · 喷涂 · 检测 for the centres; they come back as the
`zh` locale when Payload localisation lands in P3, not as decoration on the English page.

The seven process centres and the four factories
(15,000 + 10,000 + 20,000 + 5,000 = **50,000 m²**) are also theirs, from hosun.cn/factory.html —
they replace the eight processes and three plants I had previously invented.

## Certification marks — read before sourcing logos

**ISO does not license its logo to certified organisations.** ISO performs no certification and
permits no one to use its logo in connection with certification, so an "ISO 9001" roundel on this
site would be a misuse. The mark a certified company may display is its **certification body's**
(TÜV, SGS, BSI, DNV, …), and only while the certificate is live — displaying a lapsed or suspended
mark is misrepresentation.

We do not yet know which body issued each of these six certificates. So section 09 uses typographic
badges we control, each with a correctly-sized dashed slot for the issuer's mark. Fill the slots
once the certificates arrive; do not substitute ISO logos.

## Motion

All of it derives from one idea — measurement — so the page reads as an instrument rather than
as a set of effects. Every item below is disabled under `prefers-reduced-motion`.

| Effect | Where | How |
|---|---|---|
| **Gauge sweep** | stat band | Each stat's tick scale draws left-to-right via `clip-path`, an amber 2 px mark sweeps across it and fades out at the right, and the number counts up. Staggered 110 ms per stat. |
| **Rule draw** | every `.rule`, chapter rules, pledges, factory cards, timeline | `clip-path: inset(0 100% 0 0)` → `inset(0)` on reveal. The scale is laid down rather than just appearing. |
| **Parallax** | chapter photography | Images are 114% tall with 7% headroom and drift ±27 px against the scroll. One shared `requestAnimationFrame`, only for chapters currently intersecting. |
| **Copy settle** | chapter overlays | `.chapter-col` children rise and fade in sequence, 90 ms apart, when the chapter enters. |
| **Card stagger** | pillars, certificate badges, timeline items | Sequential reveal, up to 610 ms across the eight timeline entries. |
| **Spine trail** | left edge | The amber mark leaves a gradient trail behind it as it descends. |
| **Nav condense** | header | Drops to 50 px and goes near-opaque past 120 px of scroll. |

The scroll handler, the spine, the nav state and the parallax all share a single rAF frame; the
reveals and counters are IntersectionObserver-driven and unobserve themselves after firing.

## The dissection

`assets/js/dissect.js` builds a three-stage lifting column from primitives — three hollow
rounded-rectangular extrusions, a ground spindle with a helical thread, a nut, gearbox, motor,
foot and top plates with real bolt holes, and four POM glide pads per telescopic interface.

Four scroll phases: assembled → exploded → re-nested with the overlap bracketed in amber →
tubes ghosted while the drive train withdraws. Metal is lit by an IBL probe pre-filtered from a
small emissive "studio" built as geometry; a plain gradient probe renders fully-metallic
surfaces black, which is worth knowing if you touch the lighting. The darkest anodising is
lifted to `#41474A` and a warm kicker light added, so the model does not vanish into the
near-black ground it now sits on.

Falls back to a still image when WebGL is unavailable (`.no-webgl`), and honours
`prefers-reduced-motion` by dropping the scroll smoothing.

## What is real and what is not

**Verified from the client's own sites — safe to keep**

| Fact | Source |
|---|---|
| Founded 2002, by Lake Tai, Suzhou | hosun.cn/about.html |
| IATF 16949, ISO 13485, ISO 3834-2, ISO 45001:2018, SA8000:2014 | hosun.cn/about.html |
| Provincial High-Tech Enterprise | hosun.cn/about.html |
| Four factories: 15,000 / 10,000 / 20,000 / 5,000 m² = 50,000 m² | hosun.cn/factory.html |
| Seven process centres, named | hosun.cn navigation |
| Three lines of business | hosun.cn 产品中心 |
| Founded with ¥4,600, one machine, one worker | hosun.cn/about.html |
| Certification years: 2009 / 2018 / 2019 / 2022 | hosun.cn/about.html 发展历程 |
| Address: No. 37 Yaonan Road, Hengjing, Wuzhong, Suzhou | hosun.cn footer |
| Email lusia@hosun.cn · Fax +86 512 6630 1073 | hosun.cn footer |
| Profile sizes 60×90, 50×80, 70×70, ⌀70 mm; 2- and 3-stage | hosunherstar.com product names |
| 22 catalogue SKUs across 3 families | hosunherstar.com/products.html |
| Employee improvement-suggestion scheme | hosun.cn/zeren.html |

**Placeholders — marked `°` in the page, and listed in the footer**

- A direct telephone number. hosun.cn publishes only a fax number and one email address.
- "Fortune Global 500 customers" — claimed on hosun.cn; confirm which may be named.
- Every certification body, certificate number and expiry date (the badge slots in section 09).
- `<0.3%` return rate — published with no stated basis. Needs period, population and definition.
- `90 mm` overlap, section lengths, stroke — representative geometry in the 3D model, not drawing values.
- "audit findings available under NDA" — confirm this is actually true before publishing.
- ISO 9001, ISO 14001, EN 527, BIFMA X5.5, UL/cUL, CE/UKCA, RoHS/REACH — all marked *to confirm*.
- Every certificate number, issuing body and expiry date.
- Factory address and telephone. The live site currently shows a US number and a
  third-party email (`contact@intelli-opus.com`); neither is used here.

**Imagery**

All 20 images are frames recovered from the client's own corporate film on hosun.cn, scene-detected
and cropped free of their burned-in bilingual subtitles (true picture area is `1280x552 @ y=82`).
They are 720p source and are **placeholder-grade** — good for atmosphere on a dark ground, not good
enough for a product page or print.

> **Do not reuse the rest of that film.** Roughly the first third is licensed stock footage
> (semiconductor wafers, surgical theatres, robot hands, city time-lapses). None of it may be
> presented as this factory. Everything in `assets/img/` was hand-picked to exclude it, and also
> excludes the film's Party and union sequences, which would work against the site's Western audience.

## Porting to Next.js + Payload

The design system in `site.css` is already token-first, so it lifts into `packages/ui` largely as-is.
`index.html` maps to a route-group page; the `<picture>` blocks become `next/image`; the RFQ form
becomes a server action writing to the `inquiries` collection. `dissect.js` moves into a client
component with a `dynamic(..., { ssr: false })` boundary. Keep `vendor/three.module.js` out of it and
install `three` from npm instead.

## Before this is shown to a customer

1. Delete the `.proto` bar in `index.html`.
2. Delete every `<span class="vf">°</span>` marker and the `.vf` rule in `site.css`.
3. Delete the `.foot-legal` paragraph.
4. Replace all imagery per the asset guide — full-bleed chapters need real 3840 px-wide
   photography. The current chapter masters are 1920 px lanczos upscales of 1280 px frames
   and will not hold up on a large display.
5. Add a mobile navigation menu. Below 960 px the nav links are hidden and only the brand and
   the quote button remain.
