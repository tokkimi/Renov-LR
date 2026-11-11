'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Bath,Brush,Camera,CookingPot,FileText,Hammer,Layers,Mail,Menu,MessageSquare,Mic,Phone,ReceiptText,Ruler,ScanLine,X} from 'lucide-react';
import {LogoMark,Wordmark} from './brand';
import QuoteRequest from './request-form';
import {Data,defaults} from '@/lib/model';

const services=[
 [CookingPot,'Cuisine','Implantation, plans de travail, crédence, électricité et finitions.'],
 [Bath,'Salle de bain','Douche à l’italienne, faïence, plomberie et étanchéité.'],
 [Layers,'Sols & parquet','Parquet, carrelage, vinyle : dépose, préparation et pose.'],
 [Brush,'Peinture & murs','Préparation des supports, enduits, peinture et revêtements.'],
 [Hammer,'Aménagement intérieur','Cloisons, doublages, portes, rangements sur mesure.'],
 [ScanLine,'Rénovation complète','Un seul interlocuteur pour coordonner tous les corps de métier.']
] as const;
const steps=[
 [Ruler,'La visite','Nous relevons chaque pièce sur place : mesures, photos et notes prises pendant que vous nous expliquez votre projet.'],
 [ScanLine,'Le plan','Vos pièces sont dessinées en plan 2D, avec une projection 3D pour visualiser les volumes et les finitions.'],
 [FileText,'Le devis','Un devis détaillé pièce par pièce : matériaux et main-d’œuvre séparés, sans ligne obscure.'],
 [MessageSquare,'Le chantier','Vous suivez l’avancement, échangez avec nous et retrouvez vos documents dans votre espace client.']
] as const;
const links=[['#prestations','Prestations'],['#methode','Notre méthode'],['#espace','Espace client'],['#contact','Contact']] as const;

