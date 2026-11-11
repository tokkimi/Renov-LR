'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Bath,Brush,CalendarCheck,Check,CookingPot,FileText,Hammer,Layers,Mail,Menu,Phone,ShieldCheck,Sparkles,X} from 'lucide-react';
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
const words=['Cuisine','Salle de bain','Parquet','Carrelage','Peinture','Cloisons','Électricité','Plomberie','Menuiserie'];

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
  const onScroll=()=>{setScrolled(window.scrollY>24);const max=document.documentElement.scrollHeight-window.innerHeight;el.style.setProperty('--p',String(max>0?window.scrollY/max:0));el.style.setProperty('--sy',String(Math.min(window.scrollY,1200)))};onScroll();
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

  <div className="rl-progress" aria-hidden="true"/>
  <main>
   <section className="rl-hero">
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
