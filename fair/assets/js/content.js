// Everything the kiosk says, in one place. Facts come from the approved
// HOSUN_spreads_v4.pdf, the English company deck, 广交会资料.xls, the two spec
// spreadsheets and the product .docx files in `canton fair/`. Change copy here,
// not in the templates.

export const img = (id) => `assets/img/${id}.webp`;

export const COMPANY = {
  names: ['Suzhou Hosun Machine Co., Ltd.', 'Suzhou Herstar Medical Technology Co., Ltd.'],
  namesZh: ['苏州市恒升机械有限公司', '苏州市恒而思达医疗科技有限公司'],
  taglines: [
    ['Strategic partner of Fortune Global 500 companies', '世界 500 强企业战略合作伙伴'],
    ['World-class CDMO platform for branded medical devices', '世界级品牌医疗器械 CDMO 平台'],
    ["Leading manufacturer of China's intelligent health and wellness solutions", '中国智慧康养设施设备领航缔造者'],
  ],
  phone: '+86 512 6625 9867',
  mobile: '+86 134 5155 8549',
  email: 'herstar@hosun.cn',
  web: 'www.hosunherstar.com',
  address: 'No. 37 Yaonan Road, Hengjing, Wuzhong District, Suzhou, Jiangsu, China',
};

export const STATS = [
  { figure: '2002', label: 'Founded in Suzhou', zh: '恒升机械成立' },
  { figure: '5 + 1', label: 'Manufacturing centres + R&D base', zh: '五大制造中心与一个研发基地' },
  { figure: '¥700M+', label: 'Annual revenue', zh: '年营收 7 亿元+' },
  { figure: '500+', label: 'Advanced machines in-house', zh: '先进设备 500+ 台' },
];

export const STORY = [
  'Founded in 2002, Suzhou Hosun Machine began with RMB 4,600, one machine and one worker. Twenty-four years on, it runs five manufacturing centres and an R&D base, serving customers across Europe, the Americas, Japan, Korea and Southeast Asia — including a cluster of Fortune Global 500 companies.',
  'In 2018 Hosun grew from contract machining into a high-end medical X-ray CDMO platform, combining R&D, design, manufacturing, regulatory certification and sales for global imaging leaders.',
  'In 2023 it launched Herstar, its own smart health-and-wellness brand: nursing beds, transfer robots and accessible-living products that give older people a complete, dignified way to live well at home and in care.',
];

export const DIVISIONS = [
  {
    id: 'parts', name: 'Hosun Intelligent Manufacturing', zh: '恒升智造', unit: 'Precision components',
    rows: [
      ['Focus', 'R&D and manufacturing of precision components'],
      ['Customers', 'Daikin, Toyota, BMW, ZF and other German and Japanese Fortune Global 500 groups'],
      ['Products', 'Precision moulds and parts, powder sintering, BMC resin — multi-process core components'],
    ],
    keywords: '24 years of precision · a benchmark in high-precision manufacturing',
  },
  {
    id: 'cdmo', name: 'Hengsirui', zh: '恒思瑞', unit: 'Medical imaging CDMO',
    rows: [
      ['Focus', 'One-stop platform for medical imaging products'],
      ['Service', 'AI-enabled 3D imaging CDMO for accurate three-dimensional diagnosis'],
      ['Products', 'Digital X-ray radiography'],
    ],
    keywords: 'CDMO · technology going global',
  },
  {
    id: 'care', name: 'Herstar', zh: '恒而思达', unit: 'Smart health & wellness',
    rows: [
      ['Focus', 'Our own smart health-and-wellness brand'],
      ['Goal', 'A world-class health and wellness brand'],
      ['Products', 'Smart nursing beds, transfer robots, smart desks and accessible-living aids'],
    ],
    keywords: 'Silver economy · accessibility · age-friendly design',
  },
];

export const FACTORIES = [
  { name: 'Precision parts', zh: '零部件工厂', area: '20,000 m²', note: 'Every mechanical process in-house; home-appliance, automotive and medical components.', image: 'factory/stamping-robot' },
  { name: 'Medical equipment', zh: '医疗器械工厂', area: '15,000 m²', note: '10+ production and assembly lines for high-end imaging equipment.', image: 'factory/c-arm-line' },
  { name: 'Smart care', zh: '智能康养产品工厂', area: '10,000 m²', note: '10+ lines from key components to finished beds, walkers, transfer robots and lifting systems.', image: 'factory/assembly-2' },
  { name: 'Painting', zh: '喷涂工厂', area: '5,000 m²', note: 'Two automated coating lines and six curing ovens, set up under Japanese expert guidance.', image: 'factory/painting-line' },
];

