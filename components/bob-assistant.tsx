'use client';
import {useEffect,useRef,useState} from 'react';
import {Bot,ChevronRight,Send,X} from 'lucide-react';
import {money,totals,type RecordItem} from '@/lib/model';

type Props={records:RecordItem[];demo:boolean;onOpen:(id:string)=>void};
type Hit={id:string;label:string;detail:string};
type Message={role:'user'|'assistant';content:string;hits?:Hit[]};

const kinds:[RegExp,RecordItem['kind'],string][]=[[/^(devis|soumissions?)$/,'quote','Devis'],[/^factures?$/,'invoice','Facture'],[/^(projets?|chantiers?)$/,'project','Projet'],[/^(visites?|releves?)$/,'visit','Visite'],[/^(clients?|clientes?)$/,'client','Client'],[/^taches?$/,'task','Tâche'],[/^depenses?$/,'expense','Dépense'],[/^(demandes?)$/,'request','Demande'],[/^contrats?$/,'contract','Contrat']];
const ignored=new Set(['le','la','les','l','de','du','des','d','un','une','a','au','aux','et','ou','pour','sur','en','dans','moi','me','mon','ma','mes','son','sa','ses','est','sont','ou','quel','quelle','quels','quelles','madame','mme','monsieur','mr','m','mlle','trouve','trouver','cherche','chercher','montre','montrer','affiche','ouvre','ouvrir','donne','veux','voir','dernier','derniere','derniers','dernieres','svp','stp','bob','qui','que','quoi','avec','chez','il','elle','y','ce','cette','ces','tous','toutes','tout','se','passe','en','cours']);
const plain=(text:unknown)=>String(text??'').toLocaleLowerCase('fr').normalize('NFD').replace(/[̀-ͯ]/g,'');
const words=(text:string)=>plain(text).split(/[^a-z0-9]+/).filter(Boolean);

/** Recherche locale dans les dossiers déjà chargés : fonctionne sans service IA et en démonstration. */
export function findRecords(question:string,records:RecordItem[]):{hits:Hit[];kind?:string}{
 const tokens=words(question);
 const wanted=kinds.filter(([pattern])=>tokens.some(token=>pattern.test(token)));
 const terms=tokens.filter(token=>!ignored.has(token)&&!kinds.some(([pattern])=>pattern.test(token))&&token.length>1);
 const clients=new Map(records.filter(r=>r.kind==='client').map(r=>[r.id,String(r.data.name||'')]));
 const pool=records.filter(r=>wanted.length?wanted.some(([,kind])=>kind===r.kind):kinds.some(([,kind])=>kind===r.kind));
 const scored=pool.map(record=>{
  const hay=plain([record.data.title,record.data.name,record.data.number,record.data.address,record.data.email,record.client_id?clients.get(record.client_id):'',record.data.client_name].filter(Boolean).join(' '));
  return {record,score:terms.filter(term=>hay.includes(term)).length};
 }).filter(x=>terms.length?x.score>0:wanted.length>0).sort((a,b)=>b.score-a.score||b.record.updated_at.localeCompare(a.record.updated_at)).slice(0,6);
 const hits=scored.map(({record})=>{
  const label=kinds.find(([,kind])=>kind===record.kind)?.[2]||'Dossier',client=record.client_id?clients.get(record.client_id):'';
  const amount=['quote','invoice','contract'].includes(record.kind)?money(totals(record.data).total):record.kind==='expense'?money(Number(record.data.net||0)+Number(record.data.tps||0)+Number(record.data.tvq||0)):'';
  return {id:record.id,label:`${label} · ${record.data.title||record.data.name||record.data.number||'Sans titre'}`,detail:[record.kind==='client'?record.data.email:client,record.data.number,amount,record.data.status,record.data.date].filter(Boolean).join(' · ')};
 });
 return {hits,kind:wanted[0]?.[2]};
}

const suggestions=['Le dernier devis','Les factures en attente','Quels projets sont en cours ?'];

/** Bob : la bulle d’assistance de l’espace de gestion. Il retrouve un devis, une facture ou un client et l’ouvre. */
export default function BobAssistant({records,demo,onOpen}:Props){
 const [open,setOpen]=useState(false),[messages,setMessages]=useState<Message[]>([]),[draft,setDraft]=useState(''),[busy,setBusy]=useState(false);
 const thread=useRef<HTMLOListElement>(null),input=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(open)input.current?.focus()},[open]);
 useEffect(()=>{thread.current?.scrollTo({top:thread.current.scrollHeight})},[messages,busy]);
 useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[open]);
 async function ask(text:string){
  const question=text.trim();if(!question||busy)return;
  const {hits,kind}=findRecords(question,records);
  const found=hits.length?`Voici ce que j’ai trouvé${kind?` (${kind.toLowerCase()})`:''} :`:'Je n’ai trouvé aucun dossier qui correspond.';
  const history=[...messages,{role:'user' as const,content:question}];
  setMessages([...history,{role:'assistant',content:found,hits}]);setDraft('');
  if(demo)return;
  setBusy(true);
  try{
   const response=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.filter(m=>m.content).slice(-12).map(({role,content})=>({role,content}))})});
   const body=await response.json();
   if(response.ok&&body.reply)setMessages([...history,{role:'assistant',content:body.reply,hits}]);
  }catch{/* la recherche locale reste affichée */}finally{setBusy(false)}
 }
 return <div className={`bob${open?' open':''}`}>
  {open&&<section className="bob-panel" role="dialog" aria-label="Bob, votre assistant">
   <header><span className="bob-face"><Bot size={20}/></span><div><b>Bob</b><small>Je retrouve vos devis, factures et clients.</small></div><button type="button" className="icon-button" aria-label="Fermer l’assistant" onClick={()=>setOpen(false)}><X size={18}/></button></header>
   <ol className="bob-thread" ref={thread} aria-live="polite">
    {!messages.length&&<li className="assistant"><p>Bonjour ! Dites-moi ce que vous cherchez, par exemple « le devis de Mme Laurent ».</p><div className="bob-suggestions">{suggestions.map(s=><button type="button" key={s} onClick={()=>void ask(s)}>{s}</button>)}</div></li>}
    {messages.map((message,i)=><li key={i} className={message.role}><p>{message.content}</p>{message.hits?.map(hit=><button type="button" className="bob-hit" key={hit.id} onClick={()=>{setOpen(false);onOpen(hit.id)}}><span><b>{hit.label}</b><small>{hit.detail}</small></span><ChevronRight size={16}/></button>)}</li>)}
    {busy&&<li className="assistant"><p>Je regarde…</p></li>}
   </ol>
   <form onSubmit={e=>{e.preventDefault();void ask(draft)}}><label className="sr-only" htmlFor="bob-input">Votre demande</label><input id="bob-input" ref={input} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Que cherchez-vous ?" autoComplete="off"/><button className="bob-send" disabled={!draft.trim()||busy} aria-label="Envoyer"><Send size={17}/></button></form>
  </section>}
  <button type="button" className="bob-bubble" aria-label={open?'Fermer Bob, l’assistant':'Ouvrir Bob, l’assistant'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={24}/>:<Bot size={28} strokeWidth={1.8}/>}</button>
 </div>;
}
