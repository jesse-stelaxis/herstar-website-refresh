// Everything the kiosk says, in one place, always as an English–Chinese pair.
// Company copy is word for word from the English company deck
// (canton fair/物料/恒升介绍英文版.pptx): taglines (slide 1), About us (2),
// Core Business (3), milestones (4), Business Philosophy (5), customers (6),
// certification (7), welders (8), factories (9–12) and contact (18).
// Product copy comes from 广交会资料.xls, the two spec sheets and the product
// .docx files. Change copy here, not in the templates.

export const img = (id) => `assets/img/${id}.webp`;

// A bilingual value is { en, zh } or a two-item array [en, zh].
export const en = (v) => (Array.isArray(v) ? v[0] : typeof v === 'object' && v ? v.en : v);
export const zh = (v) => (Array.isArray(v) ? v[1] : typeof v === 'object' && v ? v.zh : v);

export const COMPANY = {
  names: ['Suzhou Hosun Machine Co., Ltd.', 'Suzhou Herstar Medical Technology Co., Ltd.'],
  namesZh: ['苏州市恒升机械有限公司', '苏州市恒而思达医疗科技有限公司'],
  group: ['The Hosun Group', '恒升集团'],
  taglines: [
    ['Long-term supplier of critical components for Fortune Global 500 companies', '世界 500 强企业关键部件长期供应商'],
    ['World-class CDMO platform for manufacturing medical devices', '世界级品牌医疗器械 CDMO 代工平台'],
    ['Pioneer in developing intelligent healthcare facilities and equipment in China', '中国智慧康养设施设备领航缔造者'],
  ],
  phones: ['0512-66259867', '13506132528', '13862091917'],
  emails: ['Herstar@hosun.cn', 'Lusia@hosun.cn'],
  webs: ['www.hosunherstar.com', 'www.hosun.cn'],
  address: ['No. 37 Yaonan Road, Hengjing, Wuzhong Economic Development Zone, Suzhou, Jiangsu, China', '中国江苏省苏州市吴中区经济开发区横泾尧南路37号'],
  // slide 18 — Social Media Accounts / 社交媒体账号, with the slide's QR codes
  social: [
    ['WeChat Official Account', '微信公众号', '@恒而思达', 'qr/wechat-official'],
    ['WeChat Channels', '微信视频号', '@恒升-恒而思达', 'qr/wechat-channels'],
    ['Douyin', '企业抖音号', '@恒升-恒而思达', 'qr/douyin'],
    ['JD.com flagship store', '京东旗舰店', '@Herstar恒而思达家具官方旗舰店', 'qr/jd'],
  ],
};

export const STATS = [
  { figure: '2002', label: ['Company Founded', '公司成立'] },
  { figure: '5 + 1', label: ['Five manufacturing centers and one R&D base', '五大制造中心与一个研发基地'] },
  { figure: '80,000', unit: 'm²', label: ['New digital smart factory, in operation from 2027', '数字化智慧新工厂 · 2027 年投产'] },
  { figure: '500+', label: ['Units of advanced equipment', '先进设备数量'] },
];

// slide 2 — About us / 公司概况
export const ABOUT = {
  en: [
    'Founded in 2002, Suzhou Hosun Machine Co., Ltd. began with just RMB 4,600, one machine, and one employee. After 24 years of innovation and growth, Hosun now operates five manufacturing centers and one R&D base, serving markets across Europe, the Americas, Japan, South Korea, and Southeast Asia.',
    'In 2018, Hosun evolved into a high-end medical imaging CDMO platform, integrating R&D, design, manufacturing, regulatory certification, and sales to serve global medical imaging leaders. In 2023, Hosun expanded into smart healthcare and elderly care, launching Herstar. Through innovative products such as smart nursing beds and patient transfer robots, Herstar provides integrated elderly care solutions, aspiring to become a leading provider of elderly care equipment in China.',
  ],
  zh: [
    '苏州恒升机械成立于2002年，以4600元资金、一台机器、一名工人艰难起步。历经24年不懈奋斗，如今我们坐拥五大制造中心与一个研发基地，客户遍及欧美、日韩及东南亚，汇聚了世界500强客户集群。',
    '2018年，恒升已从单一加工制造转型为集研发、设计、制造、注册认证及销售于一体的高端医疗X射线CDMO平台企业，服务全球医疗影像巨头。2023年，我们重磅布局智慧康养，倾力打造中国一流康养品牌‘恒而思达’。通过智能护理床、移位机器人等创新产品，为长者提供‘适老、享老’一站式解决方案，立志成为中国康养设施设备的领航缔造者。',
  ],
};

// slide 3 — Core Business / 核心业务. The group is presented by line of
// business, not by company.
export const CORE_BUSINESS = [
  {
    id: 'parts', name: ['Precision Parts', '零部件板块'],
    rows: [
      [['Core Positioning', '核心定位'], ['R&D and Manufacturing of Precision Components', '精密零部件研发&制造']],
      [['Customers', '服务客户'], ['Global Fortune 500 conglomerates including Daikin, Toyota, and Bosch from Germany and Japan', '大金、丰田、博世等德系日系世界500强集群']],
      [['Core Products', '核心产品'], ['Core components utilizing various manufacturing processes such as precision molds and products, powder sintering, and BMC resins', '精密模具及产品、粉末烧结、BMC树脂等多工艺核心部件']],
      [['Keywords', '关键词'], ['24 Years of Expertise – A Benchmark in High-Precision Manufacturing', '24年技术沉淀高精密制造标杆']],
    ],
  },
  {
    id: 'care', name: ['Health & Wellness', '康养板块'],
    rows: [
      [['Core Positioning', '核心定位'], ['Smart Health & Wellness Brand', '智慧康养自主品牌']],
      [['Vision', '愿景'], ['Become a world-class health and wellness brand', '成为世界一流康养品牌']],
      [['Core Products', '核心产品'], ['nursing beds, transfer robots, and intelligent rehabilitation assistive device series', '智能护理床、移位机器人、智能康复辅具系列产品']],
      [['Keywords', '关键词'], ['Silver Economy, Accessibility, Age-Inclusive Design', '银发经济、无障碍、适老化']],
    ],
  },
  {
    id: 'cdmo', name: ['Medical Imaging', 'CDMO板块'],
    rows: [
      [['Core Positioning', '核心定位'], ['One-stop platform for medical imaging products', '医疗影像产品一站式平台']],
      [['Profession', '业务'], ['Providing AI-powered one-stop CDMO services for 3D imaging to enable accurate three-dimensional diagnosis and treatment.', '提供AI赋能的3D影像一站式CDMO服务，助力实现三维精准诊疗']],
      [['Core Products', '核心产品'], ['Digital X-ray Imaging Products', '数字化X射线摄影产品']],
      [['Keywords', '关键词'], ['Technologies going Global', 'CDMO技术出海']],
    ],
  },
];

