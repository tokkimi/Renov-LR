'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Home,ListChecks,User,MessageCircle,MessageSquare,Bath,Brush,CalendarCheck,Check,CookingPot,FileText,Hammer,Layers,Mail,Menu,Phone,ShieldCheck,Sparkles,X} from 'lucide-react';
import {LogoMark,Wordmark} from './brand';
import {LiquidNavbar,type LiquidNavItem} from './ui/liquid-glass-navbar';
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
const links=[['#prestations','Prestations'],['#engagements','Nos engagements'],['#methode','Comment ça se passe'],['#contact','Contact']] as const;
const navItems:LiquidNavItem[]=[
 {label:'Accueil',href:'#top',icon:<Home size={18}/>,fx:'glow'},
 {label:'Prestations',href:'#prestations',icon:<Hammer size={18}/>,fx:'wave'},
 {label:'Engagements',href:'#engagements',icon:<ShieldCheck size={18}/>,fx:'pop'},
 {label:'Méthode',href:'#methode',icon:<ListChecks size={18}/>,fx:'spin'},
 {label:'Contact',href:'#contact',icon:<Phone size={18}/>,fx:'drop'},
 {label:'Espace client',href:'/connexion',icon:<User size={18}/>,fx:'wave'}
];
/** Sections suivies par la barre : identifiant et ton du fond qu’elles affichent sous la barre. */
const tracked:[string,'light'|'dark'][]=[['top','dark'],['prestations','light'],['engagements','dark'],['methode','dark'],['contact','light']];
const words=['Cuisine','Salle de bain','Parquet','Carrelage','Peinture','Cloisons','Électricité','Plomberie','Menuiserie'];

/** Bulle de contact de l’accueil : le monogramme LR en transparence, qui ouvre les moyens de joindre l’entreprise. */
function ContactBubble({settings,onQuote}:{settings:Data;onQuote:()=>void}){
 const [open,setOpen]=useState(false);const box=useRef<HTMLDivElement>(null);
 const digits=String(settings.phone||'').replace(/\D/g,''),phone=String(settings.phone||'').replace(/[^+\d]/g,'');
 const whatsapp=digits?(digits.startsWith('0')?'33'+digits.slice(1):digits):'';
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
   {whatsapp&&<a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/><span><b>WhatsApp</b><small>Écrivez-nous directement</small></span><ArrowUpRight size={16}/></a>}
   {phone&&<a href={`tel:${phone}`}><Phone size={19}/><span><b>Appeler</b><small>{settings.phone}</small></span><ArrowUpRight size={16}/></a>}
   {email&&<a href={`mailto:${email}`}><Mail size={19}/><span><b>E-mail</b><small>{email}</small></span><ArrowUpRight size={16}/></a>}
   <Link href="/connexion"><MessageSquare size={19}/><span><b>Messagerie client</b><small>Déjà client ? Écrivez-nous depuis votre espace</small></span><ArrowUpRight size={16}/></Link>
  </section>}
  <button type="button" className="rl-bubble-btn" aria-label={open?'Fermer les contacts':'Nous contacter'} aria-expanded={open} onClick={()=>setOpen(!open)}><LogoMark size={58}/></button>
 </div>;
}

