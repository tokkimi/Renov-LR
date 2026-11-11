"use client";

import {useMemo, useRef, useState} from 'react';
import {useMotionValueEvent, useScroll} from 'motion/react';
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react';
import {WarpCarousel} from './warp-carousel';

type Service = {title: string; description: string; image: string};

const pinTop = 108;
const stageStyle = {height: '100%', minHeight: 0, aspectRatio: 'auto'};

export default function ServiceWarpCarousel({cards, onSelect}: {
  cards: readonly Service[];
  onSelect: () => void;
}) {
  const [index, setIndex] = useState(0);
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
            autoplay={false} flatDesktop warp={.62} background="#f3f6f8"
            ariaLabel="Carrousel des prestations" style={stageStyle}/>
        </div>
        <div className="rl-warp-controls">
          <button type="button" className="rl-btn glass" aria-label="Prestation précédente" onClick={() => move(-1)}><ArrowLeft size={18}/></button>
          <div className="rl-warp-tabs" aria-label="Choisir une prestation">
            {cards.map((card, position) => (
              <button key={card.title} type="button" className="rl-btn glass"
                aria-pressed={index === position} onClick={() => select(position)}>{card.title}</button>
            ))}
          </div>
          <button type="button" className="rl-btn glass" aria-label="Prestation suivante" onClick={() => move(1)}><ArrowRight size={18}/></button>
        </div>
        <div className="rl-warp-details">
          <p>{active.description}</p>
          <button type="button" className="rl-btn red" onClick={onSelect}>Demander un devis<ArrowUpRight size={18}/></button>
        </div>
      </div>
    </div>
  );
}