// slide 5 — Business Philosophy / 经营理念
export const PHILOSOPHY = [
  { title: ['Mission', '使命'],
    en: 'Striving to bring material and spiritual well-being to all employees, delivering excellence through meticulous craftsmanship and sincere service to ensure complete customer satisfaction, while contributing to the development and progress of the nation and society.',
    zh: '追求全体员工物质与精神两方面的幸福，匠心智造与至诚服务，让客户完全满意，同时为国家与社会的发展进步作出贡献！' },
  { title: ['Vision', '愿景'],
    en: 'To become a world-class enterprise in precision machinery manufacturing, and strive diligently for the development of China’s national industry.',
    zh: '成为世界一流的精密机械智造企业，为中国民族工业的发展而努力奋斗。' },
  { title: ['Guidelines', '方针'],
    en: 'Passion First: Uphold commitments 100%, deliver 100% professional dedication. Quality Supreme: Ensure flawless quality to fully satisfy customers. Well-being Prioritized: Safety and health come first, with sustainable ecological development.',
    zh: '热情第一：百分之百信守承诺，百分之百专业专注。品质至上：让品质完美无缺，让客户完全满意。安康优先：安全健康至高无上，生态环保和谐发展。' },
];

// slides 9–12, word for word (including the deck's own English)
export const FACTORIES = [
  { name: ['Precision Parts', '零部件工厂'], area: '20,000㎡', image: 'factory/stamping-robot',
    en: 'Covering an area of 20,000㎡ Full-process manufacturing using various mechanical processes 500+ units of advanced equipment',
    zh: '占地20,000㎡ · 机械各工艺全链内做 · 先进设备数量500+',
    products: ['Main Products: Home appliance components Automotive components Medical components', '主要产品：家电零部件 · 汽车零部件 · 医疗零部件'] },
  { name: ['Medical Equipment', '医疗器械工厂'], area: '15,000㎡', image: 'factory/c-arm-line',
    en: 'Covering an area of 15,000㎡ With 10+ production and assembly lines',
    zh: '占地15,000㎡ · 生产组装线数量10+',
    products: ['Main products: High-end medical imaging equipment', '主要产品：高端影像设备'] },
  { name: ['Smart Healthcare', '智能康养产品工厂'], area: '10,000㎡', image: 'factory/lifting-columns',
    en: 'Covering an area of 10,000㎡ With 10+ assembly production lines ranging from key components to complete units',
    zh: '占地10,000㎡ · 从关键部件到整机组装生产线10+',
    products: ['Main products: Smart electric hospital beds, Intelligent walking aids, Transfer robots, High-end lifting systems for cabinets, sinks, toilets, and more', '主要产品：智能电动护理床、智能助行器、移位机器人、智能升降橱柜、台盆、马桶、等高端升降系统'] },
  { name: ['Painting', '喷涂工厂'], area: '5,000㎡', image: 'factory/painting',
    en: 'Covering an area of 5,000㎡ · 2 automated spraying lines · 6 bread production facilities · Guided by Japanese experts · At the industry’s cutting-edge level',
    zh: '占地5,000㎡ · 自动喷涂线2条 · 面包房6座 · 日本专家指导 · 行业先进水平',
    products: ['Main products: Surface spraying of metal components', '主要产品：金属部件表面喷涂'] },
];

// slide 4 — The Hosun Group Development History
export const MILESTONES = [
  ['2002', 'Company Founded', '公司成立'],
  ['2004', 'First Expansion', '第一次规模扩大'],
  ['2006', 'Factory No.1 Built', '一号工厂成立'],
  ['2010', 'Factory No. 2 Built', '二号工厂成立'],
  ['2015', 'Painting Factory Built', '喷涂厂成立'],
  ['2017', 'Entering the manufacturing of medical imaging equipment', '进入医疗影像设备智造'],
  ['2021', 'Entering the Senior Care Industry', '进入康养产业'],
  ['2025', 'CDMO Technologies going Global', 'CDMO技术出海'],
  ['2027', 'New Health and Wellness Industrial Park put into Operation', '新工厂投产'],
];

// slide 7 — Certification, in the deck's order except that ISO 45001 sits before ISO 13485. Scans are the deck's English
// set, except ISO 13485 (the deck's copy expired in 2020; the folder scan runs
// to 2026-12-18). `validUntil` hides a scan once its printed expiry passes.
export const CERTIFICATES = [
  { id: 'iatf-16949', standard: 'IATF 16949:2016', body: 'TÜV Rheinland', image: 'cert/iatf-16949', validUntil: '2029-08-08',
    scope: ['Manufacture of sensor brackets, excluding product design', '传感器支架的制造，不包括产品设计'] },
  { id: 'iso-9001', standard: 'ISO 9001:2015', body: 'TÜV Rheinland', image: 'cert/iso-9001', validUntil: '2029-08-30',
    scope: ['Manufacturing of metal stamping parts; manufacturing and assembly of mechanical parts', '金属冲压件的制造、机械零部件的制造和装配'] },
  { id: 'iso-14001', standard: 'ISO 14001:2015', body: 'CQC · IQNet', image: 'cert/iso-14001', validUntil: '2029-09-27',
    scope: ['General machine manufacture and related management activities', '一般机械加工及相关管理活动'] },
  { id: 'iso-45001', standard: 'ISO 45001:2018', body: 'CQC · IQNet', image: 'cert/iso-45001', validUntil: '2028-12-01',
    scope: ['Lifting tables (electric lifting systems), medical equipment parts, home-appliance stampings and related management activities', '升降桌（电动升降系统）、医疗设备零部件、家电冲压件的生产及相关管理活动'] },
  { id: 'iso-13485', standard: 'ISO 13485:2016', body: 'BSI', image: 'cert/iso-13485', validUntil: '2026-12-18',
    scope: ['Manufacture of metal parts for medical devices', '医疗器械金属零部件制造'] },
  { id: 'sa8000', standard: 'SA8000:2014', body: 'IQNet · CQC', image: 'cert/sa8000', validUntil: '2028-09-22',
    scope: ['Social responsibility management system', '社会责任管理体系'] },
  { id: 'fcc-sdoc', standard: 'FCC SDoC', body: 'BCTC', image: 'cert/fcc-sdoc', validUntil: null,
    scope: ['Supplier’s Declaration of Conformity — listed electric desk models', '指定型号电动升降桌符合性声明'] },
];

