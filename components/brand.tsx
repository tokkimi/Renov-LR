'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Menu,X} from 'lucide-react';

/** Identité provisoire : pas encore de logo, donc un mot-symbole noir sur blanc. */
export function Wordmark({href='/',label='Rénov LR, accueil',className=''}:{href?:string;label?:string;className?:string}){
 return <Link className={`rlr-wordmark ${className}`} href={href} aria-label={label}><span>Rénov</span><b>LR</b></Link>;
}
export function Monogram(){return <span className="rlr-monogram" aria-hidden="true">LR</span>}

export type HeaderLink={href:string;label:string;external?:boolean};
type Props={home?:string;homeLabel?:string;links:HeaderLink[];cta?:string;onCta?:()=>void;children?:React.ReactNode;openLabel?:string;closeLabel?:string;navLabel?:string};

/** Barre flottante arrondie et translucide : logo à gauche, menu hamburger à droite, sur ordinateur comme sur téléphone. */
export function FloatingHeader({home='/',homeLabel,links,cta,onCta,children,openLabel='Ouvrir le menu',closeLabel='Fermer le menu',navLabel='Navigation principale'}:Props){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(!open)return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  const outside=(e:MouseEvent)=>{if(root.current&&!root.current.contains(e.target as Node))setOpen(false)};
  window.addEventListener('keydown',key);window.addEventListener('mousedown',outside);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('mousedown',outside)};
 },[open]);
 return <header className="rlr-header" ref={root}>
  <div className="rlr-bar">
   <Wordmark href={home} label={homeLabel}/>
   <button type="button" className="rlr-burger" aria-label={open?closeLabel:openLabel} aria-expanded={open} aria-controls="rlr-menu" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
  </div>
  {open&&<nav id="rlr-menu" className="rlr-menu" aria-label={navLabel}>
   {links.map(link=>link.external?<a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>{link.label}<ArrowUpRight size={16}/></a>:<Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}
   {(cta||children)&&<div className="rlr-menu-foot">{children}{cta&&<button type="button" className="rlr-menu-cta" onClick={()=>{setOpen(false);onCta?.()}}>{cta}<ArrowUpRight size={17}/></button>}</div>}
  </nav>}
 </header>;
}
