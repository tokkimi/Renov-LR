'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,Camera,Check,ChevronLeft,ImagePlus,Trash2,X} from 'lucide-react';
import AddressInput from './address-input';
import {Data} from '@/lib/model';

type Photo={file:File;url:string};
type Question={key:string;label:string;type:'choice'|'multi'|'number'|'text';options?:string[];unit?:string;hint?:string;when?:(a:Answers)=>boolean};
type Answers=Record<string,string|string[]>;
async function preparePhoto(file:File){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('format');if(file.size>20*1024*1024)throw Error('size');const image=await createImageBitmap(file);try{const ratio=Math.min(1,1400/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*ratio);canvas.height=Math.round(image.height*ratio);const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('format')),'image/jpeg',.78));return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'})}finally{image.close()}}

const yesNo=['Oui','Non','Je ne sais pas'];
const works=['Cuisine','Salle de bain','Sols et parquet','Peinture et murs','Aménagement et cloisons','Électricité','Plomberie et chauffage','Portes et fenêtres','Isolation','Rénovation complète','Réparation','Autre'];
const home:Question[]=[
 {key:'home_type',label:'Type de bien',type:'choice',options:['Appartement','Maison','Local professionnel']},
 {key:'home_status',label:'Vous êtes',type:'choice',options:['Propriétaire occupant','Propriétaire bailleur','Locataire','Futur acquéreur']},
 {key:'home_year',label:'Année de construction',type:'choice',options:['Avant 1949','1949 – 1975','1975 – 2000','Après 2000','Je ne sais pas']},
 {key:'home_area',label:'Surface totale du bien',type:'number',unit:'m²'},
 {key:'work_area',label:'Surface concernée par les travaux',type:'number',unit:'m²'},
 {key:'work_rooms',label:'Nombre de pièces concernées',type:'number'},
 {key:'home_floor',label:'Étage',type:'choice',options:['Rez-de-chaussée','1er','2e','3e','4e et plus'],when:a=>a.home_type==='Appartement'},
 {key:'home_lift',label:'Ascenseur',type:'choice',options:['Oui','Non'],when:a=>a.home_type==='Appartement'},
 {key:'home_copro',label:'Bien en copropriété',type:'choice',options:['Oui','Non'],when:a=>a.home_type!=='Maison'},
 {key:'home_occupied',label:'Logement occupé pendant les travaux',type:'choice',options:['Oui','Non','En partie']},
 {key:'home_access',label:'Accès et stationnement',type:'text',hint:'Digicode, rue étroite, place pour un utilitaire…'}
];
const sections:Record<string,Question[]>={
 'Réparation':[
  {key:'repair_area',label:'Que faut-il réparer ?',type:'multi',options:['Porte ou placard','Mur ou plafond','Sol ou plinthe','Autre']},
  {key:'repair_issue',label:'Quel problème rencontrez-vous ?',type:'text',hint:'Décrivez le défaut, la pièce et ce qui a déjà été tenté.'},
 ],
 'Cuisine':[
  {key:'k_scope',label:'Vous souhaitez',type:'choice',options:['Une cuisine entièrement neuve','Changer les meubles et le plan de travail','Rafraîchir l’existant']},
  {key:'k_layout',label:'Implantation souhaitée',type:'choice',options:['Linéaire','En L','En U','Avec îlot','À définir ensemble']},
  {key:'k_worktop',label:'Plan de travail',type:'choice',options:['Stratifié','Bois massif','Quartz','Céramique','Pierre naturelle','À définir']},
  {key:'k_moves',label:'Déplacer l’évier, la plaque ou les arrivées',type:'choice',options:yesNo},
  {key:'k_appliances',label:'Électroménager à fournir',type:'choice',options:['Oui, tout','En partie','Non, je le fournis']},
  {key:'k_extras',label:'À prévoir aussi',type:'multi',options:['Crédence','Éclairage','Hotte','Sol','Peinture','Électricité aux normes']}],
 'Salle de bain':[
  {key:'b_scope',label:'Vous souhaitez',type:'choice',options:['Une rénovation complète','Remplacer la baignoire par une douche','Rafraîchir l’existant','Créer une salle de bain']},
  {key:'b_wash',label:'Équipement souhaité',type:'multi',options:['Douche à l’italienne','Douche avec receveur','Baignoire','Double vasque','WC suspendu','Sèche-serviettes']},
  {key:'b_moves',label:'Déplacer des arrivées ou évacuations d’eau',type:'choice',options:yesNo},
  {key:'b_tiles',label:'Faïence murale',type:'choice',options:['Toute hauteur','Zones d’eau seulement','Pas de faïence','À définir']},
  {key:'b_vent',label:'Ventilation existante (VMC ou fenêtre)',type:'choice',options:yesNo},
  {key:'b_access',label:'Accessibilité à prévoir (PMR, seniors)',type:'choice',options:['Oui','Non']}],
 'Sols et parquet':[
  {key:'f_current',label:'Revêtement actuel',type:'choice',options:['Parquet','Carrelage','Moquette','Lino ou vinyle','Béton brut','Je ne sais pas']},
  {key:'f_wanted',label:'Revêtement souhaité',type:'multi',options:['Parquet massif','Parquet contrecollé','Stratifié','Carrelage','Vinyle (LVT)','Béton ciré','Rénovation du parquet existant']},
  {key:'f_area',label:'Surface de sol à traiter',type:'number',unit:'m²'},
  {key:'f_remove',label:'Dépose de l’ancien revêtement',type:'choice',options:yesNo},
  {key:'f_skirting',label:'Plinthes à remplacer',type:'choice',options:yesNo},
  {key:'f_heating',label:'Chauffage au sol',type:'choice',options:yesNo}],
 'Peinture et murs':[
  {key:'p_surfaces',label:'Surfaces à peindre',type:'multi',options:['Murs','Plafonds','Boiseries et portes','Radiateurs','Façade ou extérieur']},
  {key:'p_state',label:'État des murs',type:'choice',options:['Bon état','Fissures ou trous à reprendre','Papier peint à retirer','Humidité ou taches','Je ne sais pas']},
  {key:'p_rooms',label:'Nombre de pièces à peindre',type:'number'},
  {key:'p_height',label:'Hauteur sous plafond',type:'choice',options:['Standard (≈ 2,50 m)','Haute (plus de 2,70 m)','Je ne sais pas']},
  {key:'p_finish',label:'Finition souhaitée',type:'multi',options:['Blanc','Couleurs','Papier peint','Enduit décoratif','À conseiller']}],
 'Aménagement et cloisons':[
  {key:'a_works',label:'Travaux envisagés',type:'multi',options:['Abattre une cloison','Créer une cloison','Ouvrir un mur porteur','Placards sur mesure','Dressing','Faux plafond','Verrière']},
  {key:'a_bearing',label:'Un mur porteur est-il concerné ?',type:'choice',options:yesNo},
  {key:'a_plans',label:'Vous avez des plans du logement',type:'choice',options:['Oui','Non']}],
 'Électricité':[
  {key:'e_works',label:'Travaux envisagés',type:'multi',options:['Mise aux normes','Remplacement du tableau','Ajout de prises','Éclairage et spots','Réseau et domotique','Borne de recharge']},
  {key:'e_age',label:'Âge de l’installation',type:'choice',options:['Moins de 15 ans','15 à 30 ans','Plus de 30 ans','Je ne sais pas']}],
 'Plomberie et chauffage':[
  {key:'pl_works',label:'Travaux envisagés',type:'multi',options:['Créer un point d’eau','Remplacer le chauffe-eau','Remplacer les radiateurs','Remplacer la chaudière','Refaire les canalisations','Réparer une fuite']},
  {key:'pl_energy',label:'Énergie de chauffage',type:'choice',options:['Électrique','Gaz','Pompe à chaleur','Fioul','Collectif','Je ne sais pas']}],
 'Portes et fenêtres':[
  {key:'w_works',label:'Éléments concernés',type:'multi',options:['Portes intérieures','Porte d’entrée','Fenêtres','Volets','Porte de placard']},
  {key:'w_count',label:'Nombre d’éléments à remplacer',type:'number'}],
 'Isolation':[
  {key:'i_zones',label:'Zones à isoler',type:'multi',options:['Murs par l’intérieur','Combles','Plafonds','Sols','Phonique entre pièces']},
  {key:'i_dpe',label:'Diagnostic énergétique (DPE) connu',type:'choice',options:['A à C','D ou E','F ou G','Je ne sais pas']}],
 'Rénovation complète':[
  {key:'r_state',label:'État général du bien',type:'choice',options:['À rafraîchir','À rénover','À refaire entièrement']},
  {key:'r_lots',label:'Lots à prévoir',type:'multi',options:['Démolition','Électricité','Plomberie','Chauffage','Isolation','Cloisons','Sols','Peinture','Cuisine','Salle de bain','Menuiseries']},
  {key:'r_architect',label:'Un architecte ou décorateur suit le projet',type:'choice',options:yesNo}]
};
const finish:Question[]=[
 {key:'range',label:'Gamme de finitions',type:'choice',options:['Économique','Standard','Haut de gamme','À conseiller']},
 {key:'supply',label:'Fourniture des matériaux',type:'choice',options:['Par l’entreprise','Par moi-même','Un peu des deux','À voir ensemble']},
 {key:'deadline',label:'Date à respecter impérativement',type:'text',hint:'Emménagement, naissance, mise en location…'},
 {key:'aid',label:'Aides ou financement envisagés',type:'multi',options:['MaPrimeRénov’','Éco-prêt à taux zéro','Prêt travaux','Aucun','Je ne sais pas']},
 {key:'other_quotes',label:'D’autres devis sont en cours',type:'choice',options:['Oui','Non']}
];
const contact:Question[]=[
 {key:'contact_pref',label:'Comment préférez-vous être recontacté ?',type:'multi',options:['Téléphone','WhatsApp','SMS','E-mail']},
 {key:'contact_slot',label:'Meilleur moment pour vous joindre',type:'multi',options:['Matin','Midi','Après-midi','Soir','Samedi']},
 {key:'visit_slots',label:'Vos disponibilités pour la visite',type:'text',hint:'Ex. : en semaine après 17 h, samedi matin'},
 {key:'heard',label:'Comment nous avez-vous connus ?',type:'choice',options:['Recommandation','Recherche internet','Réseaux sociaux','Véhicule ou chantier','Autre']}
];
const budgets=['À définir','Moins de 5 000 €','5 000 à 15 000 €','15 000 à 30 000 €','30 000 à 60 000 €','Plus de 60 000 €'];
const timelines=['Dès que possible','Dans le mois','Dans les 3 mois','Dans les 6 mois','Cette année','À définir'];
const stepNames=['Travaux','Logement','Précisions','Finitions','Photos','Coordonnées'];
const text=(value:string|string[]|undefined)=>Array.isArray(value)?value.join(', '):String(value||'').trim();

