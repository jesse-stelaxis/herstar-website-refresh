// All operational inputs are fictional. Currency: CNY. Period: one modelled order.
export const defaults = Object.freeze({ goodKg:10000, materialPrice:6, scrapPrice:1.5,
  baselineYield:90, targetYield:94, downtime:120, recovery:80, cycle:2,
  overtimeRate:180, deliveryCost:120, baselineRework:24, targetRework:6,
  reworkCost:80, qualityCost:200, baseEnergy:1200, targetEnergy:1080, tariff:0.9,
  yieldCost:300, implementation:6000, ordersPerYear:24, reports:20, minutesSaved:15 });
export const limits={ goodKg:[1000,30000,500], materialPrice:[2,20,.5], scrapPrice:[0,2,.1],
  baselineYield:[70,99,1],targetYield:[70,99,1],downtime:[0,240,10],recovery:[0,100,5],
  cycle:[1,10,.5],overtimeRate:[0,600,10],deliveryCost:[0,1500,20],
  baselineRework:[0,100,1],targetRework:[0,100,1],reworkCost:[0,300,5],qualityCost:[0,1500,20],
  baseEnergy:[0,3000,50],targetEnergy:[0,3000,10],tariff:[.1,2,.1],yieldCost:[0,2000,50],
  implementation:[0,50000,500],ordersPerYear:[1,100,1],reports:[0,100,1],minutesSaved:[0,60,1] };
export function calculate(input=defaults, scenario='yield') {
  if(!['yield','delivery','quality'].includes(scenario)) throw new RangeError('Unknown scenario');
  const p={...defaults,...input};
  for(const [k,v] of Object.entries(p)) if(!Number.isFinite(v)) throw new TypeError(`Invalid ${k}`);
  if(p.baselineYield<=0 || p.targetYield<=0 || p.baselineYield>100 || p.targetYield>100 || p.cycle<=0) throw new RangeError('Invalid process assumptions');
  const baseInput=p.goodKg/(p.baselineYield/100), targetInput=p.goodKg/(p.targetYield/100);
  const baseScrap=baseInput-p.goodKg, targetScrap=targetInput-p.goodKg;
  const material=(baseInput-targetInput)*(p.materialPrice-p.scrapPrice);
  const energy=(p.baseEnergy-p.targetEnergy)*p.tariff;
  const recoveredMinutes=p.downtime*p.recovery/100;
  const labor=recoveredMinutes/60*p.overtimeRate;
  const rework=(p.baselineRework-p.targetRework)*p.reworkCost;
  const components=scenario==='yield' ? {material,energy,labor:0,rework:0} : scenario==='delivery' ? {material:0,energy:0,labor,rework:0} : {material:0,energy:0,labor:0,rework};
  const intervention=scenario==='yield'?p.yieldCost:scenario==='delivery'?p.deliveryCost:p.qualityCost;
  const gross=Object.values(components).reduce((a,b)=>a+b,0),net=gross-intervention;
  const annual=net*p.ordersPerYear, yearOne=annual-p.implementation;
  return {p,baseInput,targetInput,baseScrap,targetScrap,material,energy,labor,rework,components,
    recoveredMinutes,capacity:Math.floor(recoveredMinutes/p.cycle),gross,intervention,net,annual,yearOne,
    payback:annual>0?p.implementation/(annual/12):null,reportHours:p.reports*p.minutesSaved/60,
    lateBaseline:scenario==='delivery'?p.downtime:scenario==='quality'?p.baselineRework*8:60,
    lateTarget:scenario==='delivery'?p.downtime-recoveredMinutes:scenario==='quality'?p.targetRework*8:60};
}
export function calculateAmoebas(input=defaults, scenario='yield', applied=false) {
  const m=calculate(input,scenario),p=m.p;
  // Baseline costs change with the same assumptions used by the savings model.
  const sheetExternal=m.baseInput*p.materialPrice-m.baseScrap*p.scrapPrice+p.baseEnergy*p.tariff+1500;
  const weldExternal=17000+p.downtime/60*p.overtimeRate;
  const assemblyExternal=100000+p.baselineRework*p.reworkCost;
  const units=[
    {zh:'钣金单元',en:'Sheet metal',revenue:90000,expense:sheetExternal,hours:320,external:sheetExternal},
    {zh:'焊接单元',en:'Welding',revenue:135000,expense:90000+weldExternal,hours:280,external:weldExternal},
    {zh:'总装交付单元',en:'Final assembly',revenue:400000,expense:135000+assemblyExternal,hours:600,external:assemblyExternal}
  ];
  const affected=scenario==='yield'?0:scenario==='delivery'?1:2;
  return units.map((u,i)=>({...u,proposal:u.expense-(i===affected?m.net:0),current:u.expense-(applied&&i===affected?m.net:0)}));
}
export const centres=[
 {id:'stamp',zh:'冲压中心',en:'Stamping',image:'auto-robot-cell',code:'ST-01',x:90,y:65},
 {id:'sheet',zh:'钣金中心',en:'Sheet metal',image:'cap-laser-bed',code:'SM-02',x:335,y:65},
 {id:'weld',zh:'焊接中心',en:'Welding',image:'forming-sparks',code:'WD-03',x:580,y:65},
 {id:'machine',zh:'机加工中心',en:'Machining',image:'cap-machined-parts',code:'MC-04',x:90,y:270},
 {id:'coat',zh:'喷涂中心',en:'Coating',image:'cap-coating',code:'CT-05',x:335,y:270},
 {id:'assembly',zh:'组装中心',en:'Assembly',image:'product-frames-line',code:'AS-06',x:580,y:270},
 {id:'inspect',zh:'检测中心',en:'Inspection',image:'qc-cmm-probe',code:'QC-07',x:825,y:270}
];
export const sourceFacts=[
 {zh:'产品：升降桌架、升降立柱、气动升降桌',en:'Products: desk frames, lifting columns, pneumatic desks',source:'https://www.hosunherstar.com/',status:'public'},
 {zh:'七个工艺中心：冲压、钣金、焊接、机加工、组装、喷涂、检测',en:'Seven process centres: stamping, sheet metal, welding, machining, assembly, coating, inspection',source:'https://www.hosun.cn/factory.html',status:'repo'},
 {zh:'四个工厂，资料合计 50,000 m²',en:'Four factories; documented total 50,000 m²',source:'https://www.hosun.cn/factory.html',status:'repo'},
 {zh:'工厂图片：现有项目筛选的企业影片画面',en:'Factory imagery: selected corporate-film frames in the existing project',source:'../README.md',status:'repo'},
 {zh:'SAP、MES、WMS、PLM 的实际部署与版本',en:'Actual SAP, MES, WMS and PLM installations and versions',source:null,status:'unknown'},
 {zh:'订单、路线、设备编号、批次、人员、工时、价格及能耗',en:'Orders, routes, machine IDs, lots, people, hours, prices and energy',source:null,status:'dummy'},
 {zh:'阿米巴划分、内部转移价格和成本分摊规则',en:'Amoeba boundaries, transfer prices and cost allocation policy',source:null,status:'dummy'}
];
