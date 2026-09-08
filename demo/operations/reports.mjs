import {snapshot,nextRun,makeReport,collectDue,escapeHTML as esc} from './ops-model.mjs';
const storeKey='herstar-ops-reports-v1';
const today=new Date();
const startClock=Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate(),0,0);
let saved=null;try{saved=JSON.parse(localStorage.getItem(storeKey))}catch{}
const first={id:'DAILY-DEMO',name:'生产经营日报（演示）',time:'08:30',cadence:'daily',timezone:'Asia/Shanghai',channel:'feishu',destination:'恒升生产例会（虚构群）',enabled:true};
first.next=nextRun(first,startClock);
const second={id:'APP-DEMO',name:'周一管理简报（演示）',time:'09:00',day:1,cadence:'weekly',timezone:'Asia/Shanghai',channel:'app',destination:'恒升经营助手（演示应用）',enabled:false};second.next=nextRun(second,startClock);
let reportState=saved||{clock:startClock,schedules:[first,second],runs:[],selected:null};
let getContext,redraw,notify;
const save=()=>localStorage.setItem(storeKey,JSON.stringify(reportState));
const dateLabel=(value,zone='Asia/Shanghai')=>new Intl.DateTimeFormat('zh-CN',{timeZone:zone,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const cadenceName=s=>s.cadence==='weekdays'?'每个工作日':s.cadence==='weekly'?'每周'+['日','一','二','三','四','五','六'][s.day]:'每天';
const panel=(title,body)=>`<section class="panel"><div class="panel-head"><h2>${title}</h2><span class="badge dummy">模拟数据</span></div><div class="panel-body">${body}</div></section>`;
export function systemsView(context){
 const snap=snapshot(context);
 const systems=[['SAP ERP','订单 / 采购 / 成本','以企业现有部署与授权为准'],['MES','工单 / 工序 / 停机','按订单与设备编号关联'],['WMS','仓位 / 批次 / 隔离','隔离量与可用量分开'],['PLM','BOM / 图纸版本 / 变更','保持版本与适用范围'],['设备采集','网关 / 功率 / 计件','区分采集时间与数据状态']];
 return `<div class="page-head"><div><div class="eyebrow">DATA ACCESS / DEMO ADAPTERS</div><h1>一份订单，连接多套业务记录。</h1><p class="sub">当前全部为本地模拟适配器。系统名称说明拟接入范围，不代表恒升已部署这些系统。</p></div></div><div class="ops-system-grid">${systems.map(([name,scope,note])=>`<article class="panel"><div class="panel-body"><span class="badge dummy">模拟适配器就绪</span><h2>${name}</h2><p>${scope}</p><small>${note}</small></div></article>`).join('')}</div>${panel('本次查询快照 · 可追溯记录',`<p class="callout">数据来源：本地演示模型。以下不是 SAP、MES 或设备的真实返回结果。金额、数量、设备编号、版本与工单均为虚构。</p><div class="table-wrap"><table><thead><tr><th>来源</th><th>记录</th><th>当前内容</th><th>查看</th></tr></thead><tbody>${snap.records.map(r=>`<tr><td>${r.system}</td><td><strong>${r.entity}</strong><br><code>${r.id}</code></td><td>${esc(r.text)}</td><td><button class="small" data-ops-record="${r.id}">展开字段</button></td></tr>`).join('')}</tbody></table></div>`)}${panel('正式接入时的控制边界','<div class="system-flow"><div>业务系统 / 设备<small>企业授权的接口</small></div><span>→</span><div>只读适配器<small>字段映射、访问范围、更新时间</small></div><span>→</span><div>经营助手<small>查询、计算与报告</small></div><span>→</span><div>交付渠道<small>飞书 / 企业应用</small></div></div><p>真实接入需核实系统版本、接口能力和权限。演示不配置凭据、不解除隔离、不修改生产或库存记录。</p>')}`;
}
export function reportView(){
 const selected=reportState.runs.find(r=>r.id===reportState.selected)||reportState.runs[0];
 return `<div class="page-head"><div><div class="eyebrow">REPORTS / DELIVERY</div><h1>把需要的结论，送到工作的地方。</h1><p class="sub">配置定时简报，预览飞书群卡片或企业应用消息。当前仅模拟生成与投递，没有真实调度服务或外部发送。</p></div><button class="primary" data-ops="new">新建报告计划</button></div><div class="scenario-strip"><span class="eyebrow">报告模拟时钟</span><strong>${dateLabel(reportState.clock)} · 上海</strong><button data-ops-advance="30">推进 30 分钟</button><button data-ops-advance="1440">推进 1 天</button><button data-ops="once">立即生成演示报告</button></div><p class="ops-note">只有点击推进才会触发到点任务；关闭网页后不会继续运行。报告使用生成时的当前工厂模拟情景，不预测未来生产数据。</p><div class="ops-report-layout"><div>${panel('报告计划',reportState.schedules.map(s=>`<article class="ops-schedule"><div><strong>${esc(s.name)}</strong><span class="badge ${s.enabled?'calc':'unknown'}">${s.enabled?'演示已启用':'已暂停'}</span></div><p>${cadenceName(s)} ${s.time} · ${s.timezone}<br>${s.channel==='feishu'?'飞书群':'企业应用'} / ${esc(s.destination)}</p><small>下次模拟触发：${dateLabel(s.next,s.timezone)}</small><div class="actions"><button class="small" data-ops-edit="${s.id}">编辑</button><button class="small" data-ops-toggle="${s.id}">${s.enabled?'暂停':'启用'}</button><button class="small" data-ops-fail="${s.id}">${s.failNext?'下一次将模拟失败':'演示一次投递失败'}</button></div></article>`).join(''))}${panel('投递记录',reportState.runs.length?`<div class="ops-run-list">${reportState.runs.slice(0,12).map(r=>`<button class="ops-run ${selected?.id===r.id?'chosen':''}" data-ops-select="${r.id}"><strong>${r.status==='failed'?'模拟投递失败':'模拟投递完成'}</strong><span>${esc(r.destination)}</span><small>${dateLabel(r.report.at)} · 尝试 ${r.attempts} 次</small></button>`).join('')}</div>`:'<p>暂无记录。生成一次报告，或推进模拟时钟到计划时间。</p>')}</div><div>${panel('接收端预览',selected?messageCard(selected):'<div class="ops-empty">生成报告后，这里展示飞书或企业应用的消息卡片。</div>')}${selected?panel('报告引用的数据',`<div class="ops-evidence">${selected.report.records.map(r=>`<details><summary>${r.system} · ${r.id}</summary><p>${esc(r.text)}</p><pre>${esc(JSON.stringify(r.fields,null,2))}</pre></details>`).join('')}</div><p class="ops-note">以上为生成时快照，调整工厂情景不会改写已经生成的历史报告。</p>`):''}</div></div>`;
}
function messageCard(run){
 const r=run.report;
 return `<div class="ops-message ${run.channel}"><div class="ops-message-channel">${run.channel==='feishu'?'飞书群 · 消息卡片预览':'企业应用 · 通知详情预览'}</div><div class="ops-message-body"><span class="badge dummy">虚构报告 / 未真实发送</span><h2>${r.title}</h2><small>${dateLabel(r.at)} · ${esc(run.destination)}</small><p>${esc(r.summary)}</p><h3>需要关注</h3><ul>${r.risks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>建议下一步</h3><ol>${r.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="callout">当前方案净节省估算：¥${r.metrics.estimatedSaving.toFixed(2)} / 单。不是已实现收益。</div><p class="ops-note">${r.disclaimer}</p></div></div><div class="actions"><button data-ops-download="${run.id}">下载报告 JSON</button>${run.status==='failed'?`<button class="primary" data-ops-retry="${run.id}">模拟重试</button>`:''}<button data-nav="systems">查看模拟适配器</button></div>${run.status==='failed'?'<p class="ops-error">演示错误：接收端暂时不可用。重试沿用同一报告快照，不重新生成数据。</p>':''}`;
}
function dialog(html){const target=document.querySelector('#detail');target.innerHTML=`<div class="dialog-content"><button class="dialog-close small" data-action="close">关闭 ×</button>${html}</div>`;if(!target.open)target.showModal();}
export function scheduleEditor(proposed={}){
 const s={name:'生产经营日报（演示）',cadence:'daily',time:'08:30',timezone:'Asia/Shanghai',channel:'feishu',destination:'恒升生产例会（虚构群）',day:1,...proposed};
 dialog(`<div class="eyebrow">SCHEDULE / DEMO ONLY</div><h1>定时报告计划</h1><form id="ops-schedule-form" data-id="${s.id||''}"><label>名称<input name="name" required maxlength="100" value="${esc(s.name)}"></label><div class="ops-fields"><label>频率<select name="cadence">${[['daily','每天'],['weekdays','工作日'],['weekly','每周']].map(([v,n])=>`<option value="${v}" ${s.cadence===v?'selected':''}>${n}</option>`).join('')}</select></label><label>时间<input name="time" type="time" required value="${s.time}"></label><label>每周计划的星期<select name="day">${['日','一','二','三','四','五','六'].map((n,i)=>`<option value="${i}" ${Number(s.day)===i?'selected':''}>周${n}</option>`).join('')}</select></label><label>时区<select name="timezone"><option ${s.timezone==='Asia/Shanghai'?'selected':''}>Asia/Shanghai</option><option ${s.timezone==='UTC'?'selected':''}>UTC</option></select></label></div><label>接收渠道<select name="channel"><option value="feishu" ${s.channel==='feishu'?'selected':''}>飞书群（模拟）</option><option value="app" ${s.channel==='app'?'selected':''}>自定义企业应用（模拟）</option></select></label><label>虚构群或应用名称<input name="destination" required maxlength="100" value="${esc(s.destination)}"></label><p class="callout">这里只保存演示配置。无需 Webhook、Token 或真实群信息；不会创建后台任务或发送消息。</p><p id="ops-form-error" role="alert"></p><button class="primary">保存演示计划</button></form>`);
}
export function mountReports(context,render,toast){
 getContext=context;redraw=render;notify=toast;
 if(!reportState.runs.length){const report=makeReport(getContext(),reportState.clock-3600000);reportState.runs=[{id:report.id+'-SEED',report,scheduleId:'SEED',channel:'feishu',destination:'恒升生产例会（虚构群）',status:'simulated',attempts:1}];save();}
 document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.ops==='new')scheduleEditor();
  if(d.opsEdit)scheduleEditor(reportState.schedules.find(s=>s.id===d.opsEdit));
  if(d.opsToggle){const s=reportState.schedules.find(s=>s.id===d.opsToggle);s.enabled=!s.enabled;s.next=nextRun(s,reportState.clock);save();redraw();}
  if(d.opsFail){const s=reportState.schedules.find(s=>s.id===d.opsFail);s.failNext=!s.failNext;save();redraw();}
  if(d.opsAdvance){reportState.clock+=Number(d.opsAdvance)*60000;const runs=collectDue(reportState.schedules,reportState.clock,getContext());reportState.runs=[...runs.reverse(),...reportState.runs].slice(0,100);reportState.selected=reportState.runs[0]?.id;save();redraw();notify(`模拟时钟已推进；生成 ${runs.length} 份报告，无真实发送。`);}
  if(d.ops==='once'){const report=makeReport(getContext(),reportState.clock);const run={id:report.id+'-MANUAL-'+Date.now(),report,scheduleId:'MANUAL',channel:'app',destination:'恒升经营助手（演示应用）',status:'simulated',attempts:1};reportState.runs.unshift(run);reportState.selected=run.id;save();redraw();}
  if(d.opsSelect){reportState.selected=d.opsSelect;save();redraw();}
  if(d.opsRetry){const run=reportState.runs.find(r=>r.id===d.opsRetry);run.status='simulated';run.attempts++;save();redraw();notify('模拟重试完成，未发送到外部。');}
  if(d.opsDownload){const run=reportState.runs.find(r=>r.id===d.opsDownload);const url=URL.createObjectURL(new Blob([JSON.stringify(run,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=run.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  if(d.opsRecord){const r=snapshot(getContext()).records.find(r=>r.id===d.opsRecord);dialog(`<div class="eyebrow">${r.system} / DUMMY RECORD</div><h1>${r.entity}</h1><p>${r.text}</p><pre class="ops-json">${esc(JSON.stringify(r,null,2))}</pre>`);}
 });
 document.addEventListener('submit',event=>{
  if(event.target.id!=='ops-schedule-form')return;event.preventDefault();const f=event.target,data=Object.fromEntries(new FormData(f));
  try{const schedule={...data,id:f.dataset.id||'SCH-'+Date.now(),day:Number(data.day),enabled:true};schedule.next=nextRun(schedule,reportState.clock);const index=reportState.schedules.findIndex(s=>s.id===schedule.id);if(index<0)reportState.schedules.push(schedule);else reportState.schedules[index]=schedule;save();document.querySelector('#detail').close();redraw();notify('演示报告计划已保存。');}catch{document.querySelector('#ops-form-error').textContent='请检查计划时间与频率。';}
 });
 window.addEventListener('herstar-report-plan',e=>scheduleEditor(e.detail));
}
