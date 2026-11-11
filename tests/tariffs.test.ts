import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultTariffs,estimateLines,estimateTotal,resolveEstimate,roomQuantity,tariffErrors,tariffPrice,tariffsFrom,tierPercent} from '../lib/tariffs';
import {totals} from '../lib/model';

const parquet=defaultTariffs.find(x=>x.id==='parquet-stratifie')!;
const room={name:'Salon',length:5,width:4,height:2.5,unit:'m'};

test('tariff price follows quantity and degressive tiers',()=>{
 assert.equal(tariffPrice(parquet,1).total,40);
 assert.equal(tariffPrice(parquet,10).total,400);
 assert.equal(tierPercent(parquet,19.99),0);
 const twenty=tariffPrice(parquet,20);
 assert.equal(twenty.percent,5);assert.equal(twenty.total,760);assert.equal(twenty.listTotal,800);
 assert.equal(twenty.material+twenty.labour,twenty.total);
 assert.equal(tariffPrice(parquet,50).total,1800);
});

test('room quantities come from measures and convert feet to metres',()=>{
 const by=(id:string)=>defaultTariffs.find(x=>x.id===id)!;
 assert.equal(roomQuantity(room,by('parquet-stratifie')),20);
 assert.equal(roomQuantity(room,by('peinture-murs')),45);
 assert.equal(roomQuantity(room,by('plinthes')),18);
 assert.equal(roomQuantity(room,by('porte-interieure')),0);
 assert.equal(roomQuantity({length:10,width:10,height:8,unit:'pi'},by('parquet-stratifie')),9.29);
 assert.equal(roomQuantity({length:10,width:10,height:8,unit:'pi'},by('plinthes')),12.19);
});

test('visit estimate produces split quote lines whose totals match',()=>{
 const tariffs=tariffsFrom(undefined);
 const items=resolveEstimate([{tariffId:'parquet-stratifie',room:'Salon',quantity:1,auto:true},{tariffId:'peinture-murs',room:'Salon',quantity:45},{tariffId:'supprime',room:'Salon',quantity:3}],[room],tariffs);
 assert.equal(items.length,2);assert.equal(items[0].quantity,20);
 const sum=estimateTotal(items,tariffs),lines=estimateLines(items,tariffs);
 assert.equal(sum.total,1570);assert.equal(lines.length,2);
 assert.equal(lines[0].pricing_mode,'split');assert.equal(lines[0].material_cost+lines[0].labour_cost,lines[0].price);
 assert.equal(totals({lines,tps:0,tvq:0}).total,sum.total);
});

test('settings grid is sanitised and validated',()=>{
 assert.equal(tariffsFrom(undefined).length,defaultTariffs.length);
 assert.deepEqual(tariffsFrom([]),[]);
 const [clean]=tariffsFrom([{id:'x',name:' Moquette ',basis:'nope',unit:'',material:-4,labour:'12',tiers:[{from:50,percent:10},{from:0,percent:5},{from:10,percent:200}]}]);
 assert.equal(clean.name,'Moquette');assert.equal(clean.basis,'manual');assert.equal(clean.unit,'unité');assert.equal(clean.material,0);assert.equal(clean.labour,12);
 assert.deepEqual(clean.tiers,[{from:10,percent:90},{from:50,percent:10}]);
 assert.ok(tariffErrors([{...parquet,name:''}]).length);
 assert.ok(tariffErrors([parquet,{...parquet,id:'b'}]).some(e=>e.includes('même nom')));
 assert.deepEqual(tariffErrors(defaultTariffs),[]);
});
