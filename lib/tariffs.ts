import Decimal from 'decimal.js';
import type {Data} from './model';

/*
 * Grille tarifaire de l'entreprise, modifiable dans Paramètres › Tarifs.
 * Chaque poste a un prix unitaire séparé en matériaux et main-d'œuvre, et des paliers
 * dégressifs facultatifs (« à partir de 10 m² : −5 % »). La même règle sert au simulateur
 * des paramètres, au chiffrage de fin de visite et aux lignes de devis / facture créées.
 */
export type TariffBasis='floor'|'wall'|'ceiling'|'perimeter'|'manual';
export type TariffTier={from:number;percent:number};
export type Tariff={id:string;name:string;category:string;basis:TariffBasis;unit:string;material:number;labour:number;tiers:TariffTier[];active:boolean};
export type Room={name?:string;length?:number;width?:number;height?:number;unit?:string};

export const basisLabels:Record<TariffBasis,string>={floor:'Surface au sol',wall:'Surface des murs',ceiling:'Surface du plafond',perimeter:'Périmètre (linéaire)',manual:'Quantité saisie'};
export const tariffCategories=['Sols','Murs','Plafonds','Menuiserie','Cuisine & salle de bain','Électricité & plomberie','Préparation'] as const;

const M_PER_FT=0.3048;
const cent=(n:Decimal)=>n.toDecimalPlaces(2,Decimal.ROUND_HALF_UP);
const num=(value:unknown,max=1e7)=>{const n=Number(value);return Number.isFinite(n)&&n>0?Math.min(n,max):0};
const text=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max):'';
const bases=Object.keys(basisLabels) as TariffBasis[];

const t=(id:string,name:string,category:string,basis:TariffBasis,unit:string,material:number,labour:number,tiers:TariffTier[]=[]):Tariff=>({id,name,category,basis,unit,material,labour,tiers,active:true});
const volume:TariffTier[]=[{from:20,percent:5},{from:50,percent:10}];
/** Prix de départ indicatifs : à remplacer par ceux de l'entreprise dans les paramètres. */
export const defaultTariffs:Tariff[]=[
 t('parquet-stratifie','Parquet stratifié','Sols','floor','m²',22,18,volume),
 t('parquet-chene','Parquet chêne massif','Sols','floor','m²',65,35,volume),
 t('sol-vinyle','Sol vinyle (LVT)','Sols','floor','m²',28,16,volume),
 t('carrelage-sol','Carrelage au sol','Sols','floor','m²',35,45,volume),
 t('plinthes','Plinthes','Sols','perimeter','m',6,7),
 t('peinture-murs','Peinture des murs (2 couches)','Murs','wall','m²',4,14,[{from:50,percent:5},{from:120,percent:10}]),
 t('faience','Faïence murale','Murs','wall','m²',30,48),
 t('placo','Cloison ou doublage en plaques de plâtre','Murs','wall','m²',14,26),
 t('peinture-plafond','Peinture du plafond (2 couches)','Plafonds','ceiling','m²',4,17),
 t('porte-interieure','Pose d’une porte intérieure','Menuiserie','manual','unité',180,120),
 t('plan-travail','Plan de travail','Cuisine & salle de bain','manual','m',220,90),
 t('prise-electrique','Prise ou interrupteur','Électricité & plomberie','manual','unité',18,55),
 t('depose','Dépose et évacuation de l’ancien revêtement','Préparation','floor','m²',2,12)
];

/** Lecture tolérante des réglages : une grille absente donne la grille de départ, une grille vide reste vide. */
export function tariffsFrom(value:unknown):Tariff[]{
 if(!Array.isArray(value))return defaultTariffs.map(x=>({...x,tiers:x.tiers.map(tier=>({...tier}))}));
 return value.filter(x=>x&&typeof x==='object').slice(0,300).map((x:Data)=>({
  id:text(x.id,80)||crypto.randomUUID(),name:text(x.name,120),category:text(x.category,60)||'Divers',
  basis:bases.includes(x.basis)?x.basis as TariffBasis:'manual',unit:text(x.unit,20)||'unité',
  material:num(x.material),labour:num(x.labour),active:x.active!==false,
  tiers:(Array.isArray(x.tiers)?x.tiers:[]).map((tier:Data)=>({from:num(tier?.from),percent:Math.min(90,num(tier?.percent))})).filter((tier:TariffTier)=>tier.from>0&&tier.percent>0).sort((a:TariffTier,b:TariffTier)=>a.from-b.from).slice(0,6)
 }));
}
export function tariffErrors(list:Tariff[]){
 const errors:string[]=[];
 list.forEach((x,i)=>{if(!x.name.trim())errors.push(`Poste ${i+1} : indiquez un nom.`);if(!x.unit.trim())errors.push(`${x.name||`Poste ${i+1}`} : indiquez une unité.`)});
 const names=list.map(x=>x.name.trim().toLocaleLowerCase('fr')).filter(Boolean);
 if(new Set(names).size!==names.length)errors.push('Deux postes portent le même nom.');
 return errors;
}