export const MILESTONES = [
  ['2002', 'Company founded', 'RMB 4,600, a 200 m² rented workshop, one machine and one worker taking on machining jobs.'],
  ['2004', 'First expansion', '1,200 m² and nine stamping presses; mould making and stamping added.'],
  ['2006', 'Factory No. 1', 'Precision parts — becomes a preferred supplier to Daikin, Toyota, BMW and ZF.'],
  ['2010', 'Factory No. 2', 'Medical parts and complete-machine contract manufacturing for high-end medical customers.'],
  ['2015', 'Painting plant', 'Guided by world-class experts; becomes the benchmark for coating in its sector.'],
  ['2017', 'Medical imaging', 'Enters medical imaging equipment — from high-end equipment towards a CDMO platform.'],
  ['2021', 'Health & wellness', 'R&D, production and sales of smart beds, chairs, aids and care robots.'],
  ['2025', 'Health industry park', 'An 80,000 m² digital smart factory begins — a new stage for Hosun.'],
  ['2027', 'New factory opens', 'Planned start of production at the new campus.'],
];

// `validUntil` hides a scan once its printed expiry has passed, so an expired
// certificate is never shown to a buyer. Update the date when a renewed scan
// replaces the file in canton fair/认证/ and rebuild the assets.
export const CERTIFICATES = [
  { id: 'iso-13485', standard: 'ISO 13485:2016', scope: 'Metal parts for medical devices', body: 'BSI', image: 'cert/iso-13485', validUntil: '2026-12-18' },
  { id: 'iso-9001', standard: 'ISO 9001:2015', scope: 'Metal stampings, machined parts and assembly', body: 'TÜV Rheinland', image: 'cert/iso-9001', validUntil: '2026-08-30' },
  { id: 'iatf-16949', standard: 'IATF 16949:2016', scope: 'Sensor brackets (automotive)', body: 'TÜV Rheinland', image: 'cert/iatf-16949', validUntil: '2026-08-22' },
  { id: 'iso-14001', standard: 'ISO 14001:2015', scope: 'General machining and related management', body: 'CQC / IQNET', image: 'cert/iso-14001', validUntil: '2026-10-09' },
  { id: 'fcc-sdoc', standard: 'FCC SDoC', scope: 'Supplier’s Declaration of Conformity — listed electric desk models', body: 'BCTC', image: 'cert/fcc-sdoc', validUntil: null },
];
// Systems named in the company deck without a scan in the fair folder.
export const OTHER_SYSTEMS = ['ISO 45001:2018', 'ISO 3834-2:2021', 'SA8000:2014'];

export const PARTNERS = [
  'daikin', 'toyota', 'viessmann', 'bmw', 'zf', 'philips', 'siemens', 'maquet', 'carestream', 'arjo',
  'paramount-bed', 'barco', 'vishee', 'kessebohmer', 'dewertokin', 'linak', 'suzhou-health', 'genertec', 'taikang', 'hubei-health',
].map((id) => ({ id, src: `assets/logos/${id}.png`, text: id === 'hubei-health' ? '湖北康养集团' : '' }));
export const PARTNER_LABELS = {
  daikin: 'Daikin', toyota: 'Toyota', viessmann: 'Viessmann', bmw: 'BMW', zf: 'ZF Group', philips: 'Philips',
  siemens: 'Siemens', maquet: 'Maquet — Getinge Group', carestream: 'Carestream', arjo: 'Arjo', 'paramount-bed': 'Paramount Bed',
  barco: 'Barco', vishee: 'Vishee', kessebohmer: 'Kesseböhmer', dewertokin: 'Dewert Okin', linak: 'Linak',
  'suzhou-health': 'Suzhou Health & Senior Care Group', genertec: 'Genertec Universal Medical', taikang: 'Taikang',
  'hubei-health': 'Hubei Health and Elderly Care Group',
};

