import CookieConsent from '@/components/cookie-consent';
import type {Metadata,Viewport} from 'next';
import {headers} from 'next/headers';
import '@fontsource/marcellus/latin-400.css';
import '@fontsource-variable/jost';
import './site.css';
import './globals.css';
import './responsive.css';
import './brand.css';
import './renov-lr.css';
/** Affichage figé sur téléphone : pas de zoom ni de glissement latéral, comme une application. */
export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover',themeColor:'#ffffff'};
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://renov-lr.example'),title:{default:'Rénov LR — Rénovation intérieure',template:'%s | Rénov LR'},description:'Rénov LR rénove votre intérieur : cuisine, salle de bain, sols, peinture. Visite, plan de vos pièces et devis détaillé.',icons:{icon:[{url:'/app/lr-mark-48.png',type:'image/png',sizes:'48x48'}],shortcut:'/app/lr-mark-48.png',apple:'/app/lr-mark-180.png'}};
export default async function Layout({children}:{children:React.ReactNode}){const locale=(await headers()).get('x-site-locale')==='en-CA'?'en-CA':'fr-FR';return <html lang={locale}><body spellCheck={true}>{children}<CookieConsent/></body></html>}
import './atelier.css';

import './modules.css';
import './workspace-glass.css';
import './architecture.css';
