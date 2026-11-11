import Link from 'next/link';

const L='M9 11h11v31h13.5v11H9Z';
const R='M27 11h15.5c8 0 13.5 5.2 13.5 12.6 0 5.6-3 9.8-7.8 11.8L56.5 53H45.2l-6.9-15.800H37V53H27ZM37 20v8.800h4.700c3 0 4.800-1.700 4.800-4.400S44.700 20 41.700 20Z';
/**
 * Monogramme Rénov LR : un « L » rouge plein et un « R » en verre dépoli qui le recouvre,
 * le rouge se diffusant à travers la vitre. Posé sur une pastille sombre pour rester lisible partout.
 */
export function LogoMark({size=34,className=''}:{size?:number;className?:string}){
 return <svg className={`rlr-mark ${className}`} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
  <defs>
   <linearGradient id="lr-red" x1="10" y1="12" x2="40" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ff5a4f"/><stop offset="1" stopColor="#d90f1c"/></linearGradient>
   <linearGradient id="lr-glass" x1="24" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".62"/><stop offset=".55" stopColor="#fff" stopOpacity=".2"/><stop offset="1" stopColor="#fff" stopOpacity=".38"/></linearGradient>
   <linearGradient id="lr-edge" x1="24" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity=".25"/></linearGradient>
   <radialGradient id="lr-glow" cx="24" cy="44" r="34" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ff3b30" stopOpacity=".55"/><stop offset="1" stopColor="#ff3b30" stopOpacity="0"/></radialGradient>
   <filter id="lr-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
   <clipPath id="lr-clip"><path fillRule="evenodd" clipRule="evenodd" d={R}/></clipPath>
  </defs>
  <rect width="64" height="64" rx="16" fill="#0c0c0d"/>
  <rect width="64" height="64" rx="16" fill="url(#lr-glow)"/>
  <path d={L} fill="url(#lr-red)"/>
  <g clipPath="url(#lr-clip)"><path d={L} fill="#ff3b30" filter="url(#lr-blur)"/><rect x="24" y="8" width="36" height="48" fill="url(#lr-glass)"/></g>
  <path fillRule="evenodd" d={R} fill="none" stroke="url(#lr-edge)" strokeWidth="1"/>
  <rect x=".5" y=".5" width="63" height="63" rx="15.5" fill="none" stroke="#fff" strokeOpacity=".12"/>
 </svg>;
}
export function Wordmark({href='/',label='Rénov LR, accueil',className=''}:{href?:string;label?:string;className?:string}){
 return <Link className={`rlr-wordmark ${className}`} href={href} aria-label={label}><span className="rlr-signature"><b>Rénov</b><small>intérieur</small></span><LogoMark/></Link>;
}
