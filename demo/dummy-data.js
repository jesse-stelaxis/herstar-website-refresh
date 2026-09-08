/* Fictional fixtures for the client demo. No real people, accounts or messages. */
(function () {
  const marker='herstar-fictional-fixtures-v1';
  const day=offset=>{const date=new Date();date.setUTCDate(date.getUTCDate()+offset);return date.toISOString().slice(0,10)};
  const names=[['Avery Cole','Northline Office Lab','United States','daily',50,'待跟进'],['Lena Weber','Formwerk Demo Studio','Germany','studio',120,'已报价'],['Noah Bennett','Harbor Workspace Demo','United Kingdom','softline',80,'样品沟通'],['Camille Laurent','Atelier Bureau Demo','France','together',30,'已联系'],['Luca Moretti','Linea Office Demo','Italy','longview',100,'待跟进'],['Emma de Vries','Studio Noord Demo','Netherlands','roam',40,'样品沟通'],['Oliver Reed','Maple Workspaces Demo','Canada','nook',60,'已关闭'],['Hanna Keller','Werkraum Demo GmbH','Germany','studio',200,'已报价']];
  const records=names.map(([name,company,market,product,qty,status],i)=>{
    const email=name.toLowerCase().replaceAll(' ','.')+'@example.com';
    const lead={id:'DEMO-'+String(i+1).padStart(3,'0'),dummy:true,name,company:company+' · 虚构',email,market,locale:market==='Germany'?'de-DE':'en-US',message:'Fictional sourcing brief: please review mounting dimensions, sample terms and packaging for our next workspace collection.',items:[{id:product,qty,color:i%2?'Black':'White',sample:[2,5].includes(i)}],status,date:day(-i),source:['定向采购页 · 虚构','自然搜索 · 虚构','展会后续 · 虚构','咨询对话 · 虚构'][i%4],owner:i===0?'未分配':['陈宁（虚构）','李文（虚构）','周悦（虚构）'][i%3],nextAction:['确认安装尺寸','准备技术与报价草稿','收集样品评估反馈','补充包装要求'][i%4],due:day(i%3===0?-1:2+i),documents:['drawing','packaging'],brief:{units:'metric',width:1400,load:80,stroke:500,qty,stage:status==='样品沟通'?'Sample evaluation':'Technical evaluation',documents:['Dimensional drawing','Packaging details'],nextStep:status==='样品沟通'?'Sample discussion':'Technical review'},history:[{at:day(-i)+'T09:00:00.000Z',text:'预置虚构询盘，用于客户演示'}]};
    if([1,7].includes(i))lead.quotation={currency:market==='Germany'?'EUR':'USD',lines:[{name:'Square dual-motor frame — demo configuration',qty,price:88}],shipping:180,terms:'虚构演示价格；付款、交期、税费与技术适用性尚未确认。不得用于真实交易。',validUntil:day(14),savedAt:day(-1)+'T10:00:00.000Z'};
    if([2,5].includes(i))lead.sample={stage:i===2?'客户评估':'准备样品',date:day(4),note:'虚构进展：安装图已记录，等待样品评估意见。无实际寄送。'};
    if([1,2,7].includes(i))lead.draft={language:'en',subject:'Draft only — sample and specification review',body:`Hello ${name},\n\nThis is a fictional follow-up for the Herstar demonstration. Please review the mounting dimensions and trial quantity in the sample brief.\n\nNo message has been sent.\nHerstar demo team`};
    return lead;
  });
  const conversation=[{role:'buyer',en:'We are planning a trial order of 50 desk frames. Can we discuss a sample first?',zh:'我们计划试订 50 套桌架，可以先沟通样品吗？'},{role:'assistant',en:'Of course. For this fictional project, let’s confirm the frame, finish and mounting requirements before preparing the sample brief.',zh:'可以。这是一个虚构项目，我们先确认桌架、颜色和安装要求，再准备样品需求。'}];
  window.HerstarFixtures={records,conversation};
  if(localStorage.getItem(marker))return;
  let existing=[];try{existing=JSON.parse(localStorage.getItem('herstar-leads'))||[]}catch{}
  localStorage.setItem('herstar-leads',JSON.stringify([...records.filter(r=>!existing.some(x=>x.id===r.id)),...existing]));
  let events=[];try{events=JSON.parse(localStorage.getItem('herstar-demo-events'))||[]}catch{}
  for(const [type,count] of [['catalog_view',48],['product_view',31],['comparison',12],['inquiry_submit',8],['document_request',6],['quote_saved',2],['draft_saved',3]])for(let n=0;n<count;n++)events.push({type,at:day(-(n%6))+'T10:00:00.000Z',dummy:true,source:'fixture'});
  localStorage.setItem('herstar-demo-events',JSON.stringify(events));
  if(!localStorage.getItem('herstar-chat-transcript'))localStorage.setItem('herstar-chat-transcript',JSON.stringify(conversation));
  localStorage.setItem(marker,'loaded');
})();
