import {SideBySideSlide} from './ui/side-by-side-slide';

export default function PortfolioPreview() {
  return (
    <section className="arch-section" id="realisations" aria-labelledby="arch-compare-title">
      <div className="rl-wrap">
        <div className="arch-compare">
          <div className="arch-compare-copy">
            <h2 id="arch-compare-title">Avant / après</h2>
            <p>Faites glisser le curseur pour voir la même pièce avant travaux et après la pose du parquet, la remise en état des murs et l’aménagement.</p>
          </div>
          <SideBySideSlide beforeImage="/images/salon-avant-travaux.webp" afterImage="/images/salon-apres-travaux.webp"
            beforeAlt="Salon avant travaux, avec enduit abîmé et sol brut" afterAlt="Le même salon rénové avec parquet clair et canapé crème" />
        </div>
      </div>
    </section>
  );
}