// slide 8 — Welders / 国际焊接认证. ISO 3834-2 covers the company's welding
// and the people who do it, so it gets a row of its own rather than a card.
// NOTE: the scans on slide 8 carry printed expiry dates in 2022 (the ISO 3834
// certificate: "valid until September 18, 2022"). Set `show: false` to hide the
// row, or replace the scans in the deck and rebuild.
export const WELDING = {
  show: true,
  standard: 'ISO 3834-2:2021',
  title: ['Welders', '国际焊接认证'],
  certificate: 'cert/iso-3834',
  welders: ['cert/welder-1', 'cert/welder-2', 'cert/welder-3', 'cert/welder-4', 'cert/welder-5', 'cert/welder-6', 'cert/welder-7', 'cert/welder-8'],
  team: [['International Welding Engineer', '国际焊接工程师', '1'], ['International Welder', '国际焊工', '9'], ['Reserve International Welder', '储备国际焊工', '12']],
};

// slide 6 — Major Customers, in the deck's order; logos from the newer logo
// folder join the row of their kind. Full-colour files in assets/logos/partners/.
export const PARTNERS = [
  ['daikin', 'Daikin', 'png'], ['toyota', 'Toyota', 'png'], ['viessmann', 'Viessmann', 'svg'], ['bmw', 'BMW', 'svg'],
  ['zf', 'ZF Group', 'png'], ['mitsubishi-electric', 'Mitsubishi Electric', 'png'], ['emerson', 'Emerson', 'png'],
  ['assa-abloy', 'ASSA ABLOY', 'png'], ['wolf', 'WOLF', 'png'], ['aichi', 'AICHI Corporation', 'png'], ['fujikoki', 'Fujikoki', 'png'],
  ['philips', 'Philips', 'png'], ['siemens', 'Siemens', 'png'], ['maquet', 'Maquet — Getinge Group', 'png'], ['carestream', 'Carestream', 'png'],
  ['nuctech', 'Nuctech 威视', 'png'], ['meyer', 'Meyer 美亚光电', 'svg'], ['perlove', 'Perlove Medical 普爱医疗', 'png'], ['getein', 'Getein Biotech 基蛋生物', 'png'],
  ['arjo', 'Arjo', 'png'], ['paramount-bed', 'Paramount Bed', 'png'], ['barco', 'Barco', 'png'], ['vishee', 'Vishee 伟思', 'png'],
  ['kessebohmer', 'Kesseböhmer', 'png'], ['dewertokin', 'Dewert Okin', 'svg'], ['linak', 'Linak', 'png'],
  ['suzhou-health', 'Suzhou Health & Senior Care Group 苏州康养集团', 'png'], ['genertec', 'Genertec Universal Medical 通用技术环球医疗', 'png'],
  ['taikang', 'Taikang 泰康', 'png'],
  ['jbinfo', 'JBINFO 青鸟软通', 'png'],
].map(([id, label, ext, text]) => ({ id, label, src: `assets/logos/partners/${id}.${ext}`, text: text ?? '' }));

export const CATEGORIES = [
  { id: 'featured', name: ['On show at the fair', '展会重点'] },
  { id: 'beds', name: ['Nursing beds', '护理床系列'] },
  { id: 'mobility', name: ['Transfer & mobility', '移位与助行'] },
  { id: 'bath', name: ['Bath & toilet', '洗浴与如厕'] },
  { id: 'home', name: ['Accessible kitchen & home', '无障碍厨居'] },
  { id: 'rehab', name: ['Rehab & facility care', '康复与机构护理'] },
  { id: 'desks', name: ['Smart Lifting Desks', '智能升降桌'] },
];

// spec rows: [label en, label zh, value en, value zh — omit when the same]
const BED_COMMON = [
  ['Safe working load', '安全使用负重', '220 kg'],
  ['Maximum user weight', '使用者体重上限', '175 kg'],
  ['Motors', '电机规格', '29 V · 6,000 N linear actuators', '29V · 6000N 推杆电机'],
  ['Protection · noise', '防水等级 · 运转噪音', 'IPX4 · 50 dB'],
  ['Frame', '床体框架', '≥ 2.0 mm carbon-steel profile, powder coated', '≥2.0mm 优质碳钢型材，粉体涂装'],
];
const HANDSET_6 = ['Handset', '手控器', 'Wired, 6 buttons', '线控，6 个按钮'];
const HANDSET_8 = ['Handset', '手控器', 'Wired, 8 buttons incl. height', '线控，8 个按钮（含床面高度）'];
const HANDSET_12 = ['Handset', '手控器', 'Wired, 12 buttons incl. tilt and one-touch CPR', '线控，12 个按钮（含前后倾斜、CPR 一键复位）'];
const CASTORS_4 = ['Castors', '脚轮', '4 × 4″', '4 寸脚轮 × 4'];
const LIFT_RAILS = ['Side rails', '护栏', 'Two-position aluminium lift rails', '二档提拉铝合金护栏'];

const bed = (model, fn, images, rows) => ({
  id: model.toLowerCase(), cat: 'beds', model, name: [`${fn}-function electric nursing bed`, `${fn}功能电动护理床`],
  images, specs: [...rows, ...BED_COMMON],
});

const ELECTRIC_DESK = (range, top) => [
  ['Load', '额定承重', '125 kg'], ['Height range', '升降高度', range], ['Speed', '升降速度', '35–40 mm/s'],
  ['Top', '桌面尺寸', top], ['Noise', '运行噪音', '< 45 dB'], ['Columns', '立柱', '80 × 50 mm, Q235 steel', '80 × 50 mm，Q235 碳素钢'],
];
const PNEUMATIC_LOAD = ['Load', '承重', '30 kg static · 10 kg while lifting', '静态 30 kg · 动态 10 kg'];