/** Page d’accueil Rénov LR : verre dépoli, lumière rouge et animations au défilement. */
export default function HomeSite({settings=defaults}:{settings?:Data}){
 const [quote,setQuote]=useState(false),[section,setSection]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const tone=tracked[Math.min(section,tracked.length-1)][1];
 const phone=String(settings.phone||'').replace(/[^+\d]/g,'');
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const items=Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  items.forEach(item=>observer.observe(item));
  const onScroll=()=>{let index=0;tracked.forEach(([id],i)=>{const node=document.getElementById(id);if(node&&node.getBoundingClientRect().top<=140)index=i});setSection(index);const max=document.documentElement.scrollHeight-window.innerHeight;el.style.setProperty('--p',String(max>0?window.scrollY/max:0));el.style.setProperty('--sy',String(Math.min(window.scrollY,1200)))};onScroll();
  const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.matchMedia('(pointer: fine)').matches;
  const onMove=(e:PointerEvent)=>{el.style.setProperty('--mx',String(e.clientX/window.innerWidth-.5));el.style.setProperty('--my',String(e.clientY/window.innerHeight-.5))};
  // Reflet de verre : une lumière suit le pointeur sur le logo, les boutons et les cartes.
  const glassy=Array.from(el.querySelectorAll<HTMLElement>('.rlr-header .rlr-wordmark,.rl-btn,.rl-pill,.rl-contact-card,.rl-tags span,.rl-services button,.rl-promises article,.rl-steps li,.rl-cta'));
  glassy.forEach(node=>{node.classList.add('lq');if(!node.querySelector(':scope > .lq-light')){const light=document.createElement('span');light.className='lq-light';light.setAttribute('aria-hidden','true');node.appendChild(light)}});
  const onLight=(e:PointerEvent)=>{const node=(e.target as Element|null)?.closest?.('.lq') as HTMLElement|null;if(!node)return;const box=node.getBoundingClientRect();node.style.setProperty('--gx',`${e.clientX-box.left}px`);node.style.setProperty('--gy',`${e.clientY-box.top}px`)};
  el.addEventListener('pointermove',onLight,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});if(!calm)window.addEventListener('pointermove',onMove,{passive:true});
  return()=>{observer.disconnect();el.removeEventListener('pointermove',onLight);window.removeEventListener('scroll',onScroll);window.removeEventListener('pointermove',onMove)};
 },[]);
 return <div className="rl-site" ref={root}>
  <div className="rl-orbs" aria-hidden="true"><i/><i/><i/></div>
  <header className="rlr-header liquid" data-tone={tone}>
   <Wordmark/>
   <LiquidNavbar compact tone={tone} active={section} items={navItems} onChange={index=>setSection(index)}/>
  </header>

  <div className="rl-progress" aria-hidden="true"/>
  <main>
   <section className="rl-hero" id="top">
    <div className="rl-hero-bg" aria-hidden="true"><Image src="/images/interieur.png" alt="" fill priority sizes="100vw"/></div>
    <div className="rl-wrap rl-hero-grid">
     <div className="rl-hero-copy">
      <p className="rl-pill"><i/>Entreprise de rénovation intérieure</p>
      <h1>{['Nous','rénovons','votre','intérieur,'].map((word,i)=><span className="wd" key={word} style={{'--i':i} as React.CSSProperties}><span>{word}</span></span>)}<br/>{['de','la'].map((word,i)=><span className="wd" key={word} style={{'--i':i+4} as React.CSSProperties}><span>{word}</span></span>)}<span className="wd" style={{'--i':6} as React.CSSProperties}><span><em>salle de bain</em></span></span><br/>{['au','salon.'].map((word,i)=><span className="wd" key={word} style={{'--i':i+7} as React.CSSProperties}><span>{word}</span></span>)}</h1>
      <p className="rl-lead">Cuisine, salle de bain, sols, peinture, aménagement : une équipe pour transformer votre logement, avec un devis clair et un chantier soigné.</p>
      <div className="rl-actions"><button type="button" className="rl-btn red" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button>{phone?<a className="rl-btn line" href={`tel:${phone}`}><Phone size={17}/>{settings.phone}</a>:<a className="rl-btn line" href="#prestations">Nos prestations<ArrowRight size={18}/></a>}</div>
     </div>
     <aside className="rl-contact-card">
      <b>Un projet de rénovation ?</b>
      <p>Dites-nous ce que vous voulez transformer. Nous vous rappelons pour en parler et organiser une visite.</p>
      <ul><li><Check size={15}/>Réponse rapide</li><li><Check size={15}/>Visite et conseils sur place</li><li><Check size={15}/>Devis détaillé</li></ul>
      <button type="button" className="rl-btn white" onClick={()=>setQuote(true)}>Décrire mon projet<ArrowUpRight size={18}/></button>
     </aside>
    </div>
    <div className="rl-tags" aria-hidden="true">{['Salle de bain','Cuisine','Parquet','Peinture'].map((tag,i)=><span key={tag} style={{'--i':i} as React.CSSProperties}>{tag}</span>)}</div>
    <a className="rl-scroll" href="#prestations" aria-label="Découvrir les prestations"><span/></a>
   </section>

   <div className="rl-strip" aria-hidden="true"><div>{[0,1].map(n=><span key={n}>{words.map(word=><b key={word}>{word}<i/></b>)}</span>)}</div></div>

   <section className="rl-section" id="prestations">
    <div className="rl-wrap">
     <header className="rl-head" data-reveal><p className="rl-kicker">Nos prestations</p><h2>Chaque pièce<br/><em>mérite mieux.</em></h2><p>De la pièce unique à la rénovation complète, nous prenons en charge les travaux de A à Z.</p></header>
     <div className="rl-services">{services.map(([Icon,title,text],i)=><button type="button" key={title} className={`v${i%3}`} data-reveal style={{'--d':`${i*80}ms`} as React.CSSProperties} onClick={()=>setQuote(true)}><Icon className="bg" size={170} strokeWidth={.7} aria-hidden="true"/><span className="ic"><Icon size={24} strokeWidth={1.5}/></span><span className="n">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p><span className="go">Demander un devis<ArrowUpRight size={16}/></span></button>)}</div>
    </div>
   </section>

   <section className="rl-banner" id="engagements">
    <div className="rl-banner-bg" aria-hidden="true"><Image src="/images/interieur.png" alt="" fill sizes="100vw"/></div>
    <div className="rl-wrap">
     <header className="rl-head" data-reveal><p className="rl-kicker">Nos engagements</p><h2>Des travaux menés<br/><em>comme chez nous.</em></h2></header>
     <div className="rl-promises">{promises.map(([Icon,title,text],i)=><article key={title} data-reveal style={{'--d':`${i*110}ms`} as React.CSSProperties}><span className="ic"><Icon size={22} strokeWidth={1.6}/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div>
   </section>

   <section className="rl-section rl-dark" id="methode">
    <div className="rl-wrap">
     <header className="rl-head" data-reveal><p className="rl-kicker">Comment ça se passe</p><h2>Quatre étapes.<br/><em>Aucune surprise.</em></h2></header>
     <ol className="rl-steps" data-reveal>{steps.map(([title,text],i)=><li key={title} style={{'--d':`${i*140}ms`} as React.CSSProperties}><span className="dot">{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
     <div className="rl-actions rl-center" data-reveal><button type="button" className="rl-btn red" onClick={()=>setQuote(true)}>Lancer mon projet<ArrowUpRight size={18}/></button></div>
    </div>
   </section>

   <section className="rl-section rl-cta-wrap" id="contact">
    <div className="rl-wrap"><div className="rl-cta" data-reveal>
     <div className="rl-cta-bg" aria-hidden="true"><Image src="/images/interieur.png" alt="" fill sizes="100vw"/></div>
     <LogoMark size={64}/>
     <h2>Parlons de votre projet.</h2>
     <p>Décrivez vos travaux en quelques minutes et joignez des photos : nous vous rappelons pour organiser la visite.</p>
     <div className="rl-actions"><button type="button" className="rl-btn red" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button>{phone&&<a className="rl-btn glass" href={`tel:${phone}`}><Phone size={17}/>{settings.phone}</a>}{settings.email&&!String(settings.email).endsWith('.example')&&<a className="rl-btn glass" href={`mailto:${settings.email}`}><Mail size={17}/>{settings.email}</a>}</div>
    </div></div>
   </section>
  </main>

  <footer className="rl-footer"><div className="rl-wrap">
   <Wordmark/>
   <nav aria-label="Liens du pied de page">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}<Link href="/confidentialite">Confidentialité</Link><Link href="/connexion">Espace client & équipe</Link></nav>
   <p>{[settings.address,settings.rbq&&`SIRET ${settings.rbq}`].filter(Boolean).join(' · ')}</p>
   <small>© {new Date().getFullYear()} Rénov LR</small>
  </div></footer>
  {!quote&&<ContactBubble settings={settings} onQuote={()=>setQuote(true)}/>}
  {quote&&<QuoteRequest close={()=>setQuote(false)}/>}
 </div>;
}
