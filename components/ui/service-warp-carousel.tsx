"use client";

import {useMemo, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react';
import {WarpCarousel} from './warp-carousel';

type Service = {title: string; description: string; image: string};

const stageStyle = {height: '100%', minHeight: 0, aspectRatio: 'auto'};

export default function ServiceWarpCarousel({cards, onSelect}: {
  cards: readonly Service[];
  onSelect: () => void;
}) {
  const [index, setIndex] = useState(0);
  const textures = useMemo(() => cards.map(card => ({
    title: card.title,
    image: card.image,
    value: '',
    glow: '#7d99b3',
  })), [cards]);
  const active = cards[index];
  const move = (step: number) => setIndex(current => (current + step + cards.length) % cards.length);

  return (
    <div className="rl-warp">
      <div className="rl-warp-stage">
        <WarpCarousel cards={textures} index={index} onIndexChange={setIndex}
          autoplay={false} warp={0.75} background="#e8eef3"
          ariaLabel="Carrousel des prestations" style={stageStyle}/>
      </div>
      <div className="rl-warp-controls">
        <button type="button" className="rl-btn glass" aria-label="Prestation précédente" onClick={() => move(-1)}><ArrowLeft size={18}/></button>
        <div className="rl-warp-tabs" aria-label="Choisir une prestation">
          {cards.map((card, position) => (
            <button key={card.title} type="button" className="rl-btn glass"
              aria-pressed={index === position} onClick={() => setIndex(position)}>{card.title}</button>
          ))}
        </div>
        <button type="button" className="rl-btn glass" aria-label="Prestation suivante" onClick={() => move(1)}><ArrowRight size={18}/></button>
      </div>
      <div className="rl-warp-details">
        <div><h3>{active.title}</h3><p>{active.description}</p></div>
        <button type="button" className="rl-btn red" onClick={onSelect}>Demander un devis<ArrowUpRight size={18}/></button>
      </div>
    </div>
  );
}
