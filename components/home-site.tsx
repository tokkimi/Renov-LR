'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Bath,Box,Brush,Camera,Check,CookingPot,FileText,Hammer,Layers,Mail,Menu,MessageSquare,Mic,Phone,ReceiptText,Ruler,ScanLine,Sparkles,X} from 'lucide-react';
import {LogoMark,Wordmark} from './brand';
import QuoteRequest from './request-form';
import {Data,defaults} from '@/lib/model';

const services=[
 [CookingPot,'Cuisine','Implantation, plans de travail, crédence, électricité et finitions.'],
 [Bath,'Salle de bain','Douche à l’italienne, faïence, plomberie et étanchéité.'],
 [Layers,'Sols & parquet','Parquet, carrelage, vinyle : dépose, préparation et pose.'],
 [Brush,'Peinture & murs','Préparation des supports, enduits, peinture et revêtements.'],
 [Hammer,'Aménagement','Cloisons, doublages, portes et rangements sur mesure.'],
 [Sparkles,'Rénovation complète','Un seul interlocuteur pour coordonner tous les corps de métier.']
] as const;
const steps=[
 [Ruler,'La visite','Nous relevons chaque pièce sur place : mesures, photos et notes, pendant que vous nous expliquez votre projet.'],
 [ScanLine,'Le plan','Vos pièces sont tracées en plan 2D, puis projetées en 3D pour visualiser volumes et finitions.'],
 [FileText,'Le devis','Un devis détaillé pièce par pièce, matériaux et main-d’œuvre séparés. Rien de flou.'],
 [MessageSquare,'Le chantier','Vous suivez l’avancement et échangez avec nous depuis votre espace client.']
] as const;
const links=[['#prestations','Prestations'],['#methode','Notre méthode'],['#espace','Espace client'],['#contact','Contact']] as const;
const words=['Cuisine','Salle de bain','Parquet','Carrelage','Peinture','Cloisons','Électricité','Plomberie','Menuiserie'];

function Plan(){
 return <svg className="rl-plan" viewBox="0 0 320 220" fill="none" aria-hidden="true">
  <path className="w" d="M14 14H306V206H14Z"/>
  <path className="w t" d="M176 14V104M176 138V206M14 124H84M116 124H176M176 104H236M268 104H306"/>
  <g className="d"><path d="M84 124a32 32 0 0 1 32 32"/><path d="M84 124l23 23"/><path d="M236 104a32 32 0 0 0 32 32"/><path d="M268 104l-23 23"/></g>
  <g className="l"><text x="95" y="74">Séjour</text><text x="241" y="64">Cuisine</text><text x="95" y="172">Chambre</text><text x="241" y="164">Salle de bain</text></g>
 </svg>;
}

