/* Connect the copied manufacturing page's existing RFQ to the B2B demo. */
(() => {
  const form = document.getElementById('rfq-form');
  if (!form) return;
  form.removeAttribute('novalidate');
  ['name','company','email','country','message'].forEach(name=>{
    const field=form.elements.namedItem(name);
    if(field)field.required=true;
  });
  const note=document.getElementById('rfq-note');
  if(note)note.textContent='Client demo — use fictional contact details. Submissions stay in this browser and appear in the sales workspace.';
  form.addEventListener('submit', event=>{
    event.preventDefault();
    const data=Object.fromEntries(new FormData(form));
    let leads=[];
    try{leads=JSON.parse(localStorage.getItem('herstar-leads'))||[]}catch{}
    leads.unshift({id:'HS-'+Date.now().toString().slice(-8),name:data.name,company:data.company,email:data.email,market:data.country,message:[data.message,data.application,data.volume,data.stroke&&'Stroke: '+data.stroke,data.load&&'Load: '+data.load].filter(Boolean).join(' · '),items:[],status:'待跟进',source:'制造展示询价 · 本地演示',date:new Date().toISOString().slice(0,10)});
    localStorage.setItem('herstar-leads',JSON.stringify(leads));
    window.HerstarDemo?.record('inquiry_submit',{lead:leads[0].id,source:'manufacturing'});
    note.textContent='Demo inquiry saved. Open the sales workspace to review it.';
    const link=document.createElement('a');link.href='portal.html#admin';link.textContent=' 销售工作台 →';note.appendChild(link);
    form.reset();
  });
})();
