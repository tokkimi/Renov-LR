import Link from 'next/link';

/**
 * Logo Rénov LR : un angle de mur vu en plan (le « L ») et l’arc d’ouverture d’une porte.
 * Il suit la couleur du texte, donc il fonctionne sur fond clair comme sur fond sombre.
 */
export function LogoMark({size=34,className=''}:{size?:number;className?:string}){
 return <svg className={`rlr-mark ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <defs><linearGradient id="rlr-swing" x1="9" y1="39" x2="34" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="currentColor" stopOpacity=".3"/><stop offset="1" stopColor="currentColor" stopOpacity=".04"/></linearGradient></defs>
  <path d="M9 39V9a30 30 0 0 1 30 30Z" fill="url(#rlr-swing)"/>
  <path d="M9 9a30 30 0 0 1 30 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 3.2" strokeLinecap="round"/>
  <path d="M9 39 30.2 17.8" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"/>
  <path d="M5 3v40h40" stroke="currentColor" strokeWidth="8"/>
 </svg>;
}
export function Wordmark({href='/',label='Rénov LR, accueil',className=''}:{href?:string;label?:string;className?:string}){
 return <Link className={`rlr-wordmark ${className}`} href={href} aria-label={label}><LogoMark/><span>Rénov</span><b>LR</b></Link>;
}
