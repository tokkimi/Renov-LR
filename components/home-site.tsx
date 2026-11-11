'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {motion, useReducedMotion, useScroll, useTransform, type MotionStyle} from 'motion/react';
import {ArrowRight,ArrowUpRight,Home,ListChecks,CalendarCheck,FileText,Hammer,Mail,Phone,ShieldCheck,Sparkles,X} from 'lucide-react';
import {WhatsAppIcon,whatsappQuoteUrl} from './whatsapp-contact';
import {BrandLockup,BrandName,LogoMark} from './brand';
import {LiquidNavbar,type LiquidNavItem} from './ui/liquid-glass-navbar';
import ServiceWarpCarousel from './ui/service-warp-carousel';
import QuoteRequest from './request-form';
import PortfolioPreview from './portfolio-preview';
import {Data,defaults} from '@/lib/model';

import {services} from './renovation-services';

const steps=[
 ['Vous nous contactez','Décrivez votre projet en quelques minutes, avec des photos si vous en avez. Nous vous rappelons.'],
 ['Nous venons sur place','Une visite pour comprendre vos envies, prendre les mesures et vous conseiller sur les matériaux.'],
 ['Vous recevez le devis','Un devis clair, pièce par pièce, avec les matériaux et la main-d’œuvre détaillés.'],
 ['Nous réalisons les travaux','Une équipe suivie du début à la fin, un chantier tenu propre et un interlocuteur unique.']
] as const;
const promises=[
 [ShieldCheck,'Un seul interlocuteur','Vous savez toujours à qui parler, du premier appel à la remise des clés.'],
 [FileText,'Un devis lisible','Chaque poste est détaillé. Pas de ligne floue, pas de surprise en fin de chantier.'],
 [Sparkles,'Un chantier soigné','Protection des lieux, nettoyage et finitions vérifiées avec vous.'],
 [CalendarCheck,'Des délais annoncés','Un calendrier posé avant de commencer, et tenu à jour si quelque chose change.']
] as const;
const links=[['#prestations','Prestations'],['#realisations','Avant / après'],['#methode','Comment ça se passe'],['#engagements','Nos engagements'],['#contact','Contact']] as const;
const navItems:LiquidNavItem[]=[
 {label:'Accueil',href:'#top',icon:<Home size={18}/>,fx:'glow'},
 {label:'Prestations',href:'#prestations',icon:<Hammer size={18}/>,fx:'wave'},
 {label:'Méthode',href:'#methode',icon:<ListChecks size={18}/>,fx:'spin'},
 {label:'Engagements',href:'#engagements',icon:<ShieldCheck size={18}/>,fx:'pop'},
 {label:'Contact',href:'#contact',icon:<Phone size={18}/>,fx:'drop'},
];
/** Sections suivies par la barre : identifiant et ton du fond qu’elles affichent sous la barre. */
const tracked:[string,'light'|'dark'][]=[['top','dark'],['prestations','light'],['methode','light'],['engagements','light'],['contact','dark']];

/** Bulle de contact de l’accueil : le monogramme LR en transparence, qui ouvre les moyens de joindre l’entreprise. */
function ContactBubble({settings,onQuote,whatsapp}:{settings:Data;onQuote:()=>void;whatsapp:string}){
 const [open,setOpen]=useState(false);const box=useRef<HTMLDivElement>(null);
 const phone=String(settings.phone||'').replace(/[^+\d]/g,'');
 const email=settings.email&&!String(settings.email).endsWith('.example')?String(settings.email):'';
 useEffect(()=>{
  if(!open)return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  const outside=(e:MouseEvent)=>{if(box.current&&!box.current.contains(e.target as Node))setOpen(false)};
  window.addEventListener('keydown',key);window.addEventListener('mousedown',outside);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('mousedown',outside)};
 },[open]);
 return <div className={`rl-bubble${open?' open':''}`} ref={box}>
  {open&&<section className="rl-bubble-panel" aria-label="Nous contacter">
   <header><b>Parlons de votre projet</b><button type="button" aria-label="Fermer" onClick={()=>setOpen(false)}><X size={18}/></button></header>
   <button type="button" className="main" onClick={()=>{setOpen(false);onQuote()}}><FileText size={19}/><span><b>Faire un devis</b><small>Décrivez vos travaux en 2 minutes</small></span><ArrowUpRight size={16}/></button>
   {whatsapp&&<a className="rl-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/><span><b>Écrire sur WhatsApp</b><small>Demander un devis</small></span><ArrowUpRight size={16}/></a>}
   {phone&&<a href={`tel:${phone}`}><Phone size={19}/><span><b>Appeler</b><small>{settings.phone}</small></span><ArrowUpRight size={16}/></a>}
   {email&&<a href={`mailto:${email}`}><Mail size={19}/><span><b>E-mail</b><small>{email}</small></span><ArrowUpRight size={16}/></a>}
  </section>}
  <button type="button" className="rl-bubble-btn" aria-label={open?'Fermer les contacts':'Nous contacter'} aria-expanded={open} onClick={()=>setOpen(!open)}><LogoMark size={58}/></button>
 </div>;
}

