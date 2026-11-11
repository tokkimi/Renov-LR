"use client";

import {useMemo, useRef, useState} from 'react';
import {useMotionValueEvent, useScroll} from 'motion/react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {WarpCarousel} from './warp-carousel';
import ServiceDetails from '../service-details';
import type {RenovationService} from '../renovation-services';

const pinTop = 108;
const stageStyle = {height: '100%', minHeight: 0, aspectRatio: 'auto'};

export default function ServiceWarpCarousel({cards, onSelect}: {
  cards: readonly RenovationService[];
  onSelect: (quoteType: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState<RenovationService | null>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: sequence, offset: [`start ${pinTop}px`, 'end end']});
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    if (panel.current && getComputedStyle(panel.current).position === 'sticky') {
      setIndex(Math.min(cards.length - 1, Math.floor(progress * cards.length)));
    }
  });
  const textures = useMemo(() => cards.map(card => ({
    title: card.title,
    image: card.image,
    value: '',
  })), [cards]);
  const active = cards[index];
  const select = (position: number) => {
    setIndex(position);
    const region = sequence.current;
    const sticky = panel.current;
    if (!region || !sticky || getComputedStyle(sticky).position !== 'sticky') return;

    const distance = region.offsetHeight - sticky.offsetHeight;
    const offset = pinTop - region.getBoundingClientRect().top;
    if (offset >= 0 && offset <= distance) {
      window.scrollTo({
        top: window.scrollY - offset + (position + .5) / cards.length * distance,
        behavior: 'instant',
      });
    }
  };
  const move = (step: number) => select((index + step + cards.length) % cards.length);

  return (
    <div className="rl-warp-sequence" ref={sequence}>
      <div className="rl-warp" ref={panel}>
        <div className="rl-warp-stage">
          <WarpCarousel cards={textures} index={index} onIndexChange={select}
            autoplay={false} flatDesktop onCardActivate={position => setDetail(cards[position])} background="#f3f6f8"
            ariaLabel="Carrousel des prestations" style={stageStyle}/>
        </div>
        <div className="rl-warp-controls">
          <button type="button" className="rl-btn glass" aria-label="Prestation précédente" onClick={() => move(-1)}><ArrowLeft size={18}/></button>
          <div className="rl-warp-tabs" aria-label="Choisir une prestation">
            {cards.map((card, position) => (
              <button key={card.title} type="button" className="rl-btn glass"
                aria-pressed={index === position} aria-haspopup={card.quoteType === 'Réparation' ? 'dialog' : undefined}
                onClick={() => { select(position); if (card.quoteType === 'Réparation') setDetail(card); }}>{card.title}</button>
            ))}
          </div>
          <button type="button" className="rl-btn glass" aria-label="Prestation suivante" onClick={() => move(1)}><ArrowRight size={18}/></button>
        </div>
        <div className="rl-warp-details">
          <p>{active.description}</p>
          <button type="button" className="rl-warp-open" aria-haspopup="dialog"
            aria-label={`Voir la prestation ${active.title}`} onClick={() => setDetail(active)}>Voir la prestation</button>
        </div>
      </div>
      {detail && <ServiceDetails service={detail} onClose={() => setDetail(null)}
        onQuote={() => { setDetail(null); onSelect(detail.quoteType); }}/>}
    </div>
  );
}
