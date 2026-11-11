import {SideBySideSlide} from './ui/side-by-side-slide';

export default function PortfolioPreview() {
  return (
    <section className="arch-section" id="realisations" aria-labelledby="arch-compare-title">
      <div className="rl-wrap">
        <div className="arch-compare">
          <div className="arch-compare-copy">
            <h2 id="arch-compare-title">Avant / après</h2>
            <p>Faites glisser le curseur pour comparer le salon d’origine et sa version rénovée, avec un nouveau parquet, de nouveaux luminaires et un nouvel aménagement.</p>
            <small>Vue après travaux simulée.</small>
          </div>
          <SideBySideSlide beforeImage="/images/prestation-renovation-complete.jpg" afterImage="/images/salon-renove.webp"
            beforeAlt="Salon d’origine avec parquet foncé et canapé blanc" afterAlt="Projection du même salon rénové avec parquet clair et canapé ardoise" />
        </div>
      </div>
    </section>
  );
}