/** Page d’accueil Rénov LR : verre dépoli, lumière rouge et animations au défilement. */
export default function HomeSite({settings=defaults}:{settings?:Data}){
 const [quote,setQuote]=useState(false),[menu,setMenu]=useState(false),[scrolled,setScrolled]=useState(false);
 const header=useRef<HTMLElement>(null),root=useRef<HTMLDivElement>(null);
 const phone=String(settings.phone||'').replace(/[^+\d]/g,'');
 useEffect(()=>{
  if(!menu)return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};
  const outside=(e:MouseEvent)=>{if(header.current&&!header.current.contains(e.target as Node))setMenu(false)};
  window.addEventListener('keydown',key);window.addEventListener('mousedown',outside);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('mousedown',outside)};
 },[menu]);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const items=Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  items.forEach(item=>observer.observe(item));
  const onScroll=()=>setScrolled(window.scrollY>24);onScroll();
  const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.matchMedia('(pointer: fine)').matches;
  const onMove=(e:PointerEvent)=>{el.style.setProperty('--mx',String(e.clientX/window.innerWidth-.5));el.style.setProperty('--my',String(e.clientY/window.innerHeight-.5))};
  window.addEventListener('scroll',onScroll,{passive:true});if(!calm)window.addEventListener('pointermove',onMove,{passive:true});
  return()=>{observer.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('pointermove',onMove)};
 },[]);
 return <div className="rl-site" ref={root}>
  <div className="rl-orbs" aria-hidden="true"><i/><i/><i/></div>
  <header className={`rlr-header${scrolled?' scrolled':''}`} ref={header}>
   <div className="rlr-bar"><Wordmark/><button type="button" className="rlr-burger" aria-label={menu?'Fermer le menu':'Ouvrir le menu'} aria-expanded={menu} aria-controls="rlr-menu" onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button></div>
   {menu&&<nav id="rlr-menu" className="rlr-menu" aria-label="Navigation principale">
    {links.map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}
    <Link href="/connexion" onClick={()=>setMenu(false)}>Se connecter<ArrowUpRight size={16}/></Link>
    <div className="rlr-menu-foot"><button type="button" className="rlr-menu-cta" onClick={()=>{setMenu(false);setQuote(true)}}>Demander un devis<ArrowUpRight size={17}/></button></div>
   </nav>}
  </header>

  <main>
   <section className="rl-hero">
    <div className="rl-wrap rl-hero-grid">
     <div className="rl-hero-copy">
      <p className="rl-pill"><i/>Rénovation intérieure</p>
      <h1><span className="ln"><span>Votre intérieur,</span></span><span className="ln"><span>repensé au</span></span><span className="ln"><span><em>millimètre.</em></span></span></h1>
      <p className="rl-lead">Nous mesurons, nous traçons le plan de vos pièces, puis nous chiffrons. Vous savez ce qui sera fait, où, et pour combien, avant le premier coup de marteau.</p>
      <div className="rl-actions"><button type="button" className="rl-btn red" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button><a className="rl-btn glass" href="#methode">Notre méthode<ArrowRight size={18}/></a></div>
      <ul className="rl-points"><li><Check size={15}/>Relevé sur place</li><li><Check size={15}/>Plan 2D et vue 3D</li><li><Check size={15}/>Devis détaillé</li></ul>
     </div>
     <div className="rl-stage" aria-hidden="true">
      <div className="rl-photo"><Image src="/images/interieur.png" alt="" fill priority sizes="(max-width: 980px) 92vw, 560px"/><span className="rl-shine"/></div>
      <div className="rl-card plan"><header><ScanLine size={15}/>Plan 2D<b>T3 · 51 m²</b></header><Plan/></div>
      <div className="rl-card quote"><header><FileText size={15}/>Devis · Séjour</header><div className="bar"><span>Matériaux</span><i style={{'--v':'62%'} as React.CSSProperties}/></div><div className="bar"><span>Main-d’œuvre</span><i style={{'--v':'84%'} as React.CSSProperties}/></div><footer><Check size={14}/>Prêt à signer</footer></div>
      <div className="rl-card cube"><Box size={18}/>Vue 3D</div>
     </div>
    </div>
    <a className="rl-scroll" href="#prestations" aria-label="Découvrir les prestations"><span/></a>
   </section>

   <div className="rl-strip" aria-hidden="true"><div>{[0,1].map(n=><span key={n}>{words.map(word=><b key={word}>{word}<i/></b>)}</span>)}</div></div>

   <section className="rl-section" id="prestations">
    <div className="rl-wrap">
     <header className="rl-head" data-reveal><p className="rl-kicker">Prestations</p><h2>Tout l’intérieur,<br/><em>un seul interlocuteur.</em></h2><p>De la pièce unique à la rénovation complète, nous organisons les travaux et vous tenons informé à chaque étape.</p></header>
     <div className="rl-services">{services.map(([Icon,title,text],i)=><button type="button" key={title} data-reveal style={{'--d':`${i*70}ms`} as React.CSSProperties} onClick={()=>setQuote(true)}><span className="ic"><Icon size={24} strokeWidth={1.5}/></span><span className="n">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p><span className="go">Demander un devis<ArrowUpRight size={16}/></span></button>)}</div>
    </div>
   </section>

   <section className="rl-section rl-dark" id="methode">
    <div className="rl-wrap">
     <header className="rl-head" data-reveal><p className="rl-kicker">Notre méthode</p><h2>Quatre étapes.<br/><em>Aucune surprise.</em></h2></header>
     <ol className="rl-steps" data-reveal>{steps.map(([Icon,title,text],i)=><li key={title} style={{'--d':`${i*140}ms`} as React.CSSProperties}><span className="dot"><Icon size={20} strokeWidth={1.6}/></span><span className="n">0{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </div>
   </section>

   <section className="rl-section" id="espace">
    <div className="rl-wrap rl-space">
     <div className="rl-space-copy" data-reveal><p className="rl-kicker">Espace client</p><h2>Votre chantier<br/><em>dans la poche.</em></h2><p>Chaque client dispose d’un espace sécurisé : la messagerie avec notre équipe, les devis à signer, les factures et les photos du chantier, au même endroit.</p><div className="rl-actions"><Link className="rl-btn dark" href="/connexion">Accéder à mon espace<ArrowUpRight size={18}/></Link></div></div>
     <div className="rl-phone" data-reveal aria-hidden="true">
      <div className="rl-phone-top"><LogoMark size={26}/><b>Mon chantier</b><span>En cours</span></div>
      <div className="rl-glass" style={{'--d':'150ms'} as React.CSSProperties}><MessageSquare size={17}/><div><b>Messagerie</b><p>« Le parquet du séjour est posé, voici les photos. »</p></div></div>
      <div className="rl-glass" style={{'--d':'330ms'} as React.CSSProperties}><FileText size={17}/><div><b>Devis · Séjour et cuisine</b><p>À signer en ligne</p></div><span>PDF</span></div>
      <div className="rl-glass" style={{'--d':'510ms'} as React.CSSProperties}><ReceiptText size={17}/><div><b>Facture d’acompte</b><p>Réglée</p></div><span className="ok"><Check size={13}/></span></div>
      <div className="rl-tools" style={{'--d':'690ms'} as React.CSSProperties}><span><Camera size={16}/>Photos</span><span><Mic size={16}/>Notes</span><span><Ruler size={16}/>Mesures</span></div>
     </div>
    </div>
   </section>

   <section className="rl-section rl-cta-wrap" id="contact">
    <div className="rl-wrap"><div className="rl-cta" data-reveal>
     <LogoMark size={64}/>
     <h2>Parlons de votre projet.</h2>
     <p>Décrivez vos travaux en quelques minutes et joignez des photos : nous vous rappelons pour organiser la visite.</p>
     <div className="rl-actions"><button type="button" className="rl-btn white" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button>{phone&&<a className="rl-btn line" href={`tel:${phone}`}><Phone size={17}/>{settings.phone}</a>}{settings.email&&!String(settings.email).endsWith('.example')&&<a className="rl-btn line" href={`mailto:${settings.email}`}><Mail size={17}/>{settings.email}</a>}</div>
    </div></div>
   </section>
  </main>

  <footer className="rl-footer"><div className="rl-wrap">
   <Wordmark/>
   <nav aria-label="Liens du pied de page">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}<Link href="/confidentialite">Confidentialité</Link><Link href="/connexion">Espace client & équipe</Link></nav>
   <p>{[settings.address,settings.rbq&&`SIRET ${settings.rbq}`].filter(Boolean).join(' · ')}</p>
   <small>© {new Date().getFullYear()} Rénov LR</small>
  </div></footer>
  {quote&&<QuoteRequest close={()=>setQuote(false)}/>}
 </div>;
}
