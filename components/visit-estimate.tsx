'use client';
import {Plus,Trash2} from 'lucide-react';
import {money,round,totals,type Data} from '@/lib/model';
import {basisLabels,estimateLines,estimateTotal,resolveEstimate,roomLabel,roomQuantity,tariffPrice,type EstimateItem,type Room,type Tariff} from '@/lib/tariffs';

type Props={rooms:Room[];tariffs:Tariff[];value:unknown;taxes:{tps:number;tvq:number};onChange:(items:EstimateItem[])=>void};
const quantity=(value:string)=>{const n=Number(value.replace(',','.'));return Number.isFinite(n)&&n>=0?n:0};

/** Dernière étape de la visite : on coche les travaux par pièce, les quantités viennent des mesures et les prix de la grille tarifaire. */
export default function VisitEstimate({rooms,tariffs,value,taxes,onChange}:Props){
 const active=tariffs.filter(x=>x.active),measured=active.filter(x=>x.basis!=='manual'),manual=active.filter(x=>x.basis==='manual');
 const items=resolveEstimate(value,rooms,tariffs);
 const find=(tariffId:string,room:string)=>items.find(x=>x.tariffId===tariffId&&x.room===room);
 const toggle=(tariff:Tariff,room:Room,label:string)=>onChange(find(tariff.id,label)?items.filter(x=>!(x.tariffId===tariff.id&&x.room===label)):[...items,{tariffId:tariff.id,room:label,quantity:roomQuantity(room,tariff),auto:true}]);
 const setQuantity=(item:EstimateItem,next:number)=>onChange(items.map(x=>x===item?{...x,quantity:next,auto:false}:x));
 const sum=estimateTotal(items,tariffs),withTaxes=totals({lines:estimateLines(items,tariffs),tps:taxes.tps,tvq:taxes.tvq});
 const extras=items.filter(x=>!x.room);
 if(!active.length)return <p className="notice">Aucun tarif n’est actif. Ajoutez vos prix dans Paramètres › Tarifs et prix au mètre pour chiffrer la visite automatiquement.</p>;
 return <section className="visit-estimate" aria-label="Chiffrage de la visite">
  <p className="muted">Cochez les travaux à prévoir dans chaque pièce. Les quantités sont calculées d’après vos mesures et restent modifiables ; les prix viennent de vos tarifs.</p>
  {rooms.map((room,i)=>{const label=roomLabel(room,i),unit=room.unit||'m';return <div className="estimate-room" key={i}>
   <header><b>{label}</b><small>{Number(room.length)||0} × {Number(room.width)||0} × {Number(room.height)||0} {unit} · sol {round((Number(room.length)||0)*(Number(room.width)||0))} {unit}²</small></header>
   <div className="estimate-options">{measured.map(tariff=>{const item=find(tariff.id,label),price=item?tariffPrice(tariff,item.quantity):null;return <div className={`estimate-option${item?' on':''}`} key={tariff.id}>
    <label><input type="checkbox" checked={!!item} onChange={()=>toggle(tariff,room,label)}/><span><b>{tariff.name}</b><small>{money(tariff.material+tariff.labour)} / {tariff.unit} · {basisLabels[tariff.basis].toLowerCase()}</small></span></label>
    {item&&price&&<div className="estimate-amount"><label><span className="sr-only">Quantité pour {tariff.name}, {label}</span><input type="number" inputMode="decimal" min="0" step="any" value={item.quantity} onChange={e=>setQuantity(item,quantity(e.target.value))}/><em>{tariff.unit}</em></label><strong>{money(price.total)}</strong>{price.percent>0&&<small>−{price.percent} %</small>}</div>}
   </div>})}</div>
   {!(Number(room.length)>0&&Number(room.width)>0)&&<p className="estimate-hint">Mesures manquantes : renseignez la longueur et la largeur à l’étape 2 pour obtenir les quantités.</p>}
  </div>})}
  {manual.length>0&&<div className="estimate-room">
   <header><b>Autres postes</b><small>Quantité à saisir</small></header>
   {extras.map((item,i)=>{const tariff=tariffs.find(x=>x.id===item.tariffId)!;return <div className="estimate-extra" key={i}>
    <select aria-label="Poste" value={item.tariffId} onChange={e=>onChange(items.map(x=>x===item?{...x,tariffId:e.target.value}:x))}>{manual.map(x=><option key={x.id} value={x.id}>{x.name} — {money(x.material+x.labour)} / {x.unit}</option>)}</select>
    <label><span className="sr-only">Quantité</span><input type="number" inputMode="decimal" min="0" step="any" value={item.quantity} onChange={e=>setQuantity(item,quantity(e.target.value))}/><em>{tariff.unit}</em></label>
    <strong>{money(tariffPrice(tariff,item.quantity).total)}</strong>
    <button type="button" className="icon-button" aria-label={`Retirer ${tariff.name}`} onClick={()=>onChange(items.filter(x=>x!==item))}><Trash2 size={16}/></button>
   </div>})}
   <button type="button" className="btn secondary" onClick={()=>onChange([...items,{tariffId:manual[0].id,room:'',quantity:1}])}><Plus size={16}/>Ajouter un poste</button>
  </div>}
  <dl className="estimate-total" aria-live="polite">
   <div><dt>Matériaux</dt><dd>{money(sum.material)}</dd></div>
   <div><dt>Main-d’œuvre</dt><dd>{money(sum.labour)}</dd></div>
   <div><dt>Total hors taxes</dt><dd>{money(sum.total)}</dd></div>
   <div className="grand"><dt>Total avec taxes</dt><dd>{money((withTaxes as Data).total)}</dd></div>
  </dl>
 </section>;
}
