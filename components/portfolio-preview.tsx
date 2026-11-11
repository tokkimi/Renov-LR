'use client';

import {useState} from 'react';
import Image from 'next/image';
import {SideBySideSlide} from './ui/side-by-side-slide';

const examples = [
  {category: 'Cuisine', image: '/images/prestation-cuisine.jpg', alt: 'Îlot clair et meubles en bois dans une cuisine'},
  {category: 'Salle de bain', image: '/images/prestation-salle-de-bain.jpg', alt: 'Vasque, miroir rond et revêtement clair dans une salle de bain'},
  {category: 'Aménagement', image: '/images/prestation-amenagement.jpg', alt: 'Étagères murales et rangements intégrés'},
] as const;

const categories = ['Tout', ...examples.map(example => example.category)];

export default function PortfolioPreview() {
  const [category, setCategory] = useState('Tout');
  const visible = examples.filter(example => category === 'Tout' || example.category === category);

  return (
    <section className="arch-section arch-gallery" id="realisations" aria-labelledby="arch-gallery-title">
      <div className="rl-wrap">
        <header className="arch-heading">
          <p className="arch-eyebrow">Galerie de démonstration</p>
          <h2 id="arch-gallery-title">Matières et espaces.</h2>
          <p>Photographies d’illustration. La galerie pourra accueillir les réalisations de Rénov LR.</p>
        </header>
        <div className="arch-filters" aria-label="Filtrer la galerie">
          {categories.map(item => (
            <button key={item} type="button" className="rl-btn arch-outline" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="arch-gallery-grid">
          {visible.map(example => (
            <figure key={example.category}>
              <div><Image src={example.image} alt={example.alt} fill sizes="(max-width: 600px) 92vw, 33vw" /></div>
              <figcaption>{example.category}</figcaption>
            </figure>
          ))}
        </div>
        <div className="arch-compare">
          <div className="arch-compare-copy">
            <h3>Avant / après</h3>
            <p>De la pose au parquet fini. Faites glisser le curseur pour comparer les deux vues.</p>
            <small>Vue après travaux simulée.</small>
          </div>
          <SideBySideSlide beforeImage="/images/prestation-pose-parquet.jpg" afterImage="/images/parquet-apres.jpg"
            beforeAlt="Pose du parquet devant les fenêtres et la cheminée" afterAlt="Projection du même intérieur avec le parquet terminé" />
        </div>
      </div>
    </section>
  );
}