export const CATEGORIES = [
  { id: 'featured', name: 'On show at the fair', zh: '展会重点' },
  { id: 'beds', name: 'Nursing beds', zh: '护理床系列' },
  { id: 'mobility', name: 'Transfer & mobility', zh: '移位与助行' },
  { id: 'bath', name: 'Bath & toilet', zh: '洗浴与如厕' },
  { id: 'home', name: 'Accessible kitchen & home', zh: '无障碍厨居' },
  { id: 'rehab', name: 'Rehab & facility care', zh: '康复与机构护理' },
  { id: 'desks', name: 'Desks & tables', zh: '升降桌系列' },
];

const BED_COMMON = [
  ['Safe working load', '220 kg'],
  ['Maximum user weight', '175 kg'],
  ['Motors', '29 V linear actuators, 6,000 N'],
  ['Protection', 'IPX4 · 50 dB in operation'],
  ['Frame', '≥ 2.0 mm carbon-steel profile, powder coated'],
];

const bed = (model, fn, images, rows) => ({
  id: model.toLowerCase(), cat: 'beds', model, name: `${fn}-function electric nursing bed`, zh: `${fn}功能电动护理床`,
  images, specs: [...rows, ...BED_COMMON],
});

export const PRODUCTS = [
  {
    id: 'transfer-robot', cat: 'featured', model: 'Brain-control + autonomous', name: 'Autonomous intelligent transfer robot', zh: '脑控 + 智驾机器人',
    lede: 'Moves a person between bed, wheelchair, toilet and sofa by itself — omni-wheel drive, LiDAR and 3D vision, and a lift that adapts to every height in between.',
    images: [], placeholder: 'On the stand — come and see it move.',
    specs: [
      ['Dimensions', '800 × 600 × 1400 mm'], ['Net weight', '75 kg'], ['Load capacity', '150 kg'],
      ['Lifting range', '30–80 cm (bed, wheelchair, toilet, sofa)'], ['Drive', 'Omni-wheel — turns on the spot, moves sideways'],
      ['Travel speed', '0.1–0.8 m/s'], ['Steps / gaps', '≤ 2 cm / ≤ 3 cm'], ['Operating time', '8–10 h · auto-docking charge'],
      ['Power', '48 V · 200 W · NMC or LiFePO₄ battery'], ['Safety', 'Electromagnetic + mechanical brakes, locks on power loss; stops on abnormal tilt or height change'],
      ['Sensors', 'Multi-line LiDAR, 3D vision, ultrasonic, anti-fall and pressure sensors'], ['Software', 'OTA updates'],
    ],
  },
  {
    id: 'ai-xray', cat: 'featured', model: 'Digital radiography', name: 'Multifunctional AI digital X-ray system', zh: '多功能 AI 数字摄影机',
    lede: 'A ceiling-suspended digital radiography system from our medical-imaging CDMO line, built for the world’s imaging brands.',
    images: ['film/xray-detector', 'factory/imaging-system', 'film/c-arm', 'factory/c-arm-line'],
    specs: [
      ['X-ray tube output', '≥ 3.5 kW'], ['Focal spot', '0.3 / 0.6 mm'], ['Tube voltage', '40–125 kV'],
      ['Detector pixel size', '≤ 154 μm'], ['Limiting resolution', '≥ 3.3 lp/mm'], ['C-arm rotation along track', '≥ 135°'], ['C-arm opening', '≥ 800 mm'],
    ],
  },
  {
    id: 'health-desk', cat: 'featured', model: 'Smart desk', name: 'Smart health-monitoring desk', zh: '智慧健康检测桌',
    lede: 'A height-adjustable desk that keeps an eye on respiration and heart rate while you work.',
    images: ['product/desk-health'],
    specs: [['Monitoring', 'Respiration · heart rate'], ['Base', 'Electric height-adjustable frame']],
  },

  bed('EM-2001', 2, ['product/em-2001-a', 'product/em-2001-b'], [
    ['Overall size', '2050 × 1050 × 450–560 mm'], ['Deck height', 'Three manual settings'], ['Back / thigh angle', '72° / 20°'],
    ['Handset', 'Wired, 6 buttons (back, legs, linked)'], ['Rails', 'Sliding rails with aluminium top'], ['Castors', '4 × 4″'], ['Head & foot boards', 'Multi-layer solid wood, quick release'],
  ]),
  bed('EM-2002', 2, ['product/em-2002-a', 'product/em-2002-b'], [
    ['Overall size', '2050 × 1000 × 400 mm'], ['Deck height', 'Three manual settings'], ['Back / thigh angle', '52° / 30°'],
    ['Handset', 'Wired, 6 buttons'], ['Rails', 'Steel insert rails'], ['Deck', 'Steel slats'], ['Head & foot boards', 'Multi-layer solid wood, quick release'],
  ]),
  bed('EM-3001', 3, ['product/em-3001-a', 'product/em-3001-b'], [
    ['Overall size', '2030 × 1020 × 315–640 mm'], ['Deck height', '350–650 mm'], ['Back / thigh angle', '72° / 20°'],
    ['Handset', 'Wired, 8 buttons incl. height'], ['Rails', 'Steel insert rails + rotating stand-assist rail (45° / 90° / 135°)'], ['Castors', '4 × 4″'], ['Head & foot boards', 'Solid wood or upholstered'],
  ]),
  bed('EM-3002', 3, ['product/em-3002-a', 'product/em-3002-b'], [
    ['Overall size', '2080 × 1030 × 315–640 mm'], ['Deck height', '400–700 mm'], ['Back / thigh angle', '70° / 25°'],
    ['Handset', 'Wired, 8 buttons incl. height'], ['Rails', 'Full-length wooden rails'], ['Castors', '4 × 4″'],
  ]),
  bed('EM-3003', 5, ['product/em-3003-a', 'product/em-3003-b'], [
    ['Overall size', '2100 × 1200 × 350–700 mm'], ['Deck height', '350–700 mm'], ['Back / thigh angle', '72° / 25°'],
    ['Handset', 'Wired, 8 buttons incl. height'], ['Rails', 'Steel insert rails'], ['Castors', '4 × 4″'],
  ]),
  bed('EM-5001', 5, ['product/em-5001-a', 'product/em-5001-b'], [
    ['Overall size', '2150 × 1050 × 200–750 mm'], ['Deck height', '200–750 mm'], ['Back / thigh angle', '72° / 40°'], ['Tilt', '± 12° head-down / head-up'],
    ['Handset', 'Wired, 12 buttons incl. tilt and one-touch CPR'], ['Rails', 'Two-position aluminium lift rails'], ['Castors', '8 × 3″'],
  ]),
  bed('EM-5002', 5, ['product/em-5002-b', 'product/em-5002-a'], [
    ['Overall size', '2230 × 1250 × 400–800 mm'], ['Deck height', '400–700 mm'], ['Back / thigh angle', '72° / 30°'], ['Tilt', '± 11° head-down / head-up'],
    ['Handset', 'Wired, 12 buttons incl. tilt and one-touch CPR'], ['Rails', 'Two-position aluminium lift rails'], ['Castors', '4 × 4″'],
  ]),

  {
    id: 'rw-01', cat: 'mobility', model: 'RW-01', name: 'Powered rollator', zh: '电动助行车',
    lede: 'Power assistance uphill, gentle braking downhill — sensors read the slope and the walking pace, and it stops by itself the moment the handles are released.',
    images: ['product/rollator', 'product/rollator-b', 'product/rollator-folded', 'product/rollator-dims', 'product/rollator-seat', 'product/rollator-stop', 'product/rollator-straight', 'product/rollator-downhill', 'product/rollator-uphill'],
    captions: { 'product/rollator-stop': 'Stops automatically when the handles are released', 'product/rollator-straight': 'Keeps a straight line without a tight grip', 'product/rollator-downhill': 'Automatic braking on the way down', 'product/rollator-uphill': 'Power assistance on the way up', 'product/rollator-seat': 'Seat 55 × 35 cm', 'product/rollator-folded': 'Folded' },
    specs: [['Weight', 'approx. 9 kg'], ['Load capacity', '100 kg · shopping bag up to 5 kg'], ['Assist & brake', '4 adjustable levels'], ['Battery', 'Lithium · 3 h charge for 4 h walking'], ['Slope', 'Climbs up to 7°'], ['Seat', '55 × 35 cm'], ['Prompts', 'Built-in voice reminders']],
  },
  {
    id: 'czk-021a', cat: 'mobility', model: 'CZK-021A-M13A', name: 'Assisted transfer device', zh: '电动移位机',
    lede: 'A compact stand-assist transfer with chest, underarm and leg supports — one carer moves a person safely between bed, chair and toilet.',
    images: ['product/transfer-device', 'product/transfer-device-b', 'product/transfer-device-views'],
    specs: [['Max. size', '1050 × 610 × 1220 mm'], ['Load capacity', '120 kg'], ['Net weight', '33 kg'], ['Battery', 'approx. 80 transfers per charge · > 6 h charge'], ['Input', '100–240 V AC, 50/60 Hz'], ['Turning circle', '1100 mm · fits doorways > 800 mm'], ['Protection', 'IPX4 splash-proof']],
  },
  {
    id: 'emhs-001', cat: 'mobility', model: 'EMHS-001', name: 'Powered patient hoist', zh: '自走式升降移位机',
    lede: 'Remote-controlled lifting with very little swing on the way up and down, so a person lands exactly where intended — even beside low beds.',
    images: ['product/hoist', 'product/hoist-b', 'product/hoist-room'],
    specs: [['Lifting height', '650–1860 mm'], ['Width', '680 mm legs closed · 1080 mm open'], ['Safe working load', '225 kg'], ['Ground clearance', '28 mm — slides under most care beds'], ['Control', 'Handheld remote']],
  },

  {
    id: 'bath-lift', cat: 'bath', model: 'Bath lift', name: 'Electric bath lift', zh: '电动升降洗澡椅',
    lede: 'Lowers a person into the bath and lifts them out again. Battery-powered and fully waterproof, it needs no installation in an ordinary tub.',
    images: ['product/bath-lift-a', 'product/bath-lift-b', 'product/bath-lift-c', 'product/bath-lift-views'],
    specs: [['Seat height', '60–480 mm'], ['Backrest', 'Reclines to 140°, locks when raised'], ['Rated load', '1400 N (approx. 140 kg)'], ['Protection', 'IPX8 (charger excepted)'], ['Power', 'Rechargeable lithium — cordless'], ['Safety', 'Low-battery lock (down only) · red emergency stop · 6 suction cups'], ['Storage', 'Tool-free split; folds to 163 mm']],
  },
  {
    id: 'toilet-lift', cat: 'bath', model: 'Toilet lift', name: 'Powered toilet lift', zh: '电动升降马桶椅',
    lede: 'One button raises and tilts the seat along the natural path of sitting down and standing up — stable even when weight shifts to one side.',
    images: ['product/toilet-lift', 'product/toilet-lift-b'],
    specs: [['Size', '564 × 630 × 707 mm'], ['Seat height', '415 mm'], ['Lift', '130 + 45 mm · tilt 0–13°'], ['Load', '135 kg'], ['Weight', '26.5 kg'], ['Power', '100–240 V, 50/60 Hz · thermal, over-current and short-circuit protection'], ['Protection', 'IPX4']],
  },
  {
    id: 'fx-8933-10', cat: 'bath', model: 'FX-8933-10', name: 'Folding shower chair', zh: '折叠洗澡椅',
    lede: 'Aluminium frame, warm soft-touch pads and a U-cut seat for easy personal care; folds flat when the bathroom is needed back.',
    images: ['product/shower-chair', 'product/shower-chair-scene', 'product/shower-chair-dims'],
    specs: [['Frame', 'Aluminium alloy, rust-resistant'], ['Seat & back', 'HDPE with soft anti-slip pads'], ['Seat height', '374–474 mm, adjustable'], ['Feet', 'Wide suction-cup feet'], ['Storage', 'Folds flat']],
  },
  {
    id: 'ut750', cat: 'bath', model: 'UT750', name: 'Height-adjustable basin', zh: '电动升降洗手台盆',
    lede: 'A wall-mounted basin with integrated grab handles that rises and lowers for standing users, children and wheelchair users alike.',
    images: ['product/basin-scene', 'product/basin-views', 'product/basin-models'],
    specs: [['Size', '750 × 550 mm'], ['Height range', '730–960 mm'], ['Mounting', 'Wall-mounted (floor-standing version available)'], ['Top', 'White solid top with grab handles']],
  },

  {
    id: 'lift-sink', cat: 'home', model: 'Kitchen sink', name: 'Height-adjustable kitchen sink', zh: '电动升降厨房水槽',
    lede: 'One touch brings the sink to a comfortable height — for every member of the family and for barrier-free kitchens.',
    images: ['product/sink', 'product/sink-kitchen', 'film/accessible-kitchen'],
    specs: [['Size', '1200 × 600 mm'], ['Height range', '700–950 mm'], ['Max. load', '1200 N'], ['Speed', '30 mm/s ± 10%'], ['Noise', '≤ 50 dB'], ['Protection', 'IP42']],
  },
  {
    id: 'lift-hob', cat: 'home', model: 'Cooktop', name: 'Height-adjustable hob', zh: '电动升降灶具',
    lede: 'The same lifting worktop with a built-in hob, so cooking happens at the right height for whoever is cooking.',
    images: ['product/hob', 'product/hob-b'],
    specs: [['Size', '1200 × 600 mm'], ['Height range', '700–950 mm'], ['Max. load', '1200 N'], ['Speed', '30 mm/s ± 10%']],
  },
  {
    id: 'cloud-ladder', cat: 'home', model: 'Cloud Ladder 134 / 190 / 256', name: 'Motorised cabinet lift', zh: '电动升降橱柜',
    lede: 'Brings wall-cabinet storage down to hand height at the press of a button — no more climbing for the spices.',
    images: ['product/cabinet-lift', 'product/cabinet-lift-photo', 'product/cabinet-lift-spices', 'product/cabinet-lift-glass'],
    specs: [['Fits cabinets', '350–900 mm wide · 700 mm high'], ['Depths', '134 / 190 / 256 mm models'], ['Mechanism height', '682 mm'], ['Load', '20 kg recommended'], ['Descent', 'approx. 8 s'], ['Options', 'Custom size and colour · voice, remote or smart-home control']],
  },
  {
    id: 'wardrobe-rail', cat: 'home', model: 'Wardrobe lift', name: 'Motorised wardrobe rail', zh: '电动升降挂衣杆',
    lede: 'A hanging rail that comes down on voice command or remote, with cushioned travel that is gentle on clothes.',
    images: ['product/wardrobe-rail', 'product/wardrobe-scene-1', 'product/wardrobe-scene-2'],
    specs: [['Control', 'Voice or remote'], ['Power', '100–240 V in · 12 V · 60 W'], ['Lighting', 'Both sides and underneath']],
  },

  {
    id: 'ankle-trainer', cat: 'rehab', model: 'Ankle CPM', name: 'Ankle rehabilitation trainer', zh: '踝关节康复训练器',
    lede: 'Active and passive ankle training for foot drop, sprains and post-fracture recovery, in a clinic or at home.',
    images: ['product/ankle-a', 'product/ankle-b', 'product/ankle-c', 'product/ankle-d', 'product/ankle-scene', 'film/ankle-trainer'],
    specs: [['Size', '300 × 150 × 400 mm'], ['Plantarflexion', '0–45° (± 5°)'], ['Dorsiflexion', '0–50° (± 5°)'], ['Supply', '12 V safety low voltage'], ['Frame', 'High-strength metal, ergonomic']],
  },
  {
    id: 'rm2', cat: 'rehab', model: 'RM2', name: 'Wheelchair wheel washer', zh: '轮椅车轮清洗机',
    lede: 'Push the wheelchair on, press the foot switch, and the wheels are scrubbed clean in one to two minutes — no kneeling, no scrubbing by hand.',
    images: ['product/wheel-washer', 'product/wheel-washer-b', 'product/wheel-washer-c'],
    specs: [['Size', '1160 × 430 × 275 mm'], ['Weight', '50 kg'], ['Power', '100 V · 60 W'], ['Cycle', '1–2 min per wheelchair (vs 10–15 min by hand)'], ['Fits', 'Self-propelled, attendant, manual and electric wheelchairs'], ['Control', 'Industrial foot switch — stops within 0.5 s']],
  },

  { id: 'desk-office', cat: 'desks', model: 'Electric · dual motor', name: 'Electric office desk', zh: '双电机办公升降桌', images: ['product/desk-office-dual', 'product/desk-office-dual-b'],
    specs: [['Load', '125 kg'], ['Height range', '650–1300 mm'], ['Speed', '35–40 mm/s'], ['Top', '1400 × 700 mm'], ['Noise', '< 45 dB'], ['Columns', '80 × 50 mm, Q235 steel']] },
  { id: 'desk-four-leg', cat: 'desks', model: 'Electric · four-leg', name: 'Four-leg office desk', zh: '四腿办公升降桌', images: ['product/desk-four-leg', 'product/desk-four-leg-views'], specs: [] },
  { id: 'desk-executive', cat: 'desks', model: 'Electric · L-return', name: 'Executive desk', zh: '升降经理桌', images: ['product/desk-executive', 'product/desk-office-wood', 'product/desk-office-wood-views'],
    specs: [['Load', '125 kg'], ['Height range', '650–1300 mm'], ['Top', '1400 × 700 mm'], ['Noise', '< 45 dB']] },
  { id: 'desk-gaming', cat: 'desks', model: 'Electric', name: 'Gaming desk', zh: '电竞升降桌', images: ['product/desk-gaming', 'product/desk-gaming-views'],
    specs: [['Load', '125 kg'], ['Height range', '710–1250 mm'], ['Speed', '35–40 mm/s'], ['Top', '1200 × 600 mm'], ['Noise', '< 45 dB']] },
  { id: 'desk-coffee', cat: 'desks', model: 'Electric', name: 'Electric coffee table', zh: '电动升降茶几', images: ['product/desk-coffee', 'product/desk-coffee-views'],
    specs: [['Load', '125 kg'], ['Height range', '400–760 mm'], ['Top', '1400 × 700 mm'], ['Noise', '< 45 dB']] },
  { id: 'desk-student', cat: 'desks', model: 'Electric', name: 'Student desk', zh: '学生升降桌', images: ['product/desk-student', 'product/desk-student-views'], specs: [] },
  { id: 'table-pneumatic', cat: 'desks', model: 'Pneumatic', name: 'Multi-function pneumatic table', zh: '多功能气动升降桌', images: ['product/table-pneumatic'],
    specs: [['Height range', '726–1050 mm'], ['Top', '400 × 700 mm'], ['Load', '30 kg static · 10 kg while lifting'], ['Use', 'Bedside, sofa-side or standing work']] },
  { id: 'table-tilting', cat: 'desks', model: 'Pneumatic', name: 'Tilting pneumatic table', zh: '可翻转气动升降桌', images: ['product/table-tilting', 'product/table-tilting-views'],
    specs: [['Height range', '726–1050 mm'], ['Top', '400 × 700 mm, multi-angle tilt'], ['Load', '30 kg static · 10 kg while lifting']] },
  { id: 'table-side', cat: 'desks', model: 'Pneumatic', name: 'Pneumatic side table', zh: '气动升降边桌', images: ['product/table-side'],
    specs: [['Height range', '726–1050 mm'], ['Top', '300 × 500 mm'], ['Load', '30 kg static · 10 kg while lifting']] },
  { id: 'table-overbed', cat: 'desks', model: 'Pneumatic', name: 'Overbed dining table', zh: '护理气动升降餐桌', images: ['product/table-overbed'],
    specs: [['Height range', '726–1105 mm'], ['Top', '800 × 400 mm'], ['Load', '30 kg static · 10 kg while lifting'], ['Use', 'Reading, meals in bed, standing work']] },
  { id: 'table-side-round', cat: 'desks', model: 'Pneumatic', name: 'Adjustable side table', zh: '灵活升降边桌', images: ['product/table-side-round'],
    specs: [['Height range', '315–530 mm'], ['Column', 'Ø 40 mm']] },
  { id: 'table-angled', cat: 'desks', model: 'Pneumatic', name: 'Angled-top pneumatic table', zh: '倾斜桌面气动桌', images: ['product/table-angled'], specs: [] },
];

