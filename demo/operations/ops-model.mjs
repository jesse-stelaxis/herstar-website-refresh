import {calculate,centres} from './model.mjs';
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function snapshot(context){
 const m=calculate(context.p,context.scenario),need=context.applied&&context.scenario==='yield'?m.targetInput:m.baseInput;
 const minute=context.tick||0;
 const stopped=context.scenario==='delivery'&&minute>=3&&minute<3+(context.applied?m.lateTarget:context.p.downtime);
 const weldingPower=stopped?1.2:22+4*Math.sin((minute+2)/7);
 const records=[
  {id:'SAP-SO-DEMO-260908',system:'SAP ERP',entity:'销售订单',text:'虚构客户 Example Office，双电机桌架 500 套；制造关联 DEMO-HS-260908。',fields:{order:'DEMO-HS-260908',quantity:500,product:'双电机桌架',customer:'Example Office（虚构）'}},
  {id:'MES-WO-DEMO-260908',system:'MES',entity:'生产工单',text:`当前${context.applied?'方案模拟':'基线模拟'}，预计延迟 ${Math.round(context.applied?m.lateTarget:m.lateBaseline)} 分钟。`,fields:{order:'DEMO-HS-260908',delayMinutes:context.applied?m.lateTarget:m.lateBaseline,scenario:context.scenario}},
  {id:'WMS-STOCK-DEMO-01',system:'WMS',entity:'可用库存',text:`可用钢材 10,800 kg；需求 ${need.toFixed(1)} kg；缺口 ${Math.max(0,need-10800).toFixed(1)} kg。`,fields:{availableKg:10800,requiredKg:need,shortfallKg:Math.max(0,need-10800)}},
  {id:'LOT-DEMO-03',system:'WMS',entity:'质量隔离批次',text:'A-03 仓位，600 kg 隔离，不计入可用库存；批次记录为 Rev A。',fields:{bin:'A-03',quantityKg:600,held:true,revision:'A'}},
  {id:'PLM-ECO-DEMO-02',system:'PLM',entity:'工程版本',text:'订单要求 Rev B，隔离批次记录为 Rev A。仅可提出核验与处置建议。',fields:{orderRevision:'B',lotRevision:'A',lot:'LOT-DEMO-03'}},
  {id:'EDGE-WD-03-DEMO',system:'设备采集',entity:'焊接功率快照',text:`第 ${minute} 个模拟采样点；波形由演示函数生成，不是设备实测。`,fields:{sample:minute,powerKW:weldingPower,synthetic:true}}
 ];
 return {dummy:true,capturedAt:new Date().toISOString(),scenario:context.scenario,applied:context.applied,records,metrics:{orderQty:500,availableKg:10800,requiredKg:need,shortfallKg:Math.max(0,need-10800),heldKg:600,delayMinutes:context.applied?m.lateTarget:m.lateBaseline,estimatedSaving:m.net},centres:centres.map((c,i)=>({id:c.code,name:c.zh,powerKW:c.id==='weld'?weldingPower:18+i*2+4*Math.sin((minute+i)/7)}))};
}
export function evidenceFor(question,context){
 const snap=snapshot(context),q=question.toLowerCase();
 if(/库存|物料|批次|wms|stock|warehouse/.test(q))return snap.records.filter(r=>['WMS','SAP ERP'].includes(r.system));
 if(/版本|图纸|质量|plm|revision|quality/.test(q))return snap.records.filter(r=>['WMS','PLM'].includes(r.system));
 if(/设备|功率|采集|信号|equipment|power/.test(q))return snap.records.filter(r=>r.system==='设备采集');
 return snap.records.filter(r=>r.system!=='设备采集');
}
export function parseReportRequest(question){
 const q=question.toLowerCase();
 if(!/(每天|每日|每周|工作日|定时|daily|weekly|weekday|schedule)/.test(q)||!/(报告|日报|简报|report|brief)/.test(q))return null;
 const time=q.match(/(?:早上|上午|晚上|下午)?\s*(\d{1,2})(?:[:：](\d{2})|点(?:(\d{1,2})分?|半)?)/);
 let h=time?Number(time[1]):8,m=time?Number(time[2]||time[3]||(/半/.test(time[0])?30:0)):30;
 if(/晚上|下午/.test(q)&&h<12)h+=12;
 if(h>23||m>59)return {error:'时间需要在 00:00–23:59 之间。'};
 const weekly=/每周|weekly/.test(q),weekday=q.match(/每周([一二三四五六日天])/);
 return {name:'生产经营日报（演示）',time:`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,cadence:weekly?'weekly':/工作日|weekday/.test(q)?'weekdays':'daily',day:weekday?'日一二三四五六'.indexOf(weekday[1]==='天'?'日':weekday[1]):1,timezone:'Asia/Shanghai',channel:/自定义|自建|enterprise|应用/.test(q)?'app':'feishu',destination:/自定义|自建|enterprise|应用/.test(q)?'恒升经营助手（演示应用）':'恒升生产例会（虚构群）',enabled:true};
}
export function nextRun(schedule,after){
 const offset=schedule.timezone==='UTC'?0:8*60;
 const [hour,minute]=schedule.time.split(':').map(Number);
 if(!Number.isInteger(hour)||!Number.isInteger(minute)||hour<0||hour>23||minute<0||minute>59)throw new RangeError('Invalid report time');
 const local=new Date(Number(after)+offset*60000);
 for(let day=0;day<9;day++){
  const candidate=new Date(Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate()+day,hour,minute));
  const dow=candidate.getUTCDay();
  if(schedule.cadence==='weekdays'&&(dow===0||dow===6))continue;
  if(schedule.cadence==='weekly'&&dow!==Number(schedule.day))continue;
  const utc=candidate.getTime()-offset*60000;if(utc>Number(after))return utc;
 }
 throw new Error('No next report occurrence');
}
export function makeReport(context,at){
 const snap=snapshot(context),m=snap.metrics;
 return {id:'REPORT-'+Number(at).toString(36),dummy:true,at:Number(at),title:'恒升生产经营简报 · 模拟数据',summary:`演示订单 500 套；投料需求 ${m.requiredKg.toFixed(1)} kg，可用库存 ${m.availableKg} kg，缺口 ${m.shortfallKg.toFixed(1)} kg。`,risks:[`工单预计延迟 ${Math.round(m.delayMinutes)} 分钟（情景假设）。`,'600 kg 批次保持隔离，不得视作可用量。','订单 Rev B 与批次 Rev A 不一致，需质量与工程复核。'],actions:['生产负责人核对工序及关键路径。','仓库负责人核对可用批次；质量负责人决定隔离处置。','财务核实成本口径，不把条件估算视作已实现收益。'],metrics:m,records:snap.records,disclaimer:'虚构数据、模拟报告。无真实系统连接，无外部消息发送。'};
}
export function collectDue(schedules,until,context){
 const runs=[];
 for(const schedule of schedules){
  if(!schedule.enabled)continue;
  let count=0;
  while(schedule.next<=until&&count++<10){
   const at=schedule.next;const report=makeReport(context,at);
   runs.push({id:report.id+'-'+schedule.id,report,scheduleId:schedule.id,channel:schedule.channel,destination:schedule.destination,status:schedule.failNext?'failed':'simulated',attempts:1});
   schedule.failNext=false;schedule.next=nextRun(schedule,at);
  }
 }
 return runs;
}