export const PRODUCTS = [
  {
    id: 'transfer-robot', cat: 'featured', model: ['Brain-control + autonomous', '脑控 + 智驾'],
    name: ['Autonomous intelligent transfer robot', '脑控 + 智驾机器人'],
    lede: ['Moves a person between bed, wheelchair, toilet and sofa by itself — omni-wheel drive, LiDAR and 3D vision, and a lift that adapts to every height in between.',
      '自主完成床、轮椅、马桶与沙发之间的移位——全向轮驱动、激光雷达与3D视觉，升降行程适配各种高度差。'],
    images: ['product/transfer-robot'],
    specs: [
      ['Dimensions', '外形尺寸', '800 × 600 × 1400 mm'], ['Net weight', '自身重量', '75 kg'], ['Load capacity', '承重能力', '150 kg'],
      ['Lifting range', '升降行程', '30–80 cm (bed, wheelchair, toilet, sofa)', '30–80 cm（适配床、轮椅、马桶、沙发等高差）'],
      ['Drive', '驱动方式', 'Omni-wheel — rotates in place, moves sideways', '全向轮电机驱动，可原地旋转、横向移动'],
      ['Travel speed', '行进速度', '0.1–0.8 m/s'], ['Steps / gaps', '越障能力', '≤ 2 cm / ≤ 3 cm', '≤2 cm 台阶 / ≤3 cm 缝隙'],
      ['Operating time', '续航时间', '8–10 h · auto-docking charge', '8–10 小时 · 自动回充'],
      ['Power', '电气参数', '48 V · 200 W · NMC or LiFePO₄ battery', '48V · 200W · 三元锂 / 磷酸铁锂电池'],
      ['Safety', '安全', 'Electromagnetic + mechanical brakes, locks on power loss; stops on abnormal tilt or height change', '电磁 + 机械双刹车，断电即锁；异常倾斜或高度变化立即停止并锁死'],
      ['Sensors', '传感器', 'Multi-line LiDAR, 3D vision, ultrasonic, anti-fall and pressure sensors', '多线激光雷达、3D 视觉、超声、防跌落及压力传感器'],
      ['Software', '软件', 'OTA updates', '支持 OTA 在线升级'],
    ],
  },
  {
    id: 'ai-xray', cat: 'featured', model: ['Digital radiography', '数字化 X 射线摄影'], name: ['Multifunctional AI digital X-ray system', '多功能 AI 数字摄影机'],
    lede: ['A digital X-ray system from our medical imaging CDMO platform, built for the world’s imaging brands.', '来自恒升医疗影像 CDMO 平台的数字化 X 射线摄影系统，服务全球医疗影像品牌。'],
    images: ['product/xray-c-arm', 'film/xray-detector', 'factory/imaging-system', 'film/c-arm', 'factory/c-arm-line'],
    specs: [
      ['X-ray tube output', 'X 射线球管最大输出功率', '≥ 3.5 kW'], ['Focal spot', '焦点尺寸', '0.3 / 0.6 mm'], ['Tube voltage', '管电压范围', '40–125 kV'],
      ['Detector pixel size', '平板探测器像素尺寸', '≤ 154 μm'], ['Limiting resolution', '极限空间分辨率', '≥ 3.3 lp/mm'],
      ['C-arm rotation along track', 'C 臂沿轨道旋转角', '≥ 135°'], ['C-arm opening', 'C 臂开口距离', '≥ 800 mm'],
    ],
  },
  {
    id: 'health-desk', cat: 'featured', model: ['Smart desk', '智能升降桌'], name: ['Smart health-monitoring desk', '智慧健康检测桌'],
    lede: ['A height-adjustable desk that keeps an eye on respiration and heart rate while you work.', '一张关注呼吸与心率的智能升降桌。'],
    images: ['product/desk-health'], sceneThumb: true,
    specs: [['Monitoring', '监测', 'Respiration · heart rate', '呼吸 · 心率'], ['Base', '桌架', 'Electric height-adjustable frame', '电动升降桌架']],
  },

  bed('EM-2001', 2, ['product/em-2001-a', 'product/em-2001-b'], [
    ['Overall size', '床外围尺寸', '2050 × 1050 × 450–560 mm'], ['Deck height', '床面离地高度', 'Three manual settings', '三段手动调节'],
    ['Back / thigh angle', '背板 / 大腿倾角', '72° / 20°'], HANDSET_6, ['Side rails', '护栏', 'Sliding rails with aluminium top', '推拉式护栏，顶部铝合金'],
    CASTORS_4, ['Head & foot boards', '床头床尾板', 'Multi-layer solid wood, quick release', '多层实木，可快速拆卸'],
  ]),
  bed('EM-2002', 2, ['product/em-2002-a', 'product/em-2002-b'], [
    ['Overall size', '床外围尺寸', '2050 × 1000 × 400 mm'], ['Deck height', '床面离地高度', 'Three manual settings', '三段手动调节'],
    ['Back / thigh angle', '背板 / 大腿倾角', '52° / 30°'], HANDSET_6, ['Side rails', '护栏', 'Steel insert rails', '钢制插入式护栏'],
    ['Deck', '床板', 'Steel slats, powder coated', '钢制条状，粉体涂装'], ['Head & foot boards', '床头床尾板', 'Multi-layer solid wood, quick release', '多层实木，可快速拆卸'],
  ]),
  bed('EM-3001', 3, ['product/em-3001-a', 'product/em-3001-b'], [
    ['Overall size', '床外围尺寸', '2030 × 1020 × 315–640 mm'], ['Deck height', '床面离地高度', '350–650 mm'], ['Back / thigh angle', '背板 / 大腿倾角', '72° / 20°'],
    HANDSET_8, ['Side rails', '护栏', 'Steel insert rails + rotating stand-assist rail (45° / 90° / 135°)', '钢制插入式护栏 + 助立可旋转护栏（45°/90°/135°）'],
    CASTORS_4, ['Head & foot boards', '床头床尾板', 'Solid wood or upholstered', '多层实木 / 布皮软包可选'],
  ]),
  bed('EM-3002', 3, ['product/em-3002-a', 'product/em-3002-b'], [
    ['Overall size', '床外围尺寸', '2080 × 1030 × 315–640 mm'], ['Deck height', '床面离地高度', '400–700 mm'], ['Back / thigh angle', '背板 / 大腿倾角', '70° / 25°'],
    HANDSET_8, ['Side rails', '护栏', 'Full-length wooden rails', '全封闭式木制护栏'], CASTORS_4,
  ]),
  bed('EM-3003', 5, ['product/em-3003-a', 'product/em-3003-b'], [
    ['Overall size', '床外围尺寸', '2100 × 1200 × 350–700 mm'], ['Deck height', '床面离地高度', '350–700 mm'], ['Back / thigh angle', '背板 / 大腿倾角', '72° / 25°'],
    HANDSET_8, ['Side rails', '护栏', 'Steel insert rails', '钢制插入式护栏'], CASTORS_4,
  ]),
  bed('EM-5001', 5, ['product/em-5001-a', 'product/em-5001-b'], [
    ['Overall size', '床外围尺寸', '2150 × 1050 × 200–750 mm'], ['Deck height', '床面离地高度', '200–750 mm'], ['Back / thigh angle', '背板 / 大腿倾角', '72° / 40°'],
    ['Tilt', '前后倾斜', '± 12° head-down / head-up', '± 12° 头低脚高 / 头高脚低'], HANDSET_12, LIFT_RAILS, ['Castors', '脚轮', '8 × 3″', '3 寸脚轮 × 8'],
  ]),
  bed('EM-5002', 5, ['product/em-5002-b', 'product/em-5002-a'], [
    ['Overall size', '床外围尺寸', '2230 × 1250 × 400–800 mm'], ['Deck height', '床面离地高度', '400–700 mm'], ['Back / thigh angle', '背板 / 大腿倾角', '72° / 30°'],
    ['Tilt', '前后倾斜', '± 11° head-down / head-up', '± 11° 头低脚高 / 头高脚低'], HANDSET_12, LIFT_RAILS, CASTORS_4,
  ]),

  {
    id: 'rw-01', cat: 'mobility', model: 'RW-01', name: ['Powered rollator', '电动助行车'],
    lede: ['Power assistance uphill, gentle braking downhill — sensors read the slope and the walking pace, and it stops by itself the moment the handles are released.',
      '电动助力，上坡舒心，下坡放心——传感器感知路面与步行速度，松开把手即自动停止。'],
    images: ['product/rollator', 'product/rollator-b', 'product/rollator-folded', 'product/rollator-dims', 'product/rollator-seat', 'product/rollator-stop', 'product/rollator-straight', 'product/rollator-downhill', 'product/rollator-uphill'],
    captions: {
      'product/rollator-stop': ['Stops automatically when the handles are released', '手松开后自动停止'],
      'product/rollator-straight': ['Keeps a straight line without a tight grip', '无需紧握把手即可稳定前行'],
      'product/rollator-downhill': ['Automatic braking on the way down', '自动刹车，移步下坡'],
      'product/rollator-uphill': ['Power assistance on the way up', '自动助力，轻松上坡'],
      'product/rollator-seat': ['Seat 55 × 35 cm', '座面尺寸 宽 55 深 35 cm'],
      'product/rollator-folded': ['Folded', '折叠状态'],
    },
    specs: [
      ['Weight', '重量', 'approx. 9 kg', '约 9 kg'], ['Load capacity', '耐荷重', '100 kg · shopping bag up to 5 kg', '100 kg · 购物袋最大 5 kg'],
      ['Assist & brake', '助力与刹车', '4 adjustable levels', '4 段可调'], ['Battery', '电池', 'Lithium · 3 h charge for 4 h walking', '锂电池 · 充电 3 小时，可连续步行 4 小时'],
      ['Slope', '实用爬坡性能', 'Climbs slopes up to 7°', '倾斜 7°'], ['Seat', '座面尺寸', '55 × 35 cm'], ['Prompts', '语音提醒', 'Built-in voice reminders', '自带语音提醒'],
    ],
  },
  {
    id: 'czk-021a', cat: 'mobility', model: 'CZK-021A-M13A', name: ['Assisted transfer device', '电动移位机'],
    lede: ['A compact stand-assist transfer with chest, underarm and leg supports — one carer moves a person safely between bed, chair and toilet.',
      '集胸托、腋托、腿托于一体的紧凑型移位机，一位护理人员即可安全完成床、椅、马桶之间的移位。'],
    images: ['product/transfer-device-single', 'product/transfer-device', 'product/transfer-device-b', 'product/transfer-device-views'],
    specs: [
      ['Max. size', '最大尺寸', '1050 × 610 × 1220 mm'], ['Load capacity', '最大承重', '120 kg'], ['Net weight', '整机净重', '33 kg'],
      ['Battery', '续航', 'approx. 80 transfers per charge · > 6 h charge', '满电约 80 次 · 充电 > 6 小时'], ['Input', '输入电压', '100–240 V AC, 50/60 Hz'],
      ['Turning circle', '回转直径', '1100 mm · fits doorways > 800 mm', '1100 mm · 建议通行宽度 > 800 mm'], ['Protection', '防水等级', 'IPX4 splash-proof', 'IPX4 防溅'],
    ],
  },
  {
    id: 'emhs-001', cat: 'mobility', model: 'EMHS-001', name: ['Powered patient hoist', '自走式升降移位机'],
    lede: ['Remote-controlled lifting with very little swing on the way up and down, so a person lands exactly where intended — even beside low beds.',
      '遥控操作，起吊与落座过程移动幅度小、落座精准，适配包括低床在内的各类护理床。'],
    images: ['product/hoist', 'product/hoist-b', 'product/hoist-room'],
    specs: [
      ['Lifting height', '提升高度', '650–1860 mm'], ['Width', '外部宽度', '680 mm legs closed · 1080 mm open', '腿关闭 680 mm · 打开 1080 mm'],
      ['Safe working load', '最大安全负荷', '225 kg'], ['Ground clearance', '底盘离地高度', '28 mm — slides under most care beds', '28 mm，适配各类护理床'], ['Control', '操作方式', 'Handheld remote', '遥控器'],
    ],
  },

  {
    id: 'bath-lift', cat: 'bath', model: ['Bath lift', '浴缸升降椅'], name: ['Electric bath lift', '电动升降洗澡椅'],
    lede: ['Lowers a person into the bath and lifts them out again. Battery-powered and fully waterproof, it needs no installation in an ordinary tub.',
      '协助使用者安全进出浴缸。纯锂电池无线供电、整机深度防水，普通浴缸无需改造即可使用。'],
    images: ['product/bath-lift-a', 'product/bath-lift-b', 'product/bath-lift-c', 'product/bath-lift-views'],
    specs: [
      ['Seat height', '座面升降高度', '60–480 mm'], ['Backrest', '椅背', 'Reclines to 140°, locks when raised', '最大后仰 140°，升起时自动锁定'],
      ['Rated load', '额定负载', '1400 N (approx. 140 kg)', '1400 N（约 140 kg）'], ['Protection', '防水等级', 'IPX8 (charger excepted)', 'IPX8（充电器除外）'],
      ['Power', '供电', 'Rechargeable lithium — cordless', '可充电锂电池，无线供电'],
      ['Safety', '安全防护', 'Low-battery lock (down only) · red emergency stop · 6 suction cups', '低电量保护（仅可下降）· 红色急停按钮 · 6 个强力吸盘'],
      ['Storage', '收纳', 'Tool-free split; folds to 163 mm', '免工具拆装，折叠后厚 163 mm'],
    ],
  },
  {
    id: 'toilet-lift', cat: 'bath', model: ['Toilet lift', '马桶升降椅'], name: ['Powered toilet lift', '电动升降马桶椅'],
    lede: ['One button raises and tilts the seat along the natural path of sitting down and standing up — stable even when weight shifts to one side.',
      '一键升降与倾斜，顺应起身与落座的自然路径；重心偏向一侧也稳固不侧翻。'],
    images: ['product/toilet-lift', 'product/toilet-lift-b'],
    specs: [
      ['Size', '尺寸', '564 × 630 × 707 mm'], ['Seat height', '座板高', '415 mm'], ['Lift · tilt', '抬升 · 倾斜', '130 + 45 mm · 0–13°'],
      ['Load', '载荷', '135 kg'], ['Weight', '产品重量', '26.5 kg'],
      ['Power', '电源', '100–240 V, 50/60 Hz · thermal, over-current and short-circuit protection', '100–240V，50/60Hz · 过热、过流、短路保护'], ['Protection', '防护等级', 'IPX4'],
    ],
  },
  {
    id: 'fx-8933-10', cat: 'bath', model: 'FX-8933-10', name: ['Folding shower chair', '折叠洗澡椅'],
    lede: ['Aluminium frame, warm soft-touch pads and a U-cut seat for easy personal care; folds flat when the bathroom is needed back.',
      '铝合金车架、亲肤防滑软垫与 U 型开孔座面，方便私密清洁；不用时可折叠收纳。'],
    images: ['product/shower-chair', 'product/shower-chair-scene', 'product/shower-chair-dims'],
    specs: [
      ['Frame', '主体框架', 'Aluminium alloy, rust-resistant', '铝合金，防锈耐腐蚀'], ['Seat & back', '座板与靠背', 'HDPE with soft anti-slip pads', 'HDPE，配防滑软垫'],
      ['Seat height', '座面高度', '374–474 mm, adjustable', '374–474 mm 可调'], ['Feet', '脚垫', 'Wide suction-cup feet', '宽大吸盘式防滑脚垫'], ['Storage', '收纳', 'Folds flat', '可折叠平放'],
    ],
  },
  {
    id: 'ut750', cat: 'bath', model: 'UT750', name: ['Height-adjustable basin', '电动升降洗手台盆'],
    lede: ['A wall-mounted basin with integrated grab handles that rises and lowers for standing users, children and wheelchair users alike.',
      '挂墙式电动升降台盆，集成安全扶手，可根据身高或轮椅需求自由调节台面高度。'],
    images: ['product/basin', 'product/basin-scene', 'product/basin-views', 'product/basin-models'],
    specs: [
      ['Size', '外形尺寸', '750 × 550 mm'], ['Height range', '高度调节范围', '730–960 mm'],
      ['Mounting', '安装方式', 'Wall-mounted (floor-standing version available)', '挂墙式（另有落地款）'], ['Top', '台面', 'White top with grab handles', '白色台面，带扶手'],
    ],
  },

  {
    id: 'lift-sink', cat: 'home', model: ['Kitchen sink', '厨房水槽'], name: ['Height-adjustable kitchen sink', '电动升降厨房水槽'],
    lede: ['One touch brings the sink to a comfortable height — for every member of the family and for barrier-free kitchens.', '一键调节至舒适高度，适合不同身高的家庭成员及无障碍厨房。'],
    images: ['product/sink', 'product/sink-kitchen', 'film/accessible-kitchen'],
    specs: [
      ['Size', '外形尺寸', '1200 × 600 mm'], ['Height range', '升降行程', '700–950 mm'], ['Max. load', '最大负载', '1200 N'],
      ['Speed', '额定速度', '30 mm/s ± 10%'], ['Noise', '运行噪音', '≤ 50 dB'], ['Protection', '防水等级', 'IP42'],
    ],
  },
  {
    id: 'lift-hob', cat: 'home', model: ['Cooktop', '灶具'], name: ['Height-adjustable hob', '电动升降灶具'],
    lede: ['The same lifting worktop with a built-in hob, so cooking happens at the right height for whoever is cooking.', '同样的升降台面集成灶具，让每位掌勺人都在合适的高度烹饪。'],
    images: ['product/hob', 'product/hob-b'],
    specs: [['Size', '外形尺寸', '1200 × 600 mm'], ['Height range', '升降行程', '700–950 mm'], ['Max. load', '最大负载', '1200 N'], ['Speed', '额定速度', '30 mm/s ± 10%']],
  },
  {
    id: 'cloud-ladder', cat: 'home', model: ['Cloud Ladder 134 / 190 / 256', '云梯 134 / 190 / 256'], name: ['Motorised cabinet lift', '电动升降橱柜'],
    lede: ['Brings wall-cabinet storage down to hand height at the press of a button — no more climbing for the spices.', '一键将吊柜内的厨具与调料平稳降至最佳使用高度，告别登高取物。'],
    images: ['product/cabinet-lift', 'product/cabinet-lift-photo', 'product/cabinet-lift-spices', 'product/cabinet-lift-glass'],
    specs: [
      ['Fits cabinets', '适配柜体', '350–900 mm wide · 700 mm high', '宽 350–900 mm · 高 700 mm'], ['Depths', '机器规格', '134 / 190 / 256 mm models', '云梯 134 / 190 / 256'],
      ['Mechanism height', '机器高度', '682 mm'], ['Load', '承重', '20 kg recommended', '20 kg（建议值）'], ['Descent', '下降时间', 'approx. 8 s', '约 8 秒'],
      ['Options', '定制服务', 'Custom size and colour · voice, remote or smart-home control', '尺寸与颜色可定制 · 支持语音 / 遥控 / 涂鸦智能'],
    ],
  },
  {
    id: 'wardrobe-rail', cat: 'home', model: ['Wardrobe lift', '衣柜升降'], name: ['Motorised wardrobe rail', '电动升降挂衣杆'],
    lede: ['A hanging rail that comes down on voice command or remote, with cushioned travel that is gentle on clothes.', '支持语音与遥控操作，带缓冲机制，升降平稳顺滑，保护衣物。'],
    images: ['product/wardrobe-rail', 'product/wardrobe-scene-1', 'product/wardrobe-scene-2'],
    specs: [['Control', '操作方式', 'Voice or remote', '语音或遥控'], ['Power', '电源', '100–240 V in · 12 V · 60 W', '输入 100–240V · 输出 12V · 60W'], ['Lighting', '灯光位置', 'Both sides and underneath', '两侧 + 底部']],
  },

  {
    id: 'ankle-trainer', cat: 'rehab', model: ['Ankle CPM', '踝关节训练'], name: ['Ankle rehabilitation trainer', '踝关节康复训练器'],
    lede: ['Active and passive ankle training for foot drop, sprains and post-fracture recovery, in a clinic or at home.', '针对足下垂、踝关节扭伤、骨折术后等康复需求，支持主动与被动训练，适用于医院与家庭。'],
    images: ['product/ankle-a', 'product/ankle-b', 'product/ankle-c', 'product/ankle-d', 'product/ankle-scene', 'film/ankle-trainer'],
    specs: [
      ['Size', '产品尺寸', '300 × 150 × 400 mm'], ['Plantarflexion', '跖屈角度', '0–45° (± 5°)'], ['Dorsiflexion', '背屈角度', '0–50° (± 5°)'],
      ['Supply', '工作电压', '12 V safety low voltage', '12V 安全低压'], ['Frame', '框架', 'High-strength metal, ergonomic', '高强度金属人体工学框架'],
    ],
  },
  {
    id: 'rm2', cat: 'rehab', model: 'RM2', name: ['Wheelchair wheel washer', '轮椅车轮清洗机'],
    lede: ['Push the wheelchair on, press the foot switch, and the wheels are scrubbed clean in one to two minutes — no kneeling, no scrubbing by hand.', '推上轮椅、踩下脚踏，1–2 分钟即可完成车轮刷洗，告别蹲地手工清洗。'],
    images: ['product/wheel-washer', 'product/wheel-washer-b', 'product/wheel-washer-c'],
    specs: [
      ['Size', '外形尺寸', '1160 × 430 × 275 mm'], ['Weight', '整机重量', '50 kg'], ['Power', '电源', '100 V · 60 W'],
      ['Cycle', '单台耗时', '1–2 min per wheelchair (vs 10–15 min by hand)', '1–2 分钟 / 台（人工 10–15 分钟）'],
      ['Fits', '适用轮椅', 'Self-propelled, attendant, manual and electric wheelchairs', '自助式、护理用、手推式、电动式'],
      ['Control', '操作', 'Industrial foot switch — stops within 0.5 s', '工业脚踏开关，0.5 秒内停止'],
    ],
  },

  { id: 'desk-office', cat: 'desks', model: ['Electric · dual motor', '电动 · 双电机'], name: ['Electric office desk', '双电机办公升降桌'],
    images: ['product/desk-office-dual', 'product/desk-office-dual-b'], specs: ELECTRIC_DESK('650–1300 mm', '1400 × 700 mm') },
  { id: 'desk-four-leg', cat: 'desks', model: ['Electric · four-leg', '电动 · 四腿'], name: ['Four-leg office desk', '四腿办公升降桌'],
    images: ['product/desk-four-leg', 'product/desk-four-leg-views'], specs: [] },
  { id: 'desk-executive', cat: 'desks', model: ['Electric · L-return', '电动 · L 型'], name: ['Executive desk', '升降经理桌'],
    images: ['product/desk-executive', 'product/desk-office-wood', 'product/desk-office-wood-views'], specs: ELECTRIC_DESK('650–1300 mm', '1400 × 700 mm').slice(0, 5) },
  { id: 'desk-gaming', cat: 'desks', model: ['Electric', '电动'], name: ['Gaming desk', '电竞升降桌'],
    images: ['product/desk-gaming', 'product/desk-gaming-views'], specs: ELECTRIC_DESK('710–1250 mm', '1200 × 600 mm').slice(0, 5) },
  { id: 'desk-coffee', cat: 'desks', model: ['Electric', '电动'], name: ['Electric coffee table', '电动升降茶几'],
    images: ['product/desk-coffee', 'product/desk-coffee-views'], specs: ELECTRIC_DESK('400–760 mm', '1400 × 700 mm').slice(0, 5) },
  { id: 'desk-student', cat: 'desks', model: ['Electric', '电动'], name: ['Student desk', '学生升降桌'],
    images: ['product/desk-student', 'product/desk-student-views'], specs: [] },
  { id: 'table-pneumatic', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Multi-function pneumatic table', '多功能气动升降桌'], images: ['product/table-pneumatic'],
    specs: [['Height range', '升降高度', '726–1050 mm'], ['Top', '桌面尺寸', '400 × 700 mm'], PNEUMATIC_LOAD, ['Use', '适用场景', 'Bedside, sofa-side or standing work', '床边 / 沙发旁 / 站立办公']] },
  { id: 'table-tilting', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Tilting pneumatic table', '可翻转气动升降桌'], images: ['product/table-tilting', 'product/table-tilting-views'],
    specs: [['Height range', '升降高度', '726–1050 mm'], ['Top', '桌面尺寸', '400 × 700 mm, multi-angle tilt', '400 × 700 mm，支持多角度翻转'], PNEUMATIC_LOAD] },
  { id: 'table-side', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Pneumatic side table', '气动升降边桌'], images: ['product/table-side'],
    specs: [['Height range', '升降高度', '726–1050 mm'], ['Top', '桌面尺寸', '300 × 500 mm'], PNEUMATIC_LOAD] },
  { id: 'table-overbed', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Overbed dining table', '护理气动升降餐桌'], images: ['product/table-overbed'],
    specs: [['Height range', '升降高度', '726–1105 mm'], ['Top', '桌面尺寸', '800 × 400 mm'], PNEUMATIC_LOAD, ['Use', '适用场景', 'Reading, meals in bed, standing work', '阅读 / 护理用餐 / 站立办公']] },
  { id: 'table-side-round', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Adjustable side table', '灵活升降边桌'], images: ['product/table-side-round'],
    specs: [['Height range', '升降高度', '315–530 mm'], ['Column', '桌腿', 'Ø 40 mm']] },
  { id: 'table-angled', cat: 'desks', model: ['Pneumatic', '气动'], name: ['Angled-top pneumatic table', '倾斜桌面气动桌'], images: ['product/table-angled'], specs: [] },
];

