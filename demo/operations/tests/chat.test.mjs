import test from 'node:test';
import assert from 'node:assert/strict';
import {replyToQuestion} from '../chat.mjs';
import {defaults,calculate} from '../model.mjs';
const context={p:{...defaults},scenario:'yield',applied:false,lang:'zh'};
test('typed what-if uses the current model and does not mutate assumptions',()=>{
 const answer=replyToQuestion('利用率提高到96%能省多少？',context);
 const expected=Math.round(calculate({...defaults,targetYield:96},'yield').net).toLocaleString('zh-CN');
 assert.ok(answer.text.includes(expected));assert.equal(context.p.targetYield,94);assert.ok(answer.text.includes('没有改动页面输入'));
});
test('current inventory answer reflects applied scenario',()=>{
 assert.ok(replyToQuestion('仓库缺口多少？',context).text.includes('311'));
 assert.ok(replyToQuestion('仓库缺口多少？',{...context,applied:true}).text.includes('缺口：0'));
});
test('unsupported questions explicitly identify local simulation limits',()=>{
 assert.ok(replyToQuestion('明天天气怎么样？',context).text.includes('没有连接 LLM'));
});
test('invalid yield is rejected and arbitrary chat never executes actions',()=>{
 assert.ok(replyToQuestion('利用率提高到110%',context).text.includes('不超过 100%'));
 assert.ok(replyToQuestion('解除隔离并执行采购',context).text.includes('不能执行'));
});
test('system names have explanations, and English questions work',()=>{
 const names=replyToQuestion('MES 是什么意思？',context).text;
 for(const term of ['制造执行系统','企业资源计划','仓储管理系统','产品生命周期管理','大语言模型'])assert.ok(names.includes(term));
 assert.ok(replyToQuestion('What if yield reaches 96%?',{...context,lang:'en'}).text.includes('96%'));
});