/** Remise dégressive applicable à une quantité : le palier le plus élevé atteint. */
export function tierPercent(tariff:Tariff,quantity:number){return tariff.tiers.reduce((best,tier)=>quantity>=tier.from?Math.max(best,tier.percent):best,0)}

/** Prix d'un poste pour une quantité donnée, hors taxes, arrondi au centime. */
export function tariffPrice(tariff:Tariff,quantity:number){
 const q=Math.max(0,Number(quantity)||0),percent=tierPercent(tariff,q),factor=new Decimal(100).minus(percent).div(100);
 const material=cent(new Decimal(tariff.material).times(factor)),labour=cent(new Decimal(tariff.labour).times(factor)),unit=material.plus(labour);
 return {quantity:q,percent,unitMaterial:material.toNumber(),unitLabour:labour.toNumber(),unit:unit.toNumber(),material:cent(material.times(q)).toNumber(),labour:cent(labour.times(q)).toNumber(),total:cent(unit.times(q)).toNumber(),listTotal:cent(new Decimal(tariff.material).plus(tariff.labour).times(q)).toNumber()};
}

const isMetric=(unit:string)=>/^m/.test(unit.trim().toLowerCase());
/** Quantité déduite des mesures d'une pièce, exprimée dans l'unité du poste (m ↔ pi convertis). */
export function roomQuantity(room:Room,tariff:Pick<Tariff,'basis'|'unit'>){
 const l=num(room.length,1e4),w=num(room.width,1e4),h=num(room.height,1e3);
 const raw=tariff.basis==='floor'||tariff.basis==='ceiling'?l*w:tariff.basis==='wall'?2*(l+w)*h:tariff.basis==='perimeter'?2*(l+w):0;
 if(!raw)return 0;
 const roomMetric=(room.unit||'m')==='m',target=isMetric(tariff.unit);
 const linear=roomMetric===target?1:roomMetric?1/M_PER_FT:M_PER_FT;
 return new Decimal(raw).times(tariff.basis==='perimeter'?linear:linear*linear).toDecimalPlaces(2,Decimal.ROUND_HALF_UP).toNumber();
}

export type EstimateItem={tariffId:string;room:string;quantity:number;auto?:boolean};
/** Postes cochés pendant la visite → montants, en ignorant les postes supprimés depuis. */
export function estimateRows(items:unknown,tariffs:Tariff[]){
 const list=Array.isArray(items)?items as EstimateItem[]:[];
 return list.flatMap(item=>{const tariff=tariffs.find(x=>x.id===item?.tariffId);if(!tariff||!(Number(item.quantity)>0))return [];return [{item,tariff,price:tariffPrice(tariff,Number(item.quantity))}]});
}
export function estimateTotal(items:unknown,tariffs:Tariff[]){
 const rows=estimateRows(items,tariffs);
 return {material:cent(rows.reduce((s,r)=>s.plus(r.price.material),new Decimal(0))).toNumber(),labour:cent(rows.reduce((s,r)=>s.plus(r.price.labour),new Decimal(0))).toNumber(),total:cent(rows.reduce((s,r)=>s.plus(r.price.total),new Decimal(0))).toNumber(),count:rows.length};
}
/** Lignes de devis ou de facture : un instantané, qui ne change plus si la grille est modifiée ensuite. */
export function estimateLines(items:unknown,tariffs:Tariff[]):Data[]{
 return estimateRows(items,tariffs).map(({item,tariff,price})=>({description:`${tariff.name}${item.room?` — ${item.room}`:''}`,category:tariff.category,quantity:price.quantity,unit:tariff.unit,price:price.unit,pricing_mode:'split',material_cost:price.unitMaterial,labour_cost:price.unitLabour,tariff_id:tariff.id,...(price.percent?{notes:`Tarif dégressif appliqué : −${price.percent} %`}:{})}));
}

export const roomLabel=(room:Room,index:number)=>String(room?.name||'').trim()||`Pièce ${index+1}`;
/** Les postes « automatiques » suivent les mesures : leur quantité est recalculée si la pièce change. */
export function resolveEstimate(items:unknown,rooms:unknown,tariffs:Tariff[]):EstimateItem[]{
 const list=Array.isArray(items)?items as (EstimateItem&{auto?:boolean})[]:[],spaces=Array.isArray(rooms)?rooms as Room[]:[];
 return list.filter(item=>item&&tariffs.some(x=>x.id===item.tariffId)).map(item=>{
  if(!item.auto)return item;
  const tariff=tariffs.find(x=>x.id===item.tariffId)!,index=spaces.findIndex((room,i)=>roomLabel(room,i)===item.room);
  return index<0?item:{...item,quantity:roomQuantity(spaces[index],tariff)};
 });
}