/** Page d’accueil Rénov LR : verre dépoli, lumière bleu ardoise et animations au défilement. */
export default function HomeSite({settings=defaults}:{settings?:Data}){
 const [quote,setQuote]=useState<string | boolean>(false),[section,setSection]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const hero=useRef<HTMLElement>(null),method=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const {scrollYProgress:heroProgress}=useScroll({target:hero,offset:['start start','end start']});
 const heroScale=useTransform(heroProgress,[0,1],[1,1.09]);
 // Progress starts at the sticky inset and ends when the panel can scroll away.
 const {scrollYProgress:methodProgress}=useScroll({target:method,offset:['start 110px','end 110px']});
 // Le monogramme tourne pendant le chargement avant de révéler la page.
 const [stage,setStage]=useState<'intro'|'leaving'|'animating'|'done'>('intro');
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setStage('done');return}
  const anchor=location.hash;
  const timers=[window.setTimeout(()=>setStage('leaving'),3000),window.setTimeout(()=>setStage('animating'),3060),window.setTimeout(()=>{
   setStage('done');
   if(anchor && location.hash===anchor) requestAnimationFrame(()=>document.getElementById(anchor.slice(1))?.scrollIntoView({behavior:'instant'}));
  },3680)];
  return()=>timers.forEach(window.clearTimeout);
 },[]);
 const tone=tracked[Math.min(section,tracked.length-1)][1];
 const whatsapp=whatsappQuoteUrl(String(settings.phone||''));
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const sections=tracked.map(([id])=>document.getElementById(id));
  const onScroll=()=>{
   let index=0;
   sections.forEach((node,i)=>{if(node&&node.getBoundingClientRect().top<=140)index=i});
   setSection(index);
   const max=document.documentElement.scrollHeight-window.innerHeight;
   el.style.setProperty('--p',String(max>0?window.scrollY/max:0));
  };
  onScroll();
  const glassy=Array.from(el.querySelectorAll<HTMLElement>('.rlr-header .rlr-wordmark,.rl-btn'));
  glassy.forEach(node=>{node.classList.add('lq');if(!node.querySelector(':scope > .lq-light')){const light=document.createElement('span');light.className='lq-light';light.setAttribute('aria-hidden','true');node.appendChild(light)}});
  const onLight=(e:PointerEvent)=>{const node=(e.target as Element|null)?.closest?.('.lq') as HTMLElement|null;if(!node)return;const box=node.getBoundingClientRect();node.style.setProperty('--gx',`${e.clientX-box.left}px`);node.style.setProperty('--gy',`${e.clientY-box.top}px`)};
  el.addEventListener('pointermove',onLight,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{el.removeEventListener('pointermove',onLight);window.removeEventListener('scroll',onScroll)};
 },[]);
 return <div className="rl-site rl-architecture" ref={root} data-stage={stage}>
  {stage!=='done'&&<div className="rl-intro" aria-hidden="true"><div className="arch-intro-signature"><div className="arch-intro-mark"><LogoMark size={170}/></div><BrandName/><div className="arch-intro-rule"><i/></div></div></div>}
  <header className="rlr-header liquid" data-tone={tone} data-section={tracked[section]?.[0]}>
   <BrandLockup/>
   <LiquidNavbar compact tone={tone} active={section} items={navItems} onChange={index=>setSection(index)}/>
  </header>

  <div className="rl-progress" aria-hidden="true"/>
  <main>
   <section className="rl-hero arch-hero" id="top" ref={hero}>
    <motion.div className="arch-hero-photo" style={{scale: reduced ? 1 : heroScale}} aria-hidden="true">
     <Image src="/images/accueil-cuisine.webp" alt="" fill preload sizes="100vw" quality={90} />
    </motion.div>
    <div className="rl-wrap arch-hero-copy">
     <p className="arch-eyebrow">Rénovation intérieure</p>
     <h1>Réinventer<br/>votre intérieur.</h1>
     <p>De la première visite aux finitions, une équipe pour donner forme à votre projet.</p>
     <div className="rl-actions">
      <button type="button" className="rl-btn arch-primary" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button>
      <a className="rl-btn arch-hero-link" href="#prestations">Découvrir nos prestations<ArrowRight size={18}/></a>
     </div>
    </div>
   </section>

   <section className="rl-wrap arch-intro" aria-labelledby="arch-intro-title">
    <div><p className="arch-eyebrow">Rénov LR</p><h2 id="arch-intro-title">Des intérieurs pensés<br/>pour être vécus.</h2></div>
    <p>Cuisine, salle de bain, sols ou rénovation complète. Nous prenons en charge les travaux avec un interlocuteur unique, un devis clair et des finitions vérifiées avec vous.</p>
   </section>

   <section className="arch-section arch-services" id="prestations">
    <div className="rl-wrap">
     <header className="arch-heading"><p className="arch-eyebrow">Nos prestations</p><h2>Chaque pièce, un projet.</h2></header>
     <ServiceWarpCarousel cards={services} onSelect={setQuote}/>
    </div>
   </section>

   <PortfolioPreview />

   <section className="arch-method" id="methode">
    <div className="arch-method-timeline" ref={method} aria-hidden="true"/>
    <div className="arch-method-panel">
     <div className="rl-wrap">
     <header className="arch-heading"><p className="arch-eyebrow">Notre méthode</p><h2>Du premier échange<br/>aux finitions.</h2></header>
     <motion.div className="arch-method-track" style={{'--method-progress': reduced ? 1 : methodProgress} as MotionStyle}>
      <div className="arch-method-line" aria-hidden="true"><span/></div>
      <ol className="arch-steps">{steps.map(([title,description],position)=>(
       <li key={title}>
        <span className="arch-step-number" aria-hidden="true">{String(position+1).padStart(2,'0')}</span>
        <motion.div className="arch-step-copy"
         initial={false} whileInView={reduced ? undefined : {y:[6,0]}}
         viewport={{once:true,amount:.4}} transition={{duration:.38,delay:position*.035}}>
         <h3>{title}</h3><p>{description}</p>
        </motion.div>
       </li>
      ))}</ol>
     </motion.div>
     <button type="button" className="rl-btn arch-outline" onClick={()=>setQuote(true)}>Lancer mon projet<ArrowUpRight size={18}/></button>
     </div>
    </div>
   </section>

   <section className="arch-section" id="engagements">
    <div className="rl-wrap">
     <header className="arch-heading"><p className="arch-eyebrow">Nos engagements</p><h2>La clarté, à chaque étape.</h2></header>
     <div className="arch-promises">{promises.map(([Icon,title,description])=><article key={title}><Icon size={24} strokeWidth={1.5} aria-hidden="true"/><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
   </section>

   <section className="arch-contact" id="contact" aria-labelledby="arch-contact-title">
    <div className="rl-wrap arch-contact-layout">
     <div className="arch-contact-copy">
      <h2 id="arch-contact-title">Un projet de rénovation<br className="arch-contact-break"/> ou d’aménagement&nbsp;?</h2>
      <p>Parlons de vos idées et obtenez un devis personnalisé.</p>
     </div>
     <button type="button" className="rl-btn arch-contact-quote" onClick={()=>setQuote(true)}>Demander un devis<ArrowRight size={18}/></button>
    </div>
   </section>
  </main>

  <footer className="rl-footer"><div className="rl-wrap">
   <BrandLockup/>
   <nav aria-label="Liens du pied de page">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}<Link href="/confidentialite">Confidentialité</Link></nav>
   <p>{[settings.address,settings.rbq&&`SIRET ${settings.rbq}`].filter(Boolean).join(' · ')}</p>
   <small>© {new Date().getFullYear()} Rénov LR</small>
  </div></footer>
  {!quote&&<ContactBubble settings={settings} whatsapp={whatsapp} onQuote={()=>setQuote(true)}/>}
  {quote&&<QuoteRequest close={()=>setQuote(false)} initialService={typeof quote==='string' ? quote : undefined} booking={typeof quote==='string'}/>}
 </div>;
}
