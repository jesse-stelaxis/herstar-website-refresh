const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const events={},handlers={},nodes=new Map(),storage=new Map();
function node(){return {innerHTML:'',style:{},textContent:'',open:false,showModal(){this.open=true},close(){this.open=false}}}
const context={console,structuredClone,Date,setTimeout:()=>1,clearTimeout(){},location:{hash:''},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{body:{className:''},documentElement:{lang:''},querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:(e,cb)=>{(handlers[e]||=[]).push(cb);events[e]=event=>handlers[e].forEach(fn=>fn(event))}},window:{addEventListener(){},scrollTo(){}},FormData:class{constructor(form){this.entries=Object.entries(form.fields).flatMap(([k,v])=>Array.isArray(v)?v.map(item=>[k,item]):[[k,v]])}[Symbol.iterator](){return this.entries[Symbol.iterator]()}getAll(key){return this.entries.filter(([k])=>k===key).map(([,v])=>v)}}};
vm.createContext(context);for(const file of ['activity.js','app.js','features.js'])vm.runInContext(fs.readFileSync('demo/'+file,'utf8'),context);
const run=s=>vm.runInContext(s,context);const submit=(id,fields,dataset={})=>events.submit({target:{id,fields,dataset},preventDefault(){}});
for(const r of ['catalog','product/daily','company','inquiry','admin','admin/analytics','admin/pipeline','admin/samples','guide','resources','offers']){context.location.hash='#'+r;run('render()');assert.ok(nodes.get('#app').innerHTML.length>600,r)}
submit('configure',{qty:'50',color:'White'},{id:'daily',shop:'false'});assert.equal(JSON.parse(storage.get('herstar-basket'))[0].qty,50);
submit('inquiry-form',{name:'Test Buyer',company:'<script>example</script>',email:'buyer@example.com',market:'US',message:'Sample requested',documents:['drawing','testing']});let leads=JSON.parse(storage.get('herstar-leads'));assert.equal(leads.length,3);assert.deepEqual(leads[0].documents,['drawing','testing']);assert.equal(leads[0].items[0].id,'daily');assert.equal(JSON.parse(storage.get('herstar-basket')).length,0);context.location.hash='#admin';run('render()');assert.ok(nodes.get('#app').innerHTML.includes('&lt;script&gt;example&lt;/script&gt;'));
events.change({target:{dataset:{status:leads[0].id},value:'已报价'}});assert.equal(JSON.parse(storage.get('herstar-leads'))[0].status,'已报价');run(`quote('${leads[0].id}')`);assert.ok(nodes.get('#dialog').innerHTML.includes('待核价'));
run("compare=['daily','studio'];compareDialog()");assert.ok(nodes.get('#dialog').innerHTML.includes('Square dual-motor frame'));
run("query='no-such-product';filter='all'");assert.ok(run('results()').includes('No matching products'));
run("lang='zh';query='';render()");assert.equal(context.document.documentElement.lang,'zh-CN');
const paths=[...fs.readFileSync('demo/style.css','utf8').matchAll(/url\('([^']+)'\)/g)].map(x=>x[1]).filter(p=>!p.startsWith('http'));for(const p of paths)assert.ok(fs.existsSync('demo/'+p),p);for(const p of run('products.map(pi)'))assert.ok(fs.existsSync('demo/'+p),p);
const crypto=require('node:crypto');for(const [p,hash] of Object.entries(JSON.parse(fs.readFileSync('demo/original-checksums.json','utf8'))))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash,p);
assert.ok(!run('header()').includes('Bag ('));
assert.ok(!fs.readFileSync('demo/app.js','utf8').includes('checkout'));

const recordId=JSON.parse(storage.get('herstar-leads'))[0].id;
for(const [key,value] of [['owner','项目销售'],['nextAction','确认安装图'],['due','2026-09-15']])events.change({target:{dataset:{followup:key,record:recordId},value}});
assert.equal(JSON.parse(storage.get('herstar-leads'))[0].nextAction,'确认安装图');
run("leads[0].brief={units:'metric',width:1200,load:80,stroke:500,qty:50,stage:'Technische Prüfung',documents:['Maßzeichnung'],nextStep:'Muster besprechen'};leads[0].locale='de-DE'");
run(`quote('${recordId}')`);assert.ok(nodes.get('#dialog').innerHTML.includes('Maßzeichnung'));assert.ok(nodes.get('#dialog').innerHTML.includes('1200 mm'));

// Saved quotes, drafts and sample steps persist through their actual form handlers.
submit('quote-form',{name0:'Frame <test>',qty0:'3',price0:'125.50',currency:'USD',shipping:'20',terms:'Review <script>',validUntil:'2026-10-01'},{id:recordId,count:'1'});
assert.equal(JSON.parse(storage.get('herstar-leads'))[0].quotation.lines[0].price,125.5);
assert.ok(nodes.get('#dialog').innerHTML.includes('396.50'));
assert.ok(nodes.get('#dialog').innerHTML.includes('Frame &lt;test&gt;'));
assert.ok(nodes.get('#dialog').innerHTML.includes('Review &lt;script&gt;'));
assert.equal(run('quotationTotals(leads[0].quotation).complete'),true);
run("leads[0].quotation.lines[0].price=''");assert.equal(run('quotationTotals(leads[0].quotation).complete'),false);
assert.throws(()=>run("quotationFromFields({name0:'Frame',qty0:'-1',price0:'10',shipping:'0'},1)"));
submit('draft-form',{language:'en',subject:'Follow-up',body:'Please confirm the drawing.'},{id:recordId});
assert.equal(JSON.parse(storage.get('herstar-leads'))[0].draft.body,'Please confirm the drawing.');
submit('sample-form',{stage:'配置确认',date:'2026-09-20',note:'Await drawing review.'},{id:recordId});
assert.equal(JSON.parse(storage.get('herstar-leads'))[0].sample.stage,'配置确认');
run("boardFilter='已报价';leadSearch='<script>';sourceFilter='all'");assert.equal(run('visibleLeads().length'),1);
assert.ok(run('samplesPage()').includes('配置确认'));
run("requestDocument('packaging')");assert.ok(JSON.parse(storage.get('herstar-requested-docs')).includes('packaging'));
assert.equal(run("localEvents().filter(e=>e.type==='quote_saved').length"),1);
assert.equal(run("localEvents().filter(e=>e.type==='draft_saved').length"),1);
assert.equal(run("localEvents().filter(e=>e.type==='inquiry_submit').length"),1);
submit('chat-capture',{email:'chat@example.com',message:'Please confirm the sample terms.'});
assert.equal(JSON.parse(storage.get('herstar-leads'))[0].source,'咨询入口 · 本地演示');
assert.equal(run("localEvents().filter(e=>e.type==='inquiry_submit').length"),2);
assert.ok(run('analyticsPage()').includes('本地操作记录'));
assert.ok(run('leads.some(l=>l.history?.length>=5)'));
run("addChatMessage('Can we discuss a sample?')");
assert.ok(JSON.parse(storage.get('herstar-chat-transcript')).some(m=>m.en?.includes('fictional project')));
assert.ok(run('chatHTML()').includes('演示咨询'));
console.log('PASS: all routes, inquiry transfer, escaped customer input, status persistence, quotation, comparison, empty search, language toggle, product assets, B2B-only navigation, and original B2B/B2C checksums.');
