'use client';
import {useMemo,useState} from 'react';
import {Calculator,ChevronDown,Copy,Plus,RotateCcw,Save,Trash2} from 'lucide-react';
import {money,type Data} from '@/lib/model';
import {basisLabels,defaultTariffs,tariffCategories,tariffErrors,tariffPrice,tariffsFrom,type Tariff,type TariffBasis} from '@/lib/tariffs';
import {projectSettingsFrom} from '@/lib/settings-model';

type Props={settings:Data;demo:boolean;onSave:(data:Data)=>Promise<unknown>};
const samples=[1,10,50];
const number=(value:string)=>{const n=Number(value.replace(',','.'));return Number.isFinite(n)&&n>=0?n:0};

/** Paramètres › Tarifs : prix au mètre de chaque poste, paliers dégressifs et simulateur. */
export default function TariffSettings({settings,demo,onSave}:Props){
 const initial=useMemo(()=>tariffsFrom(settings.tariffs),[settings.tariffs]);
 const units=useMemo(()=>[...new Set(['m²','m','cm','cm²','m³','unité','forfait','h',...projectSettingsFrom(settings).units])],[settings]);
 const [draft,setDraft]=useState<Tariff[]>(initial);
 const [open,setOpen]=useState<string|null>(null);
 const [filter,setFilter]=useState('Tous');
 const [state,setState]=useState<{kind:'idle'|'pending'|'saved'|'error';message?:string}>({kind:'idle'});
 const [simId,setSimId]=useState(initial[0]?.id||'');const [simQty,setSimQty]=useState(10);
 const dirty=JSON.stringify(draft)!==JSON.stringify(initial);
 const categories=[...new Set([...tariffCategories,...draft.map(x=>x.category)])];
 const patch=(id:string,change:Partial<Tariff>)=>{setDraft(list=>list.map(x=>x.id===id?{...x,...change}:x));setState({kind:'idle'})};
 const add=()=>{const item:Tariff={id:crypto.randomUUID(),name:'',category:filter==='Tous'?'Sols':filter,basis:'floor',unit:'m²',material:0,labour:0,tiers:[],active:true,keywords:''};setDraft(list=>[...list,item]);setOpen(item.id);setState({kind:'idle'})};
 async function save(){
  const errors=tariffErrors(draft);if(errors.length){setState({kind:'error',message:errors.join(' ')});return}
  setState({kind:'pending'});
  try{await onSave({...settings,tariffs:draft});setState({kind:'saved',message:demo?'Enregistré pour cette démonstration seulement.':'Tarifs enregistrés. Ils s’appliquent aux prochaines visites et aux prochains devis.'})}
  catch(error){setState({kind:'error',message:`${(error as Error).message} Vos saisies sont conservées.`})}
 }
 const sim=draft.find(x=>x.id===simId)||draft[0];const simPrice=sim?tariffPrice(sim,simQty):null;
 const shown=draft.filter(x=>filter==='Tous'||x.category===filter);
 return <div className="settings-form tariff-settings">
  <p className="muted">Fixez ici ce que coûte chaque poste : parquet, peinture, carrelage… Le prix est séparé en matériaux et main-d’œuvre, hors taxes. Ces tarifs servent au chiffrage en fin de visite et aux lignes des devis et factures. Un devis déjà créé garde les prix du jour où il a été fait.</p>

  {sim&&simPrice&&<section className="tariff-sim" aria-label="Simulateur de prix">
   <h3><Calculator size={17}/>Simulateur</h3>
   <div className="tariff-sim-inputs">
    <label>Poste<select value={sim.id} onChange={e=>setSimId(e.target.value)}>{draft.map(x=><option key={x.id} value={x.id}>{x.name||'Poste sans nom'}</option>)}</select></label>
    <label>Quantité ({sim.unit})<input type="number" inputMode="decimal" min="0" step="any" value={simQty} onChange={e=>setSimQty(number(e.target.value))}/></label>
   </div>
   <dl className="tariff-sim-result">
    <div><dt>Matériaux</dt><dd>{money(simPrice.material)}</dd></div>
    <div><dt>Main-d’œuvre</dt><dd>{money(simPrice.labour)}</dd></div>
    <div className="total"><dt>Total hors taxes</dt><dd>{money(simPrice.total)}</dd></div>
   </dl>
   <p className="muted">{simPrice.percent?`Palier dégressif appliqué : −${simPrice.percent} % (au lieu de ${money(simPrice.listTotal)}).`:`Soit ${money(simPrice.unit)} par ${sim.unit}.`}</p>
  </section>}

  <div className="tariff-toolbar">
   <div className="tariff-filters" role="tablist" aria-label="Catégories de tarifs">{['Tous',...categories].map(name=><button type="button" role="tab" aria-selected={filter===name} className={filter===name?'active':''} key={name} onClick={()=>setFilter(name)}>{name}</button>)}</div>
   <button type="button" className="btn secondary" onClick={add}><Plus size={16}/>Ajouter un poste</button>
  </div>

  <ul className="tariff-list">{shown.map(item=>{const expanded=open===item.id;const unit=item.material+item.labour;return <li key={item.id} className={`tariff-card${item.active?'':' inactive'}`}>
   <button type="button" className="tariff-summary" aria-expanded={expanded} onClick={()=>setOpen(expanded?null:item.id)}>
    <span className="tariff-name"><b>{item.name||'Nouveau poste'}</b><small>{item.category} · {basisLabels[item.basis]}{item.active?'':' · désactivé'}</small></span>
    <span className="tariff-unit"><b>{money(unit)}</b><small>par {item.unit}</small></span>
    <ChevronDown size={18} className="tariff-chevron"/>
   </button>
   <div className="tariff-samples" aria-label="Exemples de prix">{samples.map(q=><span key={q}>{q} {item.unit} <b>{money(tariffPrice(item,q).total)}</b></span>)}</div>
   {expanded&&<div className="tariff-editor">
    <label>Nom du poste<input maxLength={120} value={item.name} placeholder="Ex. : Parquet stratifié" onChange={e=>patch(item.id,{name:e.target.value})}/></label>
    <label>Mots reconnus dans les notes vocales<input maxLength={300} value={item.keywords} placeholder="Ex. : parquet, stratifié, sol stratifié" onChange={e=>patch(item.id,{keywords:e.target.value})}/><small className="muted">Séparés par des virgules. Quand l’un d’eux est dicté pendant une visite, ce tarif est appliqué automatiquement à la ligne du devis.</small></label>
    <div className="form-grid three">
     <label>Catégorie<input list="tariff-categories" maxLength={60} value={item.category} onChange={e=>patch(item.id,{category:e.target.value})}/></label>
     <label>Unité<select value={item.unit} onChange={e=>patch(item.id,{unit:e.target.value})}>{[...new Set([item.unit,...units])].map(u=><option key={u}>{u}</option>)}</select></label>
     <label>Quantité calculée d’après<select value={item.basis} onChange={e=>patch(item.id,{basis:e.target.value as TariffBasis})}>{(Object.keys(basisLabels) as TariffBasis[]).map(b=><option key={b} value={b}>{basisLabels[b]}</option>)}</select></label>
    </div>
    <div className="form-grid three">
     <label>Matériaux, par {item.unit} (€)<input type="number" inputMode="decimal" min="0" step="0.01" value={item.material} onChange={e=>patch(item.id,{material:number(e.target.value)})}/></label>
     <label>Main-d’œuvre, par {item.unit} (€)<input type="number" inputMode="decimal" min="0" step="0.01" value={item.labour} onChange={e=>patch(item.id,{labour:number(e.target.value)})}/></label>
     <div className="tariff-unit-total"><small>Prix unitaire</small><b>{money(unit)}</b></div>
    </div>
    <fieldset className="tariff-tiers"><legend>Tarif dégressif selon la quantité</legend>
     {item.tiers.length===0&&<p className="muted">Aucun palier : le même prix s’applique quelle que soit la quantité.</p>}
     {item.tiers.map((tier,i)=><div className="tariff-tier" key={i}>
      <label>À partir de ({item.unit})<input type="number" inputMode="decimal" min="0" step="any" value={tier.from} onChange={e=>patch(item.id,{tiers:item.tiers.map((x,j)=>j===i?{...x,from:number(e.target.value)}:x)})}/></label>
      <label>Remise (%)<input type="number" inputMode="decimal" min="0" max="90" step="0.5" value={tier.percent} onChange={e=>patch(item.id,{tiers:item.tiers.map((x,j)=>j===i?{...x,percent:Math.min(90,number(e.target.value))}:x)})}/></label>
      <span className="tariff-tier-price">{money(unit*(100-tier.percent)/100)} / {item.unit}</span>
      <button type="button" className="icon-button" aria-label="Supprimer ce palier" onClick={()=>patch(item.id,{tiers:item.tiers.filter((_,j)=>j!==i)})}><Trash2 size={16}/></button>
     </div>)}
     {item.tiers.length<6&&<button type="button" className="btn ghost" onClick={()=>patch(item.id,{tiers:[...item.tiers,{from:(item.tiers.at(-1)?.from||5)*2,percent:(item.tiers.at(-1)?.percent||0)+5}]})}><Plus size={15}/>Ajouter un palier</button>}
    </fieldset>
    <div className="tariff-actions">
     <label className="tariff-toggle"><input type="checkbox" checked={item.active} onChange={e=>patch(item.id,{active:e.target.checked})}/>Proposer ce poste pendant les visites</label>
     <button type="button" className="btn ghost" onClick={()=>{const copy={...item,id:crypto.randomUUID(),name:`${item.name} (copie)`,tiers:item.tiers.map(x=>({...x}))};setDraft(list=>[...list,copy]);setOpen(copy.id)}}><Copy size={15}/>Dupliquer</button>
     <button type="button" className="btn ghost danger" onClick={()=>{setDraft(list=>list.filter(x=>x.id!==item.id));setOpen(null);setState({kind:'idle'})}}><Trash2 size={15}/>Supprimer</button>
    </div>
   </div>}
  </li>})}</ul>
  {!shown.length&&<p className="muted">Aucun poste dans cette catégorie. Ajoutez-en un pour commencer.</p>}
  <datalist id="tariff-categories">{categories.map(name=><option key={name} value={name}/>)}</datalist>

  <div className="settings-savebar">
   {state.kind!=='idle'&&<p role={state.kind==='error'?'alert':'status'} className={state.kind==='error'?'error':'settings-saved'}>{state.kind==='pending'?'Enregistrement…':state.message}</p>}
   {dirty&&<span className="settings-dirty">Modifications non enregistrées</span>}
   <button type="button" className="btn ghost" onClick={()=>{setDraft(defaultTariffs.map(x=>({...x,tiers:x.tiers.map(tier=>({...tier}))})));setState({kind:'idle'})}}>Remettre la grille de départ</button>
   <button type="button" className="btn ghost" disabled={!dirty} onClick={()=>{setDraft(initial);setState({kind:'idle'})}}><RotateCcw size={15}/>Annuler les modifications</button>
   <button type="button" className="btn primary" disabled={!dirty||state.kind==='pending'} onClick={save}><Save size={15}/>Enregistrer les tarifs</button>
  </div>
 </div>;
}
