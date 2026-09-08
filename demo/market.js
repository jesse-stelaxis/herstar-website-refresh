const brief=document.querySelector('#market-brief');
document.querySelectorAll('[data-frame]').forEach(button=>button.addEventListener('click',()=>{
  brief.elements.namedItem('frame').value=button.dataset.frame;
  document.querySelector('#brief').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  brief.elements.namedItem('name').focus({preventScroll:true});
}));
document.querySelector('#units').addEventListener('change',event=>{
  const imperial=event.target.value==='imperial';
  // Convert entered requests as well as labels; never reinterpret an existing number.
  for(const name of ['width','stroke','load']){const field=brief.elements.namedItem(name);if(field.value){const factor=name==='load'?2.2046226218:1/25.4;field.value=String(Number((Number(field.value)*(imperial?factor:1/factor)).toFixed(4)))}}
  document.querySelectorAll('[data-unit]').forEach(el=>el.textContent=el.dataset.unit==='load'?(imperial?'lb':'kg'):(imperial?'in':'mm'));
});
brief.addEventListener('submit',event=>{
  event.preventDefault();const form=new FormData(brief),data=Object.fromEntries(form),config=window.marketConfig;
  const selected=form.getAll('document').map(i=>config.docs[Number(i)]);
  const record={id:'HS-'+Date.now().toString().slice(-8),name:data.name,company:data.company,email:data.email,market:config.market==='de'?'Germany':'United States',locale:config.market==='de'?'de-DE':'en-US',message:data.message||'',items:data.frame?[{id:data.frame,qty:Number(data.qty),color:config.market==='de'?'Noch abzustimmen':'To be confirmed'}]:[],status:'待跟进',date:new Date().toISOString().slice(0,10),source:'地区采购页 / '+config.market+' · 本地演示',brief:{units:data.units,width:Number(data.width),load:Number(data.load),stroke:Number(data.stroke),qty:Number(data.qty),stage:config.stages[Number(data.stage)],documents:selected,nextStep:config.nexts[Number(data.nextStep)]},owner:'未分配',nextAction:'确认工程需求并回复',due:''};
  let leads=[];try{leads=JSON.parse(localStorage.getItem('herstar-leads'))||[]}catch{}
  leads.unshift(record);window.HerstarDemo?.record('inquiry_submit',{lead:record.id,source:config.market});localStorage.setItem('herstar-leads',JSON.stringify(leads));brief.hidden=true;const success=document.querySelector('#success');success.hidden=false;success.focus();
});
