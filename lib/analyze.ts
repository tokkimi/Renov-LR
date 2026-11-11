import {round} from './model';
// Turns a spoken visit note (a transcript) into draft quote lines. The result is
// always presented as an editable suggestion — never a committed price. A model
// (Claude) refines it when a key is configured; otherwise the deterministic
// heuristic below runs so the feature works offline and in the demo.
export type DraftLine={description:string;quantity:number;unit:string;price:number};
export type Analysis={lines:DraftLine[];scope:string;materials:string;summary:string;source:'model'|'heuristic'};
export type AnalyzeContext={rooms?:{name?:string;length?:number;width?:number;height?:number;unit?:string}[];scope?:string};

// Unités reconnues dans une dictée. L'ordre compte : les surfaces et volumes avant les longueurs.
const NUM='(\\d+(?:[.,]\\d+)?)';
const UNIT_PATTERNS:[string,string][]=[
 ['pi(?:eds?)?\\s*(?:2|²|carr[ée]s?)|pi2|\\bpc\\b','pi²'],
 ['centim[èe]tres?\\s*carr[ée]s?|cm\\s*(?:2|²|carr[ée]s?)','cm²'],
 ['m[èe]tres?\\s*carr[ée]s?|m\\s*(?:2|²)(?![a-z0-9])|m\\s+carr[ée]s?','m²'],
 ['m[èe]tres?\\s*cubes?|m\\s*(?:3|³)(?![a-z0-9])','m³'],
 ['m[èe]tres?\\s*lin[ée]aires?|\\bml\\b','m'],
 ['millim[èe]tres?|mm(?![a-z])','mm'],
 ['centim[èe]tres?|cm(?![a-z0-9²])','cm'],
 ['m[èe]tres?|m(?![a-z0-9²³])','m'],
 ['pieds?\\s*lin[ée]aires?','pi lin'],
 ['litres?|\\bl\\b','L'],['kilos?|kilogrammes?|kg(?![a-z])','kg'],
 ['unit[ée]s?|pi[èe]ces?|exemplaires?','unité'],['heures?|\\bh\\b','heure'],['jours?|journ[ée]es?','jour'],['forfaits?','forfait']
];
const UNITS:[RegExp,string][]=UNIT_PATTERNS.map(([source,unit])=>[new RegExp(`^(?:${source})$`,'i'),unit]);
const QUANTITY=new RegExp(`${NUM}\\s*(${UNIT_PATTERNS.map(([source])=>source).join('|')})`,'i');
const LENGTH='(m[èe]tres?|centim[èe]tres?|cm|m)';
// « 4 mètres par 3 », « 250 cm x 3 m », « 4 x 3 m » : une surface.
const DIMENSIONS=new RegExp(`${NUM}\\s*${LENGTH}?\\s*(?:x|×|par|sur)\\s*${NUM}\\s*${LENGTH}(?![a-z0-9²³]|\\s*(?:carr|cube|2|3))`,'i');
const metres=(value:string,unit:string|undefined)=>Number(value.replace(',','.'))*(/^c/i.test(unit||'')?.01:1);
const MATERIAL_WORDS=['quartz','granit','céramique','ceramique','porcelaine','vinyle','stratifié','stratifie','bois franc','chêne','chene','bois','peinture','béton','beton','carrelage','marbre','laminé','lamine','gypse','comptoir','armoire','tuile','dosseret'];
const FILLER=/^(euh+|bon|alors|donc|voilà|voila|ok|d'accord|et|puis)$/i;
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
const cap=(s:string)=>s?s.charAt(0).toUpperCase()+s.slice(1):s;

function detectUnit(text:string):string|null{for(const [re,u] of UNITS)if(re.test(text.trim()))return u;return null;}
function detectQuantity(text:string):{quantity:number;unit:string}|null{
 const d=text.match(DIMENSIONS);
 if(d){const area=round(metres(d[1],d[2]||d[4])*metres(d[3],d[4]));if(area>0)return {quantity:area,unit:'m²'}}
 const m=text.match(QUANTITY);
 if(!m)return null;const unit=detectUnit(m[2]);if(!unit)return null;return {quantity:round(Number(m[1].replace(',','.'))),unit};
}
function detectPrice(text:string):number|null{
 const m=text.match(/(\d[\d\s]*(?:[.,]\d{1,2})?)\s*(?:€|euros?|\$|dollars?)/i);
 if(!m)return null;return round(Number(m[1].replace(/\s/g,'').replace(',','.')));
}
// Split a free-flowing dictation into candidate task segments.
function segment(transcript:string):string[]{
 return transcript
  .split(/\n+|(?:^|\s)[-•*·]\s+|(?<=[.;!?])\s+(?=[A-ZÀ-Ÿ0-9])|\b(?:ensuite|puis|après ça|apres ca|également|ainsi que|et aussi)\b/gi)
  .map(clean).filter(s=>s.length>=4&&!FILLER.test(s));
}

export function analyzeTranscript(transcript:string,context:AnalyzeContext={}):Analysis{
 const text=clean(transcript||'');
 const segments=segment(transcript||'');
 const lines:DraftLine[]=[];
 for(const seg of segments){
  const q=detectQuantity(seg);const price=detectPrice(seg);
  // Drop pure measurement chatter unless it carries an action.
  const description=cap(seg.replace(/\s*[-•*·]\s*/g,' ').trim()).slice(0,240);
  if(!description)continue;
  lines.push({description,quantity:q?q.quantity:1,unit:q?q.unit:'forfait',price:price!==null&&(!q||/\b(?:par|le|du)\s+(?:m|cm|pi|heure|unit|pi[èe]ce|jour)|\/\s*(?:pi|m|cm|heure|unit)/i.test(seg))?price:0});
 }
 if(!lines.length&&text)lines.push({description:cap(text).slice(0,240),quantity:1,unit:'forfait',price:0});
 const materialsFound=Array.from(new Set(MATERIAL_WORDS.filter(w=>new RegExp(`\\b${w}\\b`,'i').test(text)).map(w=>cap(w))));
 const scope=context.scope?context.scope:segments.slice(0,12).map(s=>`• ${cap(s)}`).join('\n')||text;
 return {lines:lines.slice(0,60),scope,materials:materialsFound.join(', '),summary:text.slice(0,180),source:'heuristic'};
}

// ---- Model-assisted analysis (server-side, optional) ----
export const ANALYZE_MODEL='claude-sonnet-4-5';
export function buildAnalysisMessages(transcript:string,context:AnalyzeContext={}){
 const rooms=(context.rooms||[]).map(r=>`${r.name||'Pièce'} : ${r.length||0} × ${r.width||0} × ${r.height||0} ${r.unit||'m'}`).join(' ; ');
 const system='Tu assistes une entreprise de rénovation en France (Rénov LR). À partir d’une note vocale dictée pendant une visite, tu extrais des lignes de devis claires. Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format {"lines":[{"description":string,"quantity":number,"unit":string,"price":number}],"scope":string,"materials":string,"summary":string}. Utilise le français, les unités dictées (m², m, cm, cm², m³, unité, heure, jour, forfait), et laisse "price" à 0 lorsque le prix n’est pas dicté. N’invente pas de prix.';
 const user=`Note vocale de la visite :\n"""${transcript}"""\n${rooms?`Pièces relevées : ${rooms}\n`:''}Génère les lignes de devis correspondantes.`;
 return {system,messages:[{role:'user' as const,content:user}]};
}
// Pull the first JSON object out of a model response and coerce it to an Analysis.
export function parseModelAnalysis(textOut:string):Analysis|null{
 const match=textOut&&textOut.match(/\{[\s\S]*\}/);
 if(!match)return null;
 let parsed:any;try{parsed=JSON.parse(match[0]);}catch{return null;}
 if(!parsed||!Array.isArray(parsed.lines))return null;
 const lines:DraftLine[]=parsed.lines.filter((l:any)=>l&&l.description).map((l:any)=>({description:String(l.description).slice(0,240),quantity:Number.isFinite(Number(l.quantity))&&Number(l.quantity)>0?round(Number(l.quantity)):1,unit:String(l.unit||'forfait').slice(0,20),price:Number.isFinite(Number(l.price))&&Number(l.price)>=0?round(Number(l.price)):0})).slice(0,60);
 if(!lines.length)return null;
 return {lines,scope:String(parsed.scope||''),materials:String(parsed.materials||''),summary:String(parsed.summary||'').slice(0,180),source:'model'};
}
