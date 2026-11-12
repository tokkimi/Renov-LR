import Image from 'next/image';
import Link from 'next/link';

export function LogoMark({size = 34, className = ''}: {size?: number; className?: string}) {
  return <Image className={`rlr-mark ${className}`} src="/app/lr-mark-192.png"
    width={size} height={size} alt="" unoptimized />;
}

export function BrandName() {
  return <span className="arch-brand-type">
    <strong>LR Réseaux</strong>
    <small>Intérieur · Extérieur · Extension</small>
  </span>;
}

export function BrandLockup() {
  return (
    <Link className="arch-brand" href="/" aria-label="LR Réseaux, accueil">
      <Image src="/app/renov-lr-header.png" width={1536} height={1024} alt=""
        sizes="(max-width: 520px) 114px, 156px" />
    </Link>
  );
}

export function Wordmark({href = '/', label = 'LR Réseaux, accueil', className = ''}: {href?: string; label?: string; className?: string}) {
  return <Link className={`rlr-wordmark ${className}`} href={href} aria-label={label}>
    <LogoMark/><span className="rlr-signature">LR Réseaux</span>
  </Link>;
}
