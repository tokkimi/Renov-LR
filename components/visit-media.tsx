'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,ImagePlus,Ruler,RotateCcw,X} from 'lucide-react';

const images=(list:FileList|null|undefined)=>Array.from(list||[]).filter(file=>/^image\/(jpeg|png|webp)$/.test(file.type));

/** Zone de photos de la visite : appareil photo du téléphone, sélection de fichiers ou glisser-déposer. */
export function PhotoDrop({busy,onFiles}:{busy:boolean;onFiles:(files:File[])=>void|Promise<void>}){
 const [over,setOver]=useState(false),[refused,setRefused]=useState(false);
 const take=(list:FileList|null|undefined)=>{const files=images(list);setRefused(!!list?.length&&files.length<list.length);if(files.length)void onFiles(files)};
 return <div className={`photo-drop${over?' over':''}`} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);if(!busy)take(e.dataTransfer.files)}}>
  <ImagePlus size={26} strokeWidth={1.5} aria-hidden="true"/>
  <p><b>Glissez vos photos ici</b><small>ou utilisez les boutons · JPEG, PNG ou WebP</small></p>
  <div className="photo-drop-actions">
   <label className="btn primary"><Camera size={17}/>Prendre une photo<input type="file" accept="image/*" capture="environment" disabled={busy} onChange={e=>{take(e.target.files);e.target.value=''}}/></label>
   <label className="btn secondary"><ImagePlus size={17}/>Choisir des photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={e=>{take(e.target.files);e.target.value=''}}/></label>
  </div>
  {refused&&<p className="error" role="alert">Certains fichiers ont été ignorés : seules les images JPEG, PNG et WebP sont acceptées.</p>}
 </div>;
}

type Point={x:number;y:number};
const references=[['Feuille A4 (grand côté)',0.297],['Mètre déplié',1],['Porte intérieure (hauteur)',2.04],['Autre longueur',0]] as const;
const FT=0.3048;

/**
 * Mesure sur photo : on indique un objet de longueur connue, puis la distance à mesurer.
 * Le résultat est fiable lorsque les deux sont sur le même plan, photographié de face.
 */
export function PhotoMeasure({unit,onApply}:{unit:string;onApply:(key:'length'|'width'|'height',value:number)=>void}){
 const [open,setOpen]=useState(false),[src,setSrc]=useState(''),[points,setPoints]=useState<Point[]>([]),[preset,setPreset]=useState(0),[custom,setCustom]=useState(1),[size,setSize]=useState({w:1,h:1});
 const image=useRef<HTMLImageElement>(null);
 useEffect(()=>()=>{if(src)URL.revokeObjectURL(src)},[src]);
 const reference=references[preset][1]||custom;
 const distance=(a:Point,b:Point)=>Math.hypot((a.x-b.x)*size.w,(a.y-b.y)*size.h);
 const metres=points.length===4&&distance(points[0],points[1])>0&&reference>0?reference*distance(points[2],points[3])/distance(points[0],points[1]):0;
 const value=Math.round((unit==='pi'?metres/FT:metres)*100)/100;
 const step=!src?'Prenez une photo où l’on voit un objet de taille connue (feuille A4, mètre, porte).':points.length<2?'1. Touchez les deux extrémités de l’objet de référence.':points.length<4?'2. Touchez les deux extrémités de la distance à mesurer.':'Mesure calculée. Appliquez-la à la pièce ou recommencez.';
 if(!open)return <button type="button" className="btn secondary photo-measure-open" onClick={()=>setOpen(true)}><Ruler size={16}/>Mesurer sur une photo</button>;
 return <div className="photo-measure">
  <header><b><Ruler size={16}/>Mesure sur photo</b><button type="button" className="icon-button" aria-label="Fermer la mesure sur photo" onClick={()=>{setOpen(false);setSrc('');setPoints([])}}><X size={17}/></button></header>
  <p className="muted" aria-live="polite">{step}</p>
  {!src?<label className="btn primary"><Camera size={17}/>Prendre ou choisir la photo<input type="file" accept="image/*" capture="environment" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file){setSrc(URL.createObjectURL(file));setPoints([])}}}/></label>:<>
   <div className="photo-measure-stage" onClick={e=>{const box=image.current?.getBoundingClientRect();if(!box)return;const point={x:(e.clientX-box.left)/box.width,y:(e.clientY-box.top)/box.height};setPoints(list=>list.length>=4?[point]:[...list,point])}}>
    <img ref={image} src={src} alt="Photo à mesurer" onLoad={e=>setSize({w:e.currentTarget.naturalWidth,h:e.currentTarget.naturalHeight})}/>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
     {points.length>=2&&<line className="ref" x1={points[0].x*100} y1={points[0].y*100} x2={points[1].x*100} y2={points[1].y*100}/>}
     {points.length===4&&<line className="target" x1={points[2].x*100} y1={points[2].y*100} x2={points[3].x*100} y2={points[3].y*100}/>}
    </svg>
    {points.map((p,i)=><span key={i} className={`photo-measure-dot ${i<2?'ref':'target'}`} style={{left:`${p.x*100}%`,top:`${p.y*100}%`}}/>)}
   </div>
   <div className="form-grid">
    <label>Objet de référence<select value={preset} onChange={e=>setPreset(Number(e.target.value))}>{references.map(([name,length],i)=><option key={name} value={i}>{name}{length?` — ${String(length).replace('.',',')} m`:''}</option>)}</select></label>
    {!references[preset][1]&&<label>Longueur réelle (m)<input type="number" inputMode="decimal" min="0.01" step="0.01" value={custom} onChange={e=>setCustom(Number(e.target.value)||0)}/></label>}
   </div>
   {metres>0&&<div className="photo-measure-result"><strong>{String(value).replace('.',',')} {unit==='pi'?'pi':'m'}</strong><span>Appliquer à :</span>{([['length','Longueur'],['width','Largeur'],['height','Hauteur']] as const).map(([key,label])=><button type="button" className="btn secondary" key={key} onClick={()=>onApply(key,value)}>{label}</button>)}</div>}
   <div className="photo-measure-actions"><button type="button" className="btn ghost" onClick={()=>setPoints([])}><RotateCcw size={15}/>Recommencer les points</button><button type="button" className="btn ghost" onClick={()=>{setSrc('');setPoints([])}}>Changer de photo</button></div>
   <small className="muted">Mesure indicative : précise si l’objet de référence et la distance sont sur le même mur ou le même sol, photographiés de face. La photo reste sur cet appareil.</small>
  </>}
 </div>;
}
