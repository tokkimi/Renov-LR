import Image from 'next/image';
import Link from 'next/link';

export function LogoMark({size = 34, className = ''}: {size?: number; className?: string}) {
  return <Image className={`rlr-mark ${className}`} src="/app/lr-mark-192.png"
    width={size} height={size} alt="" unoptimized />;
}

/** Nom et signature du logo officiel, en image, pour l’écran de chargement. */
export function BrandName() {
  return <Image className="arch-brand-wordmark" src="/app/lr-reseaux-wordmark.png"
    width={1100} height={237} alt="LR Réseaux — Intérieur · Extérieur · Extension" unoptimized />;
}

export function BrandLockup() {
  return (
    <Link className="arch-brand" href="/" aria-label="LR Réseaux, accueil">
      <Image src="/app/lr-reseaux-logo.png" width={1100} height={634} alt=""
        sizes="(max-width: 520px) 300px, 400px" />
    </Link>
  );
}

export function Wordmark({href = '/', label = 'LR Réseaux, accueil', className = ''}: {href?: string; label?: string; className?: string}) {
  return <Link className={`rlr-wordmark ${className}`} href={href} aria-label={label}>
    <LogoMark/><span className="rlr-signature">LR Réseaux</span>
  </Link>;
}
