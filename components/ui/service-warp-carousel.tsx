"use client";

import {useEffect,useState,type ComponentType} from 'react';
import {ArrowUpRight,type LucideProps} from 'lucide-react';

export type ServiceWarpCard={title:string;description:string;image:string;icon:ComponentType<LucideProps>};

/** Carousel de prestations : cartes sur un anneau 3D, pilotable au clic et au clavier. */
export default function ServiceWarpCarousel({cards,onSelect}:{cards:readonly ServiceWarpCard[];onSelect:()=>void}){
 const [index,setIndex]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setIndex(i=>(i+1)%cards.length),4800);return()=>window.clearInterval(timer)},[cards.length]);
 return <section className="service-warp" aria-label="Prestations" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight')setIndex(i=>(i+1)%cards.length);if(e.key==='ArrowLeft')setIndex(i=>(i-1+cards.length)%cards.length)}}>
  <div className="service-warp-stage">
   {cards.map((card,i)=>{const offset=((i-index+cards.length+Math.floor(cards.length/2))%cards.length)-Math.floor(cards.length/2);const Icon=card.icon;return <button type="button" key={card.title} className="service-warp-card" data-offset={offset} style={{'--offset':offset,'--order':i} as React.CSSProperties} onClick={()=>offset===0?onSelect():setIndex(i)} aria-current={offset===0?'true':undefined}>
    <span className="service-warp-image" style={{backgroundImage:`url(${card.image})`}}/>
    <span className="service-warp-scrim"/><span className="service-warp-number">{String(i+1).padStart(2,'0')}</span>
    <span className="service-warp-copy"><span className="service-warp-icon"><Icon size={20}/></span><strong>{card.title}</strong><small>{card.description}</small><em>Demander un devis <ArrowUpRight size={15}/></em></span>
   </button>})}
  </div>
  <div className="service-warp-dots" aria-hidden="true">{cards.map((_,i)=><i key={i} className={i===index?'on':''}/>)}</div>
 </section>
}