// ---------------------------------------------------------------------------
// The showreel. Each scene names a template in showreel.js; every line is an
// [en, zh] pair. `rising` swaps copy when the Halloween skin is on.
// ---------------------------------------------------------------------------
export const REEL = [
  { type: 'cover', seconds: 10 },
  { type: 'slogan', seconds: 7, bg: 'film/sunrise', line: ['Where the sun rises with power, Hosun rises with purpose.', '旭日蓬勃，恒升致远'],
    rising: { line: ['Everything rises tonight.', '今夜，万物升起'] } },
  { type: 'chapter', seconds: 5, theme: ['Precision Parts', '零部件板块'], photos: [
    ['factory/stamping-robot', 'Robotic stamping cells', '机器人冲压单元'],
    ['factory/welding-robot', 'Robotic welding', '机器人焊接'],
    ['factory/machining', 'Machining hall', '机加工车间'],
    ['film/precision', 'Precision machined parts', '精密机加工零部件'],
    ['factory/robot-arm-1', 'Automated handling', '自动化上下料'],
    ['factory/painting-line', 'Automated spraying line', '自动喷涂线'],
    ['factory/lifting-columns', 'Lifting columns in assembly', '升降立柱装配'],
  ], rising: { theme: ['The night shift', '夜班不停'] } },
  { type: 'stats', seconds: 9 },
  { type: 'slogan', seconds: 7, bg: 'factory/history-wall', line: ['Founded in 2002 with just RMB 4,600, one machine, and one employee.', '2002 年，以 4600 元资金、一台机器、一名工人艰难起步。'],
    rising: { line: ['500+ machines. Not one of them afraid of the dark.', '500 多台设备，没有一台怕黑'] } },
  { type: 'chapter', seconds: 5, theme: ['Medical Imaging', 'CDMO板块'], photos: [
    ['film/c-arm', 'Digital X-ray Imaging Products', '数字化X射线摄影产品'],
    ['film/xray-detector', 'Multifunctional AI digital X-ray system', '多功能 AI 数字摄影机'],
    ['factory/c-arm-line', 'C-arm equipment in production', 'C 形臂设备生产'],
    ['factory/imaging-system', 'Medical imaging equipment', '医疗影像设备'],
  ], rising: { theme: ['We see right through it', '一眼看穿'] } },
  { type: 'spotlight', seconds: 11, product: 'ai-xray' },
  { type: 'film', seconds: 36 },
  { type: 'slogan', seconds: 7, bg: 'film/home-care', line: ['Silver Economy, Accessibility, Age-Inclusive Design', '银发经济、无障碍、适老化'],
    rising: { line: ['No tricks. Just tolerances.', '不耍花招，只讲精度'] } },
  { type: 'chapter', seconds: 5, theme: ['Health & Wellness', '康养板块'], photos: [
    ['film/bed-studio-1', 'Electric nursing beds, made in our own halls', '自有工厂生产的电动护理床'],
    ['film/bed-studio-2', 'Every smooth rise and fall', '每一次平稳起落'],
    ['film/home-care', 'Comfortable living', '舒适生活'],
    ['factory/showroom-2', 'The Herstar showroom', '恒而思达展厅'],
  ], rising: { theme: ['Rise and shine', '缓缓升起'] } },
  { type: 'spotlight', seconds: 12, product: 'transfer-robot' },
  { type: 'spotlight', seconds: 10, product: 'em-5001' },
  { type: 'spotlight', seconds: 10, product: 'rw-01' },
  { type: 'spotlight', seconds: 10, product: 'bath-lift' },
  { type: 'chapter', seconds: 5, theme: ['Accessible living', '无障碍生活'], photos: [
    ['film/accessible-kitchen', 'Kitchens that come to you', '升降厨房，触手可及'],
    ['product/sink-kitchen', 'Height-adjustable kitchen sink', '电动升降厨房水槽'],
    ['product/cabinet-lift-photo', 'Motorised cabinet lift', '电动升降橱柜'],
    ['product/basin-scene', 'UT750 height-adjustable basin', 'UT750 电动升降洗手台盆'],
    ['product/wardrobe-scene-1', 'Motorised wardrobe rail', '电动升降挂衣杆'],
    ['film/ankle-trainer', 'Ankle rehabilitation trainer', '踝关节康复训练器'],
  ], rising: { theme: ['Lights out, shelves down', '灯灭，柜降'] } },
  { type: 'mosaic', seconds: 11, category: 'desks', title: ['Key Products: Smart Lifting Desks', '产品介绍——智能升降桌'],
    rising: { title: ['Desks that rise after dark', '入夜也会升起的桌子'] } },
  { type: 'spotlight', seconds: 10, product: 'health-desk' },
  { type: 'certs', seconds: 10 },
  { type: 'slogan', seconds: 7, bg: 'factory/partner-wall', line: ['Long-term supplier of critical components for Fortune Global 500 companies', '世界 500 强企业关键部件长期供应商'],
    rising: { line: ['Trusted by global brands — day and night.', '全球品牌的信赖，昼夜不息'] } },
  { type: 'partners', seconds: 12 },
  { type: 'timeline', seconds: 12 },
  { type: 'slogan', seconds: 8, bg: 'factory/new-campus', line: ['2027 · New Health and Wellness Industrial Park put into Operation', '2027 新工厂投产 · 80,000 平方米数字化智慧工厂'],
    rising: { line: ['Five factories. No ghosts in the supply chain.', '五大工厂，供应链里没有幽灵'] } },
  { type: 'cta', seconds: 10 },
];

// Two cuts of the brand film. English plays by default — in the showreel and
// on the page, where visitors can switch to the Chinese version.
export const FILM = {
  default: 'en',
  versions: {
    en: { label: ['English', '英文版'], src: 'assets/video/film-en-1080.mp4', length: 183 },
    zh: { label: ['Chinese', '中文版'], src: 'assets/video/film-zh-1080.mp4', length: 168 },
  },
  poster: 'film/poster',   // 00:31 of the English cut: the logo on a blurred background, no subtitle
  // the reel plays one window of the English cut per pass, in turn (seconds)
  segments: [[0, 36], [36, 72], [110, 146], [146, 182]],
};

export const RISING_LINES = {
  coverKicker: ['Halloween at the booth', '展台万圣节'],
  cover: 'The Rising',
  coverSub: ['Lifting columns, nursing beds and desks — all rising after dark.', '升降立柱、护理床与升降桌——入夜，一同升起。'],
  cta: ['Trick or treat? Leave your card.', '不给糖就捣蛋？留下名片吧'],
  ctaSub: ['We will follow up after the fair. No tricks.', '展会结束后我们会与您联系，绝无花招。'],
};