// ---------------------------------------------------------------------------
// The showreel. Each scene names a template in showreel.js. `rising` swaps
// copy when the Halloween skin is on; anything without it is shared.
// ---------------------------------------------------------------------------
export const REEL = [
  { type: 'cover', seconds: 10 },
  { type: 'slogan', seconds: 7, bg: 'film/sunrise', en: 'Where the sun rises with power, Hosun rises with purpose.', zh: '旭日蓬勃，恒升致远',
    rising: { en: 'Everything rises tonight.', zh: '今夜，万物升起' } },
  { type: 'chapter', seconds: 5, theme: 'Precision manufacturing', zh: '精密智造', photos: [
    ['factory/stamping-robot', 'Robotic stamping cells'],
    ['factory/welding-robot', 'Robotic welding'],
    ['factory/machining', 'CNC machining hall'],
    ['film/precision', 'Machined to the micron'],
    ['factory/robot-arm-1', 'Automated handling'],
    ['factory/painting-line', 'Automated coating line'],
    ['factory/lifting-columns', 'Lifting columns in assembly'],
  ], rising: { theme: 'The night shift', zh: '夜班不停' } },
  { type: 'stats', seconds: 9 },
  { type: 'slogan', seconds: 7, bg: 'factory/history-wall', en: 'From RMB 4,600, one machine and one worker — to five manufacturing centres.', zh: '从 4600 元、一台机器、一名工人起步',
    rising: { en: '500+ machines. Not one of them afraid of the dark.', zh: '500 多台设备，没有一台怕黑' } },
  { type: 'chapter', seconds: 5, theme: 'Medical imaging CDMO', zh: '医疗影像 CDMO', photos: [
    ['film/c-arm', 'Digital radiography for global imaging brands'],
    ['film/xray-detector', 'Multifunctional AI digital X-ray system'],
    ['factory/c-arm-line', 'C-arm equipment in production'],
    ['factory/imaging-system', 'Ceiling-suspended DR system'],
  ], rising: { theme: 'We see right through it', zh: '一眼看穿' } },
  { type: 'spotlight', seconds: 11, product: 'ai-xray' },
  { type: 'film', seconds: 36 },
  { type: 'slogan', seconds: 7, bg: 'film/home-care', en: 'Age-friendly. Barrier-free. Built for the silver economy.', zh: '银发经济 · 无障碍 · 适老化',
    rising: { en: 'No tricks. Just tolerances.', zh: '不耍花招，只讲精度' } },
  { type: 'chapter', seconds: 5, theme: 'Herstar smart care', zh: '恒而思达 · 智慧康养', photos: [
    ['film/bed-studio-1', 'Electric nursing beds, made in our own halls'],
    ['film/bed-studio-2', 'Every smooth rise and fall'],
    ['film/home-care', 'Comfortable living at home'],
    ['factory/showroom-2', 'The Herstar showroom'],
  ], rising: { theme: 'Rise and shine', zh: '缓缓升起' } },
  { type: 'spotlight', seconds: 12, product: 'transfer-robot' },
  { type: 'spotlight', seconds: 10, product: 'em-5001' },
  { type: 'spotlight', seconds: 10, product: 'rw-01' },
  { type: 'spotlight', seconds: 10, product: 'bath-lift' },
  { type: 'chapter', seconds: 5, theme: 'Accessible living', zh: '无障碍生活', photos: [
    ['film/accessible-kitchen', 'Kitchens that come to you'],
    ['product/sink-kitchen', 'Height-adjustable sink'],
    ['product/cabinet-lift-photo', 'Cabinet lift, at hand height'],
    ['product/basin-scene', 'UT750 height-adjustable basin'],
    ['product/wardrobe-scene-1', 'Motorised wardrobe rail'],
    ['film/ankle-trainer', 'Ankle rehabilitation trainer'],
  ], rising: { theme: 'Lights out, shelves down', zh: '灯灭，柜降' } },
  { type: 'mosaic', seconds: 11, category: 'desks', title: 'Height-adjustable desks & tables', zh: '升降桌系列',
    rising: { title: 'Desks that rise after dark', zh: '入夜也会升起的桌子' } },
  { type: 'spotlight', seconds: 10, product: 'health-desk' },
  { type: 'certs', seconds: 10 },
  { type: 'partners', seconds: 10 },
  { type: 'timeline', seconds: 12 },
  { type: 'slogan', seconds: 8, bg: 'factory/new-campus', en: 'An 80,000 m² digital smart factory, opening 2027.', zh: '80,000 平方米数字化智慧工厂 · 2027 投产',
    rising: { en: 'Five factories. No ghosts in the supply chain.', zh: '五大工厂，供应链里没有幽灵' } },
  { type: 'cta', seconds: 10 },
];

export const FILM = {
  src: 'assets/video/film-1080.mp4',
  poster: 'film/sunrise',
  // the reel plays one of these windows per pass, in turn (seconds)
  segments: [[0, 36], [36, 72], [100, 136], [132, 168]],
};

export const RISING_LINES = {
  coverKicker: 'Halloween at the booth',
  cover: 'The Rising',
  coverSub: 'Lifting columns, nursing beds and desks — all rising after dark.',
  cta: 'Trick or treat? Leave your card.',
  ctaSub: 'We will follow up after the fair. No tricks.',
};