/** Page d’accueil Rénov LR : identité graphique « plan d’architecte », sans photographie d’emprunt. */
export default function HomeSite({settings=defaults}:{settings?:Data}){
 const [quote,setQuote]=useState(false),[menu,setMenu]=useState(false);
 const header=useRef<HTMLElement>(null);
 const phone=String(settings.phone||'').replace(/[^+\d]/g,'');
 useEffect(()=>{
  if(!menu)return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};
  const outside=(e:MouseEvent)=>{if(header.current&&!header.current.contains(e.target as Node))setMenu(false)};
  window.addEventListener('keydown',key);window.addEventListener('mousedown',outside);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('mousedown',outside)};
 },[menu]);
 return <div className="rl-site">
  <header className="rlr-header" ref={header}>
   <div className="rlr-bar"><Wordmark/><button type="button" className="rlr-burger" aria-label={menu?'Fermer le menu':'Ouvrir le menu'} aria-expanded={menu} aria-controls="rlr-menu" onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button></div>
   {menu&&<nav id="rlr-menu" className="rlr-menu" aria-label="Navigation principale">
    {links.map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}
    <Link href="/connexion" onClick={()=>setMenu(false)}>Se connecter<ArrowUpRight size={16}/></Link>
    <div className="rlr-menu-foot"><button type="button" className="rlr-menu-cta" onClick={()=>{setMenu(false);setQuote(true)}}>Demander un devis<ArrowUpRight size={17}/></button></div>
   </nav>}
  </header>

  <main>
   <section className="rl-hero">
    <div className="rl-hero-copy">
     <p className="rl-kicker"><span/>Rénovation intérieure</p>
     <h1>Votre rénovation,<br/>dessinée <em>avant</em><br/>d’être chiffrée.</h1>
     <p className="rl-lead">Nous mesurons, nous traçons le plan de vos pièces, puis nous vous remettons un devis clair. Vous savez ce qui sera fait, où, et pour combien.</p>
     <div className="rl-actions"><button type="button" className="rl-btn dark" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button><a className="rl-btn ghost" href="#methode">Voir notre méthode<ArrowRight size={18}/></a></div>
    </div>
    <div className="rl-hero-plan" aria-hidden="true">
     <svg viewBox="0 0 560 420" fill="none">
      <g className="rl-plan-grid">{Array.from({length:13},(_,i)=><line key={'v'+i} x1={40+i*40} y1="20" x2={40+i*40} y2="400"/>)}{Array.from({length:10},(_,i)=><line key={'h'+i} x1="20" y1={30+i*40} x2="540" y2={30+i*40}/>)}</g>
      <path className="rl-plan-wall" d="M60 60H500V360H60Z"/>
      <path className="rl-plan-wall thin" d="M300 60V200M300 250V360M60 230H170M220 230H300M300 200H400M450 200H500"/>
      <g className="rl-plan-door"><path d="M170 230a50 50 0 0 1 50 50"/><path d="M170 230l35 35"/><path d="M300 200a50 50 0 0 0-50 50" /><path d="M300 250l-36-34"/><path d="M400 200a50 50 0 0 0 50 50"/><path d="M450 200l-35 35"/></g>
      <g className="rl-plan-dim"><path d="M60 388H500M60 382v12M500 382v12M300 382v12"/><path d="M528 60V360M522 60h12M522 360h12M522 200h12"/></g>
      <g className="rl-plan-text"><text x="180" y="150">Séjour</text><text x="180" y="170" className="s">24,5 m²</text><text x="400" y="135">Cuisine</text><text x="400" y="155" className="s">9,8 m²</text><text x="180" y="300">Chambre</text><text x="180" y="320" className="s">12,0 m²</text><text x="400" y="290">Salle de bain</text><text x="400" y="310" className="s">4,6 m²</text><text x="180" y="408" className="s">6,00 m</text><text x="400" y="408" className="s">5,00 m</text></g>
     </svg>
     <div className="rl-chip one"><Ruler size={16}/><span><b>Relevé sur place</b>mesures, photos, notes vocales</span></div>
     <div className="rl-chip two"><FileText size={16}/><span><b>Devis pièce par pièce</b>matériaux + main-d’œuvre</span></div>
    </div>
   </section>

   <div className="rl-strip" aria-hidden="true"><div>{[0,1].map(n=><span key={n}>Cuisine <i/> Salle de bain <i/> Parquet <i/> Carrelage <i/> Peinture <i/> Cloisons <i/> Électricité <i/> Plomberie <i/> Menuiserie <i/> </span>)}</div></div>

   <section className="rl-section" id="prestations">
    <header className="rl-head"><p className="rl-kicker"><span/>Prestations</p><h2>Tout l’intérieur,<br/>un seul interlocuteur.</h2><p>De la pièce unique à la rénovation complète, nous organisons les travaux et vous tenons informé à chaque étape.</p></header>
    <div className="rl-services">{services.map(([Icon,title,text],i)=><button type="button" key={title} onClick={()=>setQuote(true)}><span className="n">{String(i+1).padStart(2,'0')}</span><Icon size={26} strokeWidth={1.4}/><h3>{title}</h3><p>{text}</p><ArrowUpRight className="go" size={18}/></button>)}</div>
   </section>

   <section className="rl-section rl-dark" id="methode">
    <header className="rl-head"><p className="rl-kicker"><span/>Notre méthode</p><h2>Quatre étapes.<br/>Aucune surprise.</h2></header>
    <ol className="rl-steps">{steps.map(([Icon,title,text],i)=><li key={title}><span className="n">{i+1}</span><Icon size={24} strokeWidth={1.4}/><h3>{title}</h3><p>{text}</p></li>)}</ol>
   </section>

   <section className="rl-section rl-space" id="espace">
    <div className="rl-space-copy"><p className="rl-kicker"><span/>Espace client</p><h2>Votre chantier<br/>dans la poche.</h2><p>Chaque client dispose d’un espace sécurisé : la messagerie avec notre équipe, les devis à signer, les factures et les photos du chantier, au même endroit.</p><div className="rl-actions"><Link className="rl-btn dark" href="/connexion">Accéder à mon espace<ArrowUpRight size={18}/></Link></div></div>
    <div className="rl-mock" aria-hidden="true">
     <div className="rl-glass msg"><MessageSquare size={17}/><div><b>Messagerie</b><p>« Le parquet du séjour est posé, voici les photos. »</p></div></div>
     <div className="rl-glass doc"><FileText size={17}/><div><b>Devis · Séjour et cuisine</b><p>À signer en ligne</p></div><span>PDF</span></div>
     <div className="rl-glass pay"><ReceiptText size={17}/><div><b>Facture d’acompte</b><p>Réglée</p></div><span className="ok">✓</span></div>
     <div className="rl-glass tools"><span><Camera size={16}/>Photos</span><span><Mic size={16}/>Notes</span><span><Ruler size={16}/>Mesures</span></div>
    </div>
   </section>

   <section className="rl-cta" id="contact">
    <LogoMark size={54}/>
    <h2>Parlons de votre projet.</h2>
    <p>Décrivez vos travaux en quelques minutes, joignez des photos : nous vous rappelons pour organiser la visite.</p>
    <div className="rl-actions"><button type="button" className="rl-btn light" onClick={()=>setQuote(true)}>Demander un devis<ArrowUpRight size={18}/></button>{phone&&<a className="rl-btn outline" href={`tel:${phone}`}><Phone size={17}/>{settings.phone}</a>}{settings.email&&!String(settings.email).endsWith('.example')&&<a className="rl-btn outline" href={`mailto:${settings.email}`}><Mail size={17}/>{settings.email}</a>}</div>
   </section>
  </main>

  <footer className="rl-footer">
   <Wordmark/>
   <nav aria-label="Liens du pied de page">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}<Link href="/confidentialite">Confidentialité</Link><Link href="/connexion">Espace client & équipe</Link></nav>
   <p>{[settings.address,settings.rbq&&`SIRET ${settings.rbq}`].filter(Boolean).join(' · ')}</p>
   <small>© {new Date().getFullYear()} Rénov LR</small>
  </footer>
  {quote&&<QuoteRequest close={()=>setQuote(false)}/>}
 </div>;
}
