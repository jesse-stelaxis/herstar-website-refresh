/* B2B demo workflows. All changes are local; outbound content is draft-only. */
const statuses = ['待跟进', '已联系', '已报价', '样品沟通', '已关闭'];
const evidenceTypes = [
  {id:'drawing', en:'Dimensional drawing', zh:'尺寸与安装图', summary:['Mounting pattern, stroke and assembly envelope.','安装孔位、行程及组装空间。']},
  {id:'testing', en:'Product test information', zh:'产品测试资料', summary:['Load, duty cycle and configuration-specific evidence.','承重、工作周期及对应配置的测试依据。']},
  {id:'certification', en:'Certificate review', zh:'认证资料核验', summary:['Issuer, validity and applicable manufacturing scope.','发证机构、有效期及制造范围。']},
  {id:'packaging', en:'Packaging and assembly', zh:'包装与组装资料', summary:['Packing dimensions and installation requirements.','包装尺寸与安装要求。']}
];
let requestedDocs = read('herstar-requested-docs', []);
let boardFilter = 'all', leadSearch = '', sourceFilter = 'all', reportRange = 'all', reportScope = 'all';
const eventLog = (type, detail = {}) => window.HerstarDemo?.record(type, detail);
const localEvents = () => window.HerstarDemo?.events() || [];
const leadById = id => leads.find(l => l.id === id);
const evidenceName = id => { const d=evidenceTypes.find(d=>d.id===id);return d?t(d.en,d.zh):id; };
const today = () => new Date().toISOString().slice(0,10);
const overdue = lead => !!lead.due && lead.due < today() && lead.status !== '已关闭';
const activity = (lead, text) => { (lead.history ||= []).push({at:new Date().toISOString(),text}); save(); };
function downloadText(name, text, type='text/plain;charset=utf-8') {
  const url=URL.createObjectURL(new Blob([text],{type}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function docSelection() {
  return `<fieldset><legend>${t('Documents to discuss','希望了解的资料')}</legend>${evidenceTypes.map(d=>`<label class="compare-check"><input type="checkbox" name="documents" value="${d.id}" ${requestedDocs.includes(d.id)?'checked':''}>${t(d.en,d.zh)}</label>`).join('')}</fieldset>`;
}
function requestDocument(id) {
  if(!requestedDocs.includes(id))requestedDocs.push(id);
  localStorage.setItem('herstar-requested-docs',JSON.stringify(requestedDocs));
  eventLog('document_request',{document:id});
  notify(t('Added to your inquiry requirements.','已加入询价资料需求。'));
}
function guide() {
  const items = [
    ['00','内部 AI 经营助手','跨系统问数与定时简报','operations/index.html#assistant','查询 MES、SAP ERP、WMS、PLM 和采集记录，查看生产大屏，模拟报告推送到飞书或企业应用。'],
    ['01','制造与产品','从制造依据到产品初筛','index.html','保留工厂叙事与拆解展示；可搜索、筛选、比较桌架。'],
    ['02','按市场组织采购','买家用熟悉的语言提出需求','us.html','美国页可切换单位，德国页将技术资料和样品讨论带入询价。'],
    ['03','资料与样品','把采购需要的证据提出来','portal.html#resources','查看资料状态、下载选型清单、把资料请求加入询价。'],
    ['04','从询盘到报价','少一次复制，多一份完整需求','portal.html#admin','分配负责人、安排下一步，填写报价并生成可下载草稿。'],
    ['05','跟进与样品进度','让已收到的询盘继续向前','portal.html#admin/pipeline','按销售阶段查看记录，准备可编辑的跟进邮件，记录样品进展。'],
    ['06','看看刚才发生了什么','用演示操作更新分析','portal.html#admin/analytics','本地操作次数、询盘来源和跟进状态来自演示记录，不是假装在线流量。']
  ];
  return `<section class="section guide"><span class="eyebrow">HERSTAR / CLIENT DEMONSTRATION</span><div class="section-head"><div><h1>从产品兴趣，走到下一次沟通。</h1><p class="muted">把网站、本地化、资料、询价和销售跟进串成一条可以实际操作的路径。</p></div><a class="btn primary" href="index.html">进入 B2B 展示 ↗</a></div><div class="grid">${items.map(([n,title,sub,url,desc])=>`<article class="feature"><span class="meta">${n} / ${sub}</span><h2>${title}</h2><p>${desc}</p><a class="btn" href="${url}">打开演示 ↗</a></article>`).join('')}</div><div class="actions"><a class="btn" href="de.html">德国采购页 ↗</a><a class="btn" href="#offers">样品与 OEM 项目入口 ↗</a><a class="btn" href="../客户价值与设计说明.md">客户价值说明 ↗</a><a class="btn" href="../流量采购待办计划.md">流量采购计划 ↗</a></div><p class="notice">全部业务记录仅保存在本浏览器。报价、邮件和样品进度均为演示，不发送消息、不产生交易。真实证书、图纸和测试报告仍需恒升提供。</p></section>`;
}
function resources() {
  return `<section class="section"><span class="eyebrow">${t('Engineering resources','工程资料')}</span><h1>${t('Evidence for your next decision.','为下一步判断准备依据。')}</h1><p class="muted">${t('Tell us which documents your project needs. Availability and applicability will be confirmed before a document is supplied.','说明项目需要哪些资料。提供前需确认资料是否具备，以及是否适用于所选产品。')}</p><div class="grid">${evidenceTypes.map(d=>`<article class="feature"><span class="badge neutral">${t('Availability to confirm','待确认可提供')}</span><h2>${t(d.en,d.zh)}</h2><p>${t(...d.summary)}</p><button data-request-doc="${d.id}">${requestedDocs.includes(d.id)?t('Requested ✓','已加入需求 ✓'):t('Add to inquiry +','加入询价需求 +')}</button></article>`).join('')}<article class="feature"><span class="badge">${t('Available · preparation checklist','可下载 · 需求准备清单')}</span><h2>${t('Prepare your brief.','准备采购简报。')}</h2><p>${t('A reusable checklist for dimensions, loads, sample terms and documentation. Not a certified specification sheet.','可复用的尺寸、承重、样品及资料准备清单，不是经认证的产品规格书。')}</p><button data-download="checklist">${t('Download checklist ↓','下载清单 ↓')}</button></article><article class="feature"><span class="meta">HERSTAR / STRUCTURE</span><h2>${t('Look inside a column.','看清立柱内部结构。')}</h2><p>${t('Explore the existing interactive structure illustration. Dimensions are representative, not manufacturing drawings.','查看交互式结构示意。尺寸用于说明，不作为制造图纸。')}</p><a class="btn" href="index.html#construction">${t('Explore the dissection ↗','打开拆解展示 ↗')}</a></article></div><div class="actions">${link('inquiry',t('Continue your inquiry →','继续填写询价 →'),'btn primary')}</div></section>`;
}
function offers() {
  return `<section class="section"><span class="eyebrow">${t('Sourcing programmes','采购项目')}</span><h1>${t('Start at the right stage.','从适合的阶段开始。')}</h1><p class="muted">${t('Choose a sample discussion or an OEM project review. Fees, minimum quantities and delivery dates are confirmed after technical review.','选择样品沟通或 OEM 项目评估。费用、起订量和交期在技术评估后确认。')}</p><div class="split"><article class="feature offer-sample"><span class="meta">01 / SAMPLE</span><h2>${t('Evaluate before scaling.','先评估，再扩大。')}</h2><p>${t('Select one frame and prepare a sample request with your finish and application requirements.','选择一款桌架，提交颜色和应用需求，开始样品沟通。')}</p><form id="programme-form"><input type="hidden" name="programme" value="sample"><label>${t('Starting frame','备选桌架')}<select name="product">${products.map(p=>`<option value="${p.id}">${pn(p)}</option>`).join('')}</select></label><button class="primary">${t('Prepare sample request →','准备样品申请 →')}</button></form></article><article class="feature"><span class="meta">02 / OEM</span><h2>${t('Build a project brief.','整理完整的项目需求。')}</h2><p>${t('Bring together required load, travel, trial quantity and the evidence your team needs.','集中说明需求承重、行程、试单数量及团队需要的资料。')}</p><div class="actions"><a class="btn" href="us.html">United States ↗</a><a class="btn" href="de.html">Deutschland ↗</a></div><p class="notice">${t('No automatic discount, free sample or delivery promise is attached to these demo programmes.','演示项目不包含自动折扣、免费样品或交付承诺。')}</p></article></div></section>`;
}
function adminNav() {
  return `<div class="workspace-nav" aria-label="工作台导航"><a href="operations/index.html#assistant">内部 AI 经营助手 ↗</a>${[['admin','询盘'],['admin/pipeline','销售阶段'],['admin/samples','样品'],['admin/analytics','分析'],['guide','演示导览']].map(([r,n])=>link(r,n,route()===r?'current':'')).join('')}</div>`;
}
function visibleLeads() {
  return leads.filter(l=>(boardFilter==='all'||l.status===boardFilter)&&(sourceFilter==='all'||l.source===sourceFilter)&&[l.company,l.name,l.email,l.owner,l.id].some(v=>String(v||'').toLowerCase().includes(leadSearch.toLowerCase())));
}
function leadTableRows() {
  const list=visibleLeads();
  return list.length?list.map(l=>`<tr><td><button class="text-button" data-lead="${esc(l.id)}">${esc(l.company)}</button><br><span class="muted">${esc(l.name)}</span></td><td>${esc(l.source)}</td><td>${esc(l.owner||'未分配')}<br><span class="${overdue(l)?'overdue':'muted'}">${esc(l.due||'未安排日期')}</span></td><td><span class="badge">${esc(l.status)}</span></td><td><button class="quiet" data-lead="${esc(l.id)}">打开记录</button></td></tr>`).join(''):'<tr><td colspan="5">没有匹配记录。调整搜索或筛选条件。</td></tr>';
}
function workspace() {
  const page=route().split('/')[1]||'inbox';
  const titles={inbox:'让每个询盘，都有下一步。',pipeline:'把进展和待办放在一起。',samples:'从样品申请到客户反馈。',analytics:'查看这次演示产生的记录。'};
  let content='';
  if(page==='pipeline')content=`<div class="pipeline">${statuses.map(status=>`<section class="pipeline-column"><h3>${status} <span>${leads.filter(l=>l.status===status).length}</span></h3>${leads.filter(l=>l.status===status).map(l=>`<article class="pipeline-card"><button class="text-button" data-lead="${esc(l.id)}">${esc(l.company)}</button><p>${esc(l.nextAction||'下一步待安排')}</p><small class="${overdue(l)?'overdue':'muted'}">${esc(l.owner||'未分配')} · ${esc(l.due||'日期待安排')}</small><label>调整阶段<select data-status="${esc(l.id)}">${statuses.map(s=>`<option ${s===l.status?'selected':''}>${s}</option>`).join('')}</select></label></article>`).join('')||'<p class="muted">暂无记录</p>'}</section>`).join('')}</div>`;
  else if(page==='samples')content=samplesPage();
  else if(page==='analytics')content=analyticsPage();
  else content=`<div class="feature"><div class="section-head"><h3>询盘与客户</h3><button class="quiet" data-action="export">导出演示客户记录 ↓</button></div><div class="filters"><input id="lead-search" aria-label="搜索客户" placeholder="公司、联系人、负责人…" value="${esc(leadSearch)}"><select id="status-filter" aria-label="询盘状态"><option value="all">所有阶段</option>${statuses.map(s=>`<option ${boardFilter===s?'selected':''}>${s}</option>`).join('')}</select><select id="source-filter" aria-label="询盘来源"><option value="all">所有来源</option>${[...new Set(leads.map(l=>l.source))].map(s=>`<option ${sourceFilter===s?'selected':''}>${esc(s)}</option>`).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>公司 / 联系人</th><th>来源</th><th>负责人 / 跟进日期</th><th>阶段</th><th>记录</th></tr></thead><tbody id="lead-rows">${leadTableRows()}</tbody></table></div></div>`;
  return `<section class="section workspace">${adminNav()}<div class="section-head"><div><span class="eyebrow">HERSTAR / 销售工作台</span><h1>${titles[page]||titles.inbox}</h1></div><span class="badge">虚构客户 / 虚构业务数据</span></div><div class="metrics"><div class="metric"><span>全部询盘（含示例）</span><strong>${leads.length}</strong></div><div class="metric"><span>未分配负责人</span><strong>${leads.filter(l=>!l.owner||l.owner==='未分配').length}</strong></div><div class="metric"><span>已过计划日期</span><strong>${leads.filter(overdue).length}</strong></div></div>${content}<div class="actions"><a href="../客户价值与设计说明.md">客户价值说明 ↗</a><a href="../流量采购待办计划.md">流量采购计划 ↗</a></div></section>`;
}
function samplesPage() {
  const list=leads.filter(l=>l.sample||l.items.some(x=>x.sample)||l.brief?.nextStep?.match(/sample|muster/i));
  return `<div class="notice">阶段由演示操作手动记录。不会安排真实寄样、发货或通知客户。</div><div class="grid">${list.map(l=>`<article class="feature"><span class="badge">${esc(l.sample?.stage||'待确认')}</span><h3>${esc(l.company)}</h3><p>${l.items.map(x=>pn(pget(x.id))).join(' / ')||'产品待确认'}</p><p class="muted">${esc(l.sample?.note||'确认样品配置、费用和交期。')}</p><button data-sample-record="${esc(l.id)}">管理样品进度</button></article>`).join('')||'<div class="empty">暂无样品申请。先在采购项目或产品页申请样品，再提交询价。</div>'}</div>`;
}
function sampleEditor(id) {
  const l=leadById(id); if(!l)return;
  openModal(`<span class="eyebrow">样品跟进 / ${esc(l.id)}</span><h2>${esc(l.company)}</h2><form id="sample-form" data-id="${esc(id)}"><label>样品阶段<select name="stage">${['待确认','配置确认','费用待确认','准备样品','已寄出（演示）','客户评估','已结束'].map(s=>`<option ${l.sample?.stage===s?'selected':''}>${s}</option>`).join('')}</select></label><label>计划日期<input type="date" name="date" value="${esc(l.sample?.date||'')}"></label><label>进展记录<textarea name="note" maxlength="2000">${esc(l.sample?.note||'')}</textarea></label><p class="notice">仅保存内部演示记录，不产生发货指令。</p><button class="primary">保存样品进度</button></form>`);
}
function analyticsPage() {
  const cutoff=reportRange==='all'?0:Date.now()-Number(reportRange)*86400000;
  const events=localEvents().filter(e=>Date.parse(e.at)>=cutoff&&(reportScope==='all'||(reportScope==='fixtures'?e.dummy:!e.dummy)));
  const totals=[['目录浏览','catalog_view'],['产品浏览','product_view'],['比较操作','comparison'],['已提交询价','inquiry_submit']].map(([label,type])=>[label,events.filter(e=>e.type===type).length]);
  const max=Math.max(1,...totals.map(x=>x[1]));
  const sources=[...new Set(leads.map(l=>l.source))];
  return `<div class="feature"><div class="section-head"><div><h3>本地操作记录</h3><p class="muted">包含预置虚构数据和本地演示操作，可切换查看。不是独立访客数或真实网站转化率。</p></div><select id="report-scope" aria-label="数据类型">${[['all','全部演示数据'],['fixtures','仅预置虚构数据'],['local','仅本地操作']].map(([v,n])=>`<option value="${v}" ${reportScope===v?'selected':''}>${n}</option>`).join('')}</select><select id="report-range" aria-label="时间范围">${[['all','全部记录'],['7','最近 7 天'],['30','最近 30 天']].map(([v,l])=>`<option value="${v}" ${reportRange===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="event-chart">${totals.map(([label,n])=>`<div class="event-row"><span>${label}</span><div class="event-track"><i style="width:${n/max*100}%"></i></div><strong>${n}</strong></div>`).join('')}</div><p class="muted">资料请求 ${events.filter(e=>e.type==='document_request').length} 次 · 已保存报价 ${events.filter(e=>e.type==='quote_saved').length} 次 · 跟进草稿 ${events.filter(e=>e.type==='draft_saved').length} 次</p></div><div class="feature" style="margin-top:24px"><h3>询盘来源与后续阶段 · 全部本地记录</h3><div class="table-wrap"><table><tr><th>来源</th><th>询盘</th><th>已保存报价</th><th>有效性</th></tr>${sources.map(s=>{const ls=leads.filter(l=>l.source===s);return `<tr><td>${esc(s)}</td><td>${ls.length}</td><td>${ls.filter(l=>l.quotation).length}</td><td>由销售核实，未自动推断</td></tr>`}).join('')}</table></div></div>`;
}
function leadDialog(id) {
  const l=leadById(id); if(!l)return;
  openModal(`<span class="eyebrow">客户记录 / ${esc(l.id)}</span><h2>${esc(l.company)}</h2><p>${esc(l.name)} · ${esc(l.email)} · ${esc(l.market)}</p><p class="notice">${esc(l.message)}</p>${briefDetails(l)}${l.documents?.length?`<h3>资料请求</h3><p>${l.documents.map(evidenceName).map(esc).join(' / ')}</p>`:''}<h3>询价产品</h3>${l.items.map(x=>`<div class="spec"><strong>${pn(pget(x.id))}</strong><span>${x.qty} 件 · ${esc(x.color)} ${x.sample?'· 样品':''}</span></div>`).join('')||'<p>一般项目咨询</p>'}<label for="lead-status">跟进状态</label><select id="lead-status" data-status="${esc(l.id)}">${statuses.map(s=>`<option ${l.status===s?'selected':''}>${s}</option>`).join('')}</select><div class="brief-grid"><label>负责人<input data-followup="owner" data-record="${esc(l.id)}" value="${esc(l.owner||'')}" placeholder="负责人"></label><label>计划跟进日期<input type="date" data-followup="due" data-record="${esc(l.id)}" value="${esc(l.due||'')}"></label></div><label>下一步<input data-followup="nextAction" data-record="${esc(l.id)}" value="${esc(l.nextAction||'')}" placeholder="具体跟进动作"></label><div class="actions"><button data-quote="${esc(l.id)}" class="primary">编辑报价草稿</button><button data-draft="${esc(l.id)}">准备跟进邮件</button><button data-sample-record="${esc(l.id)}">管理样品</button></div><h3 style="margin-top:28px">操作记录</h3><ol class="history">${(l.history||[]).slice(-8).reverse().map(h=>`<li><time>${esc(h.at.slice(0,16).replace('T',' '))} UTC</time> ${esc(h.text)}</li>`).join('')||'<li>暂无操作记录</li>'}</ol>`);
}
function quoteRows(lead) {
  return lead.quotation?.lines || (lead.items.length?lead.items.map(x=>({name:pget(x.id).name,qty:x.qty,price:''})): [{name:'Custom project / scope to confirm',qty:1,price:''}]);
}
function quotationFromFields(data, count) {
  const lines=Array.from({length:count},(_,i)=>({name:String(data['name'+i]||'').trim(),qty:Number(data['qty'+i]),price:data['price'+i]===''?'':Number(data['price'+i])}));
  if(!lines.length||lines.some(l=>!l.name||!Number.isFinite(l.qty)||l.qty<=0||!Number.isInteger(l.qty)||(l.price!==''&&(!Number.isFinite(l.price)||l.price<0))))throw new Error('请检查产品、正整数数量和非负单价。');
  const shipping=data.shipping===''?'':Number(data.shipping);
  if(shipping!==''&&(!Number.isFinite(shipping)||shipping<0))throw new Error('运费需要为非负数字。');
  return {lines,currency:['USD','EUR','CNY'].includes(data.currency)?data.currency:'USD',shipping,terms:String(data.terms||''),validUntil:String(data.validUntil||''),savedAt:new Date().toISOString()};
}
function quotationTotals(q) {
  const complete=q.lines.every(l=>l.price!=='')&&q.shipping!=='';
  const subtotal=q.lines.reduce((sum,l)=>sum+(l.price===''?0:Math.round(l.qty*l.price*100)),0)/100;
  return {complete,subtotal,total:Math.round((subtotal+Number(q.shipping||0))*100)/100};
}
function quote(id) {
  const l=leadById(id);if(!l)return;const q=l.quotation||{},rows=quoteRows(l);
  openModal(`<span class="eyebrow">HERSTAR / QUOTATION DRAFT</span><h2>编辑报价草稿</h2><p>${esc(l.company)} · ${esc(l.id)}</p>${briefDetails(l)}<form id="quote-form" data-id="${esc(id)}" data-count="${rows.length}"><div class="table-wrap"><table class="quote-table"><tr><th>产品 / 范围</th><th>数量</th><th>单价</th></tr>${rows.map((x,i)=>`<tr><td><input aria-label="产品 ${i+1}" name="name${i}" required value="${esc(x.name)}"></td><td><input aria-label="数量 ${i+1}" name="qty${i}" type="number" min="1" step="1" required value="${x.qty}"></td><td><input aria-label="单价 ${i+1}" name="price${i}" type="number" min="0" step="0.01" placeholder="待核价" value="${x.price}"></td></tr>`).join('')}</table></div><div class="brief-grid"><label>币种<select name="currency">${['USD','EUR','CNY'].map(c=>`<option ${c===(q.currency||'USD')?'selected':''}>${c}</option>`).join('')}</select></label><label>运费<input name="shipping" type="number" min="0" step="0.01" placeholder="待确认" value="${q.shipping??''}"></label></div><label>有效期<input type="date" name="validUntil" value="${esc(q.validUntil||'')}"></label><label>条款与待确认事项<textarea name="terms" maxlength="3000">${esc(q.terms||'交期、付款、税费、贸易条款及技术适用性待确认。')}</textarea></label><p class="notice">手动输入演示价格。空白单价保持待核价；草稿不会自动发送，也不构成商业报价。</p><p id="quote-error" role="alert"></p><button class="primary">保存并预览草稿</button></form>`);
}
function quoteMarkup(l) {
  const q=l.quotation,tot=quotationTotals(q);
  return `<div class="quotation"><span class="eyebrow">HERSTAR / DRAFT · NOT A COMMERCIAL OFFER</span><h2>报价草稿 / Quotation draft</h2><p>${esc(l.company)}<br>${esc(l.name)} · ${esc(l.email)}<br>${esc(l.id)} · ${esc(q.currency)}</p><table><tr><th>产品 / 范围</th><th>数量</th><th>单价</th><th>金额</th></tr>${q.lines.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.qty}</td><td>${x.price===''?'待核价':x.price.toFixed(2)}</td><td>${x.price===''?'待核价':(x.qty*x.price).toFixed(2)}</td></tr>`).join('')}</table><div class="spec"><span>运费</span><strong>${q.shipping===''?'待确认':q.shipping.toFixed(2)}</strong></div><div class="spec"><span>${tot.complete?'商品与运费合计（税费未计）':'合计'}</span><strong>${tot.complete?esc(q.currency)+' '+tot.total.toFixed(2):'待核价，不显示完整总额'}</strong></div><p>有效期：${esc(q.validUntil||'待确认')}</p><p class="notice">${esc(q.terms)}</p>${briefDetails(l)}<p>仅供演示和内部审核，不发送给客户。</p></div>`;
}
function quotePreview(id) {const l=leadById(id);openModal(quoteMarkup(l)+`<div class="actions"><button class="primary" data-quote-download="${esc(id)}">下载 HTML 草稿 ↓</button><button data-quote="${esc(id)}">返回编辑</button></div>`);}
function draftText(l, language) {
  const names=l.items.map(x=>pget(x.id).name).join(', ')||'your sourcing project';
  const next=l.nextAction||l.brief?.nextStep||'confirm the required configuration and next step';
  if(language==='de')return {subject:'Abstimmung Ihrer Projektanfrage — Herstar',body:`Guten Tag ${l.name},\n\nvielen Dank für Ihre Anfrage. Wir haben Ihre Projektanforderungen aufgenommen.\n\nKönnten Sie die benötigten Einbaumaße, die Stückzahl und den gewünschten Zeitplan bestätigen? Anschließend können wir die technische Eignung und die nächsten Schritte abstimmen. Preise, Unterlagen und Lieferzeiten müssen noch bestätigt werden.\n\nFreundliche Grüße\nHerstar`};
  if(language==='zh')return {subject:'恒升｜项目需求进一步确认',body:`${l.name}，您好：\n\n已收到贵司关于 ${names} 的需求。\n下一步拟安排：${next}。\n\n请协助确认安装尺寸、首批数量和期望时间。我们将在核实技术适用性后继续沟通，价格、资料与交期均以确认为准。\n\n恒升团队`};
  return {subject:'Your sourcing requirements — Herstar',body:`Hello ${l.name},\n\nThank you for your inquiry about ${names}. We have recorded your requirements.\n\nCould you confirm the required mounting dimensions, initial quantity and target timing? We can then review technical fit and agree the next step. Pricing, document availability and lead time remain to be confirmed.\n\nBest regards,\nHerstar`};
}
function draftEditor(id, language) {
  const l=leadById(id);if(!l)return;const chosen=language||l.draft?.language||(l.locale==='de-DE'?'de':'en');const draft=!language&&l.draft?l.draft:draftText(l,chosen);
  openModal(`<span class="eyebrow">FOLLOW-UP / DRAFT ONLY</span><h2>准备跟进邮件</h2><p>收件人（预览）：${esc(l.email)}</p><form id="draft-form" data-id="${esc(id)}"><label>草稿语言<select name="language" data-draft-language="${esc(id)}">${[['en','English'],['de','Deutsch'],['zh','简体中文']].map(([v,n])=>`<option value="${v}" ${chosen===v?'selected':''}>${n}</option>`).join('')}</select></label><label>主题<input name="subject" required maxlength="200" value="${esc(draft.subject)}"></label><label>正文<textarea name="body" rows="11" required maxlength="6000">${esc(draft.body)}</textarea></label><p class="notice">切换语言会生成新的模板，请先保存当前修改。草稿由固定模板生成，发送前需销售审核；本演示不发送邮件。德语模板需母语审校。</p><button class="primary">保存草稿</button>${l.draft?` <button type="button" data-draft-download="${esc(id)}">下载已保存草稿 ↓</button>`:''}</form>`);
}
function checklist() {
  return t('HERSTAR — SOURCING CHECKLIST\nPreparation guide, not a product specification\n\n1. Application and selected frame\n2. Desktop dimensions and mounting pattern\n3. Required load, travel and duty cycle with units\n4. Trial and annual quantities\n5. Finish, controller and packaging requirements\n6. Documents needed and applicable configuration\n7. Sample terms, tooling and target timeline\n8. Technical contact and requested next step\n\nAll capabilities, prices and document availability require confirmation.','恒升｜采购需求准备清单\n用于需求准备，不是产品规格书\n\n1. 应用与备选桌架\n2. 桌面尺寸及安装孔位\n3. 需求承重、行程与工作周期，注明单位\n4. 试单数量与年需求量\n5. 颜色、控制器及包装要求\n6. 所需资料及对应产品配置\n7. 样品费用、模具与计划时间\n8. 技术联系人与期望下一步\n\n产品能力、价格和资料可用性均需确认。');
}
let transcript=read('herstar-chat-transcript',window.HerstarFixtures?.conversation||[
  {role:'buyer',en:'Can we discuss a sample for 50 desk frames?',zh:'可以为 50 套桌架的项目沟通样品吗？'},
  {role:'assistant',en:'Yes. This is a fictional conversation for the client demo.',zh:'可以。这是用于客户演示的虚构对话。'}
]);
function chatReply(question){
  const q=question.toLowerCase();
  if(/sample|样品/.test(q))return {en:'For this fictional project, we can record one sample frame in black. Sample fees and delivery are placeholders to discuss, not confirmed terms.',zh:'这个虚构项目可以记录一套黑色桌架样品。样品费用与交期仍为待讨论项目，不是已确认条款。'};
  if(/document|drawing|资料|图纸/.test(q))return {en:'I will note dimensional drawings and packaging information in the demo handoff. Actual documents must be supplied and verified by Herstar.',zh:'我会在演示交接中记录尺寸图和包装资料需求。实际资料仍需恒升提供并核验。'};
  if(/price|quote|报价|价格/.test(q))return {en:'The backend contains fictional quotation examples. We can prepare a draft for 50 frames; no displayed price is a real offer.',zh:'后台已有虚构报价示例。可以为 50 套桌架准备草稿，显示的价格不构成真实报价。'};
  return {en:'Noted in this fictional conversation. The demo sales team can review the requirements in the handoff; no real agent or external service is connected.',zh:'已在虚构对话中记录。可以交给演示销售工作台查看；没有连接真人客服或外部服务。'};
}
function addChatMessage(text){
  transcript.push({role:'buyer',text}, {role:'assistant',...chatReply(text)});
  localStorage.setItem('herstar-chat-transcript',JSON.stringify(transcript));render();
}
function chatHTML() {
  return `${chat?`<aside class="chat-box"><strong>${t('Mia · Fictional sales adviser','Mia · 虚构销售顾问')}</strong><p class="muted">${t('Scripted conversation · Dummy data only','预设对话演示 · 全部为虚构数据')}</p><div class="chat-transcript" aria-live="polite">${transcript.map(m=>`<div class="bubble ${m.role==='buyer'?'buyer':''}"><small>${m.role==='buyer'?t('Alex · Demo buyer','Alex · 虚构买家'):t('Mia · Demo adviser','Mia · 虚构顾问')}</small><p>${esc(m.text||t(m.en,m.zh))}</p></div>`).join('')}</div><div class="chat-prompts">${[['Can we discuss a sample?','可以沟通样品吗？'],['Which documents can we request?','可以申请哪些资料？'],['Prepare a quotation draft.','准备一份报价草稿。']].map(([en,zh])=>`<button data-chat-prompt="${esc(t(en,zh))}">${t(en,zh)}</button>`).join('')}</div><form id="dummy-chat"><label>${t('Try a demo message','试写一条演示消息')}<input name="message" required maxlength="800" placeholder="${t('Ask about a sample…','询问样品…')}"></label><button class="primary">${t('Simulate reply','模拟回复')}</button></form><button data-chat-handoff class="primary">${t('Save conversation to demo backend →','将对话保存到演示后台 →')}</button><p class="muted">${t('Fictional buyer: Alex Morgan · alex.morgan@example.com. No messages are sent.','虚构买家：Alex Morgan · alex.morgan@example.com。不会发送任何消息。')}</p></aside>`:''}<button class="chat-toggle" data-action="chat">${chat?'×':t('Demo chat ↗','演示咨询 ↗')}</button>`;
}
// Events for the added workflows complement the original catalogue handlers.
document.addEventListener('click',e=>{
  const button=e.target.closest('button,a');if(!button)return;const d=button.dataset;
  if(d.chatPrompt)addChatMessage(d.chatPrompt);if(d.chatHandoff!==undefined){const id='DEMO-CHAT-'+Date.now().toString().slice(-8);leads.unshift({id,dummy:true,name:'Alex Morgan',company:'Northline Chat Demo · 虚构',email:'alex.morgan@example.com',market:'United States',message:transcript.map(m=>(m.role==='buyer'?'Buyer: ':'Adviser: ')+(m.text||t(m.en,m.zh))).join('\n'),conversation:structuredClone(transcript),items:[{id:'studio',qty:50,color:'Black',sample:true}],status:'待跟进',date:today(),source:'虚构聊天演示',owner:'未分配',nextAction:'核对样品与资料需求'});save();eventLog('inquiry_submit',{lead:id,source:'dummy-chat'});chat=false;location.hash='admin';render();notify('虚构对话已保存到工作台');}if(d.requestDoc){requestDocument(d.requestDoc);render();}
  if(d.download==='checklist'){downloadText('herstar-sourcing-checklist.txt',checklist());eventLog('resource_download');}
  if(d.productBrief){const p=pget(d.productBrief);downloadText(p.sku+'-selection-brief.txt',`${pn(p)} / ${p.sku}\n${t(...p.type)}\n${t(...p.profile)}\n\n${t('Demonstration identifier. Load, travel, MOQ, pricing and certifications must be confirmed.','演示型号。承重、行程、起订量、价格及认证需确认。')}\n\n${checklist()}`);eventLog('resource_download',{product:p.id});}
  if(d.sampleRecord)sampleEditor(d.sampleRecord);
  if(d.draft)draftEditor(d.draft);
  if(d.quoteDownload){const l=leadById(d.quoteDownload);downloadText(l.id+'-quotation-draft.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Herstar quotation draft</title><style>body{max-width:850px;margin:40px auto;padding:20px;font:16px/1.6 Arial}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #bbb;padding:12px;text-align:left}.spec{display:flex;justify-content:space-between;padding:12px}.notice{background:#eee;padding:18px}h2{font-size:28px}</style>${quoteMarkup(l)}</html>`,'text/html;charset=utf-8');}
  if(d.draftDownload){const l=leadById(d.draftDownload);downloadText(l.id+'-follow-up-draft.txt',`DRAFT — NOT SENT\nTo: ${l.email}\nSubject: ${l.draft.subject}\n\n${l.draft.body}`);}
  if(d.chat==='documents')document.querySelector('#chat-answer').innerHTML=link('resources',t('Select the documents you need →','选择所需资料 →'),'btn');
  if(d.action==='compare')eventLog('comparison');
  if(d.sample)eventLog('sample_added',{product:d.sample});
});
document.addEventListener('input',e=>{if(e.target.id==='lead-search'){leadSearch=e.target.value;document.querySelector('#lead-rows').innerHTML=leadTableRows();}});
document.addEventListener('change',e=>{
  if(e.target.id==='status-filter'){boardFilter=e.target.value;render();}
  if(e.target.id==='source-filter'){sourceFilter=e.target.value;render();}
  if(e.target.id==='report-scope'){reportScope=e.target.value;render();}if(e.target.id==='report-range'){reportRange=e.target.value;render();}
  if(e.target.dataset.draftLanguage)draftEditor(e.target.dataset.draftLanguage,e.target.value);
  if(e.target.dataset.status){const l=leadById(e.target.dataset.status);if(l)activity(l,'阶段更新为 '+e.target.value);}
  if(e.target.dataset.followup){const l=leadById(e.target.dataset.record);if(l)activity(l,'跟进安排已更新');}
});
document.addEventListener('submit',e=>{
  const f=e.target;if(f.id==='dummy-chat'){e.preventDefault();const text=new FormData(f).get('message');addChatMessage(String(text));return;}if(!['programme-form','sample-form','quote-form','draft-form','chat-capture'].includes(f.id))return;e.preventDefault();
  const data=Object.fromEntries(new FormData(f));const l=f.dataset.id?leadById(f.dataset.id):null;
  if(f.id==='programme-form'){basket.push({id:data.product,qty:1,color:'To confirm',sample:true});save();eventLog('sample_added',{product:data.product});location.hash='inquiry';}
  if(f.id==='sample-form'){l.sample={stage:data.stage,date:data.date,note:data.note};activity(l,'样品阶段：'+data.stage);modal.close();render();notify('样品进度已保存');}
  if(f.id==='quote-form'){try{l.quotation=quotationFromFields(data,Number(f.dataset.count));activity(l,'报价草稿已保存，未发送');eventLog('quote_saved',{lead:l.id});quotePreview(l.id);}catch(err){document.querySelector('#quote-error').textContent=err.message;}}
  if(f.id==='draft-form'){l.draft={language:data.language,subject:data.subject,body:data.body};activity(l,'跟进邮件草稿已保存，未发送');eventLog('draft_saved',{lead:l.id});draftEditor(l.id);notify('草稿已保存，未发送');}
  if(f.id==='chat-capture'){const id='HS-'+Date.now().toString().slice(-8);leads.unshift({id,name:t('Chat inquiry','咨询联系人'),company:t('Company to confirm','公司待确认'),email:data.email,market:'待确认',message:data.message,items:[],status:'待跟进',date:today(),source:'咨询入口 · 本地演示'});save();eventLog('inquiry_submit',{lead:id,source:'chat'});chat=false;render();notify(t('Demo request saved to the sales workspace.','演示咨询已保存到销售工作台。'));}
});
function recordPage() {
  const r=route();if(r==='catalog')eventLog('catalog_view');else if(r.startsWith('product/'))eventLog('product_view',{product:r.split('/')[1]});
}
window.addEventListener('hashchange',recordPage);
window.addEventListener('storage',e=>{if(e.key==='herstar-leads'){leads=read('herstar-leads',seed);if(!modal.open)render();}});
window.addEventListener('pageshow',()=>{leads=read('herstar-leads',seed);basket=read('herstar-basket',[]);requestedDocs=read('herstar-requested-docs',[]);if(!modal.open)render();});
recordPage();
render();