function Ask({q,answers,set}:{q:Question;answers:Answers;set:(key:string,value:string|string[])=>void}){
 const value=answers[q.key];
 if(q.type==='choice'||q.type==='multi'){
  const chosen=q.type==='multi'?(Array.isArray(value)?value:[]):[String(value||'')];
  return <fieldset className="rq-ask"><legend>{q.label}{q.type==='multi'&&<small> · plusieurs choix possibles</small>}</legend><div className="rq-chips">{q.options!.map(option=>{const on=chosen.includes(option);return <button type="button" key={option} aria-pressed={on} className={on?'on':''} onClick={()=>set(q.key,q.type==='multi'?(on?chosen.filter(x=>x!==option):[...chosen,option]):(on?'':option))}>{on&&<Check size={14}/>}{option}</button>})}</div></fieldset>;
 }
 return <label className="rq-ask">{q.label}{q.unit&&<small> ({q.unit})</small>}<input type={q.type==='number'?'number':'text'} inputMode={q.type==='number'?'decimal':undefined} min={q.type==='number'?0:undefined} step="any" maxLength={300} placeholder={q.hint} value={String(value||'')} onChange={e=>set(q.key,e.target.value)}/></label>;
}

/** Questionnaire de demande de devis : six étapes, avec des précisions adaptées à chaque type de travaux choisi. */
export default function RequestForm({close,initialService,booking=false}:{close:()=>void;locale?:'fr'|'en';initialService?:string;booking?:boolean}){
 const [step,setStep]=useState(0);
 const [data,setData]=useState<Data>({budget:'À définir',timeline:'Dans les 3 mois',name:'',email:'',phone:'',address:'',description:'',consent:false,website:''});
 const [types,setTypes]=useState<string[]>(()=>initialService && works.includes(initialService) ? [initialService] : []),[answers,setAnswers]=useState<Answers>({});
 const [photos,setPhotos]=useState<Photo[]>([]);const photoRef=useRef<Photo[]>([]);photoRef.current=photos;
 const [busy,setBusy]=useState(false),[processing,setProcessing]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false),[drag,setDrag]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),content=useRef<HTMLDivElement>(null),files=useRef<HTMLInputElement>(null),camera=useRef<HTMLInputElement>(null);
 useEffect(()=>{dialog.current?.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;photoRef.current.forEach(p=>URL.revokeObjectURL(p.url))}},[]);
 useEffect(()=>{if(content.current)content.current.scrollTop=0},[step,done]);
 const field=(key:string,value:unknown)=>setData(old=>({...old,[key]:value}));
 const answer=(key:string,value:string|string[])=>setAnswers(old=>({...old,[key]:value}));
 const detailed=types.filter(type=>sections[type]);
 async function addFiles(incoming:File[]){if(processing)return;setProcessing(true);setError('');try{if(incoming.length+photoRef.current.length>10)throw Error('count');const prepared:File[]=[];for(const file of incoming)prepared.push(await preparePhoto(file));if(prepared.reduce((n,f)=>n+f.size,0)+photoRef.current.reduce((n,p)=>n+p.file.size,0)>3500000)throw Error('total');setPhotos(p=>[...p,...prepared.map(file=>({file,url:URL.createObjectURL(file)}))])}catch(e){setError((e as Error).message==='count'?'Vous pouvez ajouter jusqu’à 10 photos.':(e as Error).message==='total'?'Ces photos sont trop volumineuses ensemble. Retirez-en quelques-unes.':'Choisissez des photos JPEG, PNG ou WebP de moins de 20 Mo chacune. Sur iPhone, utilisez « Prendre une photo » si le fichier HEIC est refusé.')}finally{setProcessing(false)}}
 function details(){
  const rows:{section:string;label:string;value:string}[]=[];
  const push=(section:string,list:Question[])=>list.forEach(q=>{if(q.when&&!q.when(answers))return;const value=text(answers[q.key]);if(value)rows.push({section,label:q.label,value:q.unit?`${value} ${q.unit}`:value})});
  if(booking)rows.push({section:'Rendez-vous',label:'Type de demande',value:'Visite sur place'});
  if(text(answers.nature))rows.push({section:'Projet',label:'Contexte',value:text(answers.nature)});
  push('Logement',home);detailed.forEach(type=>push(type,sections[type]));push('Finitions et budget',finish);push('Contact',contact);
  return rows;
 }
 async function submit(e:React.FormEvent){
  e.preventDefault();setError('');
  if(step===0&&!types.length){setError('Choisissez au moins un type de travaux.');return}
  if(!booking&&step<5){setStep(step+1);return}
  setBusy(true);
  try{const form=new FormData();form.set('data',JSON.stringify({...data,service:types.join(', '),details:details(),locale:'fr'}));photos.forEach(p=>form.append('photos',p.file));const res=await fetch('/api/requests',{method:'POST',body:form});const result=await res.json();if(!res.ok)throw Error(result.error);setDone(true)}catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 return <dialog ref={dialog} className="request-dialog request-modal rq" lang="fr-FR" onCancel={e=>{if(busy||processing)e.preventDefault();else close()}} onClick={e=>{if(e.target===dialog.current&&!busy&&!processing)close()}} aria-labelledby="request-title">
  <header className="request-modal-header"><div><p className="eyebrow">{booking ? 'DEMANDE DE RENDEZ-VOUS' : 'DEMANDE DE DEVIS'}</p><h2 id="request-title">{booking ? 'Réserver une visite' : 'Parlez-nous de votre projet.'}</h2></div><button className="icon-button" aria-label="Fermer la demande" disabled={busy||processing} onClick={close}><X/></button></header>
  <div ref={content} className="request-modal-content">{done?<div className="success-panel"><span className="success-icon"><Check/></span><h3>Votre demande est enregistrée.</h3><p>Nous vous recontactons pour en parler et organiser la visite.</p>{photos.length>0&&<p>Vos photos sont bien jointes au dossier.</p>}<button className="btn primary" onClick={close}>Fermer</button></div>:<>
   {!booking&&<><div className="rq-progress" role="progressbar" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step+1} aria-label={`Étape ${step+1} sur 6 : ${stepNames[step]}`}><span style={{width:`${(step+1)/6*100}%`}}/></div>
   <p className="rq-step">Étape {step+1} sur 6 · <b>{stepNames[step]}</b></p></>}
   <form onSubmit={submit}>
    {booking&&<>
     <p className="notice"><b>{types.join(' · ')}</b><br/>Indiquez où et quand vous joindre. Nous vous recontactons pour convenir du rendez-vous.</p>
     <AddressInput locale="fr" value={data.address} onChange={v=>field('address',v)}/>
    </>}
    {!booking&&step===0&&<>
     <fieldset className="rq-ask"><legend>Quels travaux souhaitez-vous réaliser ?<small> · plusieurs choix possibles</small></legend><div className="service-choices">{works.map(work=>{const on=types.includes(work);return <button type="button" key={work} aria-pressed={on} className={on?'chosen':''} onClick={()=>setTypes(on?types.filter(x=>x!==work):[...types,work])}>{work}{on&&<Check size={16}/>}</button>})}</div></fieldset>
     <Ask q={{key:'nature',label:'Dans quel contexte ?',type:'choice',options:['Amélioration de mon logement','Achat à rénover','Avant mise en location ou vente','Après un sinistre','Local professionnel']}} answers={answers} set={answer}/>
    </>}
    {step===1&&<><AddressInput locale="fr" value={data.address} onChange={v=>field('address',v)}/><div className="rq-grid">{home.filter(q=>!q.when||q.when(answers)).map(q=><Ask key={q.key} q={q} answers={answers} set={answer}/>)}</div></>}
    {step===2&&(detailed.length?detailed.map(type=><section className="rq-section" key={type}><h3>{type}</h3><div className="rq-grid">{sections[type].map(q=><Ask key={q.key} q={q} answers={answers} set={answer}/>)}</div></section>):<p className="notice">Pas de question supplémentaire pour ces travaux : décrivez-les librement à l’étape « Photos ».</p>)}
    {step===3&&<><div className="form-grid"><label>Budget envisagé<select value={data.budget} onChange={e=>field('budget',e.target.value)}>{budgets.map(b=><option key={b}>{b}</option>)}</select></label><label>Démarrage souhaité<select value={data.timeline} onChange={e=>field('timeline',e.target.value)}>{timelines.map(t=><option key={t}>{t}</option>)}</select></label></div><div className="rq-grid">{finish.map(q=><Ask key={q.key} q={q} answers={answers} set={answer}/>)}</div></>}
    {(booking||step===4)&&<>
     <label>Décrivez votre projet avec vos mots<textarea required minLength={10} maxLength={10000} rows={5} placeholder="Ce que vous voulez changer, ce qui vous gêne aujourd’hui, vos envies, vos contraintes…" value={data.description} onChange={e=>field('description',e.target.value)}/></label>
     <section className={`request-photo-drop ${drag?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);void addFiles(Array.from(e.dataTransfer.files))}}><ImagePlus size={25}/><h3>Ajoutez des photos des pièces</h3><p>Glissez-les ici ou choisissez-les. Jusqu’à 10 photos : vue d’ensemble, détails, plans éventuels.</p><div className="button-row"><button type="button" className="btn secondary" disabled={processing} onClick={()=>files.current?.click()}><ImagePlus size={17}/>Choisir des photos</button><button type="button" className="btn secondary" disabled={processing} onClick={()=>camera.current?.click()}><Camera size={17}/>Prendre une photo</button></div><input ref={files} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e=>{void addFiles(Array.from(e.target.files||[]));e.target.value=''}}/><input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={e=>{void addFiles(Array.from(e.target.files||[]));e.target.value=''}}/>{processing&&<p role="status">Préparation des photos…</p>}</section>
     <div className="request-photo-previews">{photos.map((p,i)=><figure key={p.url}><img src={p.url} alt="Photo du projet"/><button type="button" className="icon-button" aria-label={`Retirer la photo ${i+1}`} onClick={()=>{URL.revokeObjectURL(p.url);setPhotos(rows=>rows.filter(x=>x!==p))}}><Trash2 size={16}/></button><figcaption>{p.file.name}</figcaption></figure>)}</div>
    </>}
    {(booking||step===5)&&<>
     <label>Nom complet<input required minLength={2} maxLength={150} autoComplete="name" value={data.name} onChange={e=>field('name',e.target.value)}/></label>
     <div className="form-grid"><label>E-mail<input type="email" required autoComplete="email" autoCapitalize="none" value={data.email} onChange={e=>field('email',e.target.value)}/></label><label>Téléphone<input type="tel" required minLength={7} autoComplete="tel" value={data.phone} onChange={e=>field('phone',e.target.value)}/></label></div>
     <div className="rq-grid">{contact.filter(q=>!booking||q.key==='visit_slots').map(q=><Ask key={q.key} q={q} answers={answers} set={answer}/>)}</div>
     <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={data.website} onChange={e=>field('website',e.target.value)}/>
     {!booking&&<div className="request-summary"><p><b>{types.join(' · ')}</b></p><p>{data.address}</p><p>{details().length} précision(s) · {photos.length} photo(s) jointe(s)</p></div>}
     <label className="request-consent"><input type="checkbox" required checked={data.consent} onChange={e=>field('consent',e.target.checked)}/><span>J’accepte que Rénov LR utilise ces informations et photos pour répondre à ma demande. <Link href="/confidentialite" target="_blank">Confidentialité</Link></span></label>
    </>}
    {error&&<p role="alert" className="error">{error}</p>}
    <div className="form-actions">{step>0?<button type="button" className="btn ghost" disabled={busy||processing} onClick={()=>{setError('');setStep(step-1)}}><ChevronLeft size={17}/>Retour</button>:<span className="muted">Sans engagement</span>}<button className="btn primary" disabled={busy||processing}>{busy?'Envoi…':booking||step===5?'Envoyer ma demande':'Continuer'}<ArrowRight size={17}/></button></div>
   </form>
  </>}</div>
 </dialog>;
}
