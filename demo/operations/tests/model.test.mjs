import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,calculate,calculateAmoebas,limits} from '../model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('yield maintains mass balance and subtracts lost scrap recovery',()=>{
  const m=calculate();near(m.baseInput,m.p.goodKg+m.baseScrap);near(m.targetInput,m.p.goodKg+m.targetScrap);
  near(m.material,(10000/.9-10000/.94)*4.5);
  near(m.net,1935.6595744680917);near(m.yearOne,m.net*24-6000);
});
test('unchanged process has no savings before intervention cost',()=>{
  const m=calculate({...defaults,targetYield:90,targetEnergy:1200});near(m.gross,0);near(m.net,-300);assert.equal(m.payback,null);
});
test('worse targets produce losses and no positive payback',()=>{
  const m=calculate({...defaults,targetYield:70,targetEnergy:2000});assert.ok(m.net<0);assert.equal(m.payback,null);
});
test('delivery separates capacity from cash and handles zero downtime',()=>{
  const m=calculate(defaults,'delivery');near(m.recoveredMinutes,96);near(m.lateTarget,24);assert.equal(m.capacity,48);near(m.net,168);
  assert.equal(m.components.material,0);assert.equal(m.components.rework,0);
  const zero=calculate({...defaults,downtime:0},'delivery');near(zero.net,-120);near(zero.capacity,0);
});
test('quality uses only incremental rework cost, with no duplicated material benefit',()=>{
  const m=calculate(defaults,'quality');near(m.net,1240);near(m.lateBaseline,192);near(m.lateTarget,48);assert.equal(m.components.material,0);
});
test('released reporting hours never enter cash savings',()=>{
  const a=calculate(),b=calculate({...defaults,reports:100,minutesSaved:60});near(a.net,b.net);near(b.reportHours,100);
});
test('amoeba consolidation eliminates internal transfers and allocates benefit once',()=>{
  for(const scenario of ['yield','delivery','quality']){
    const m=calculate(defaults,scenario),before=calculateAmoebas(defaults,scenario),after=calculateAmoebas(defaults,scenario,true);
    const added=units=>units.reduce((sum,u)=>sum+u.revenue-u.current,0);
    near(added(after)-added(before),m.net);
    near(added(before),400000-before.reduce((sum,u)=>sum+u.external,0));
    assert.equal(after.filter((u,i)=>Math.abs(u.current-before[i].current)>1e-8).length,1);
  }
});
test('financial model and unit costs stay consistent at each slider boundary',()=>{
  for(const [key,[min,max]] of Object.entries(limits))for(const v of [min,max])for(const scenario of ['yield','delivery','quality']){
    const p={...defaults,[key]:v},m=calculate(p,scenario),units=calculateAmoebas(p,scenario,true);
    assert.ok(Number.isFinite(m.net));units.forEach(u=>assert.ok(u.current>=0));
    const improvement=units.reduce((sum,u)=>sum+u.expense-u.current,0);near(improvement,m.net);
  }
});
test('invalid math and unknown scenario fail visibly',()=>{
  assert.throws(()=>calculate({...defaults,targetYield:0}));assert.throws(()=>calculate({...defaults,cycle:0}));assert.throws(()=>calculate({...defaults,goodKg:NaN}));assert.throws(()=>calculate(defaults,'invalid'));
});
