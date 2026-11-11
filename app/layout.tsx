import CookieConsent from '@/components/cookie-consent';
import type {Metadata} from 'next';
import {headers} from 'next/headers';
import './globals.css';
import './responsive.css';
import './brand.css';
import './renov-lr.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://renov-lr.example'),title:{default:'Rénov LR — Des espaces à votre image',template:'%s | Rénov LR'},description:'Votre entrepreneur en rénovation à Laval, Montréal et sur la Rive-Nord. Cuisine, salle de bain, sous-sol et agrandissement.',icons:{icon:[{url:'/icon.svg',type:'image/svg+xml'}],shortcut:'/icon.svg',apple:'/app/apple-touch-icon.png'}};
export default async function Layout({children}:{children:React.ReactNode}){const locale=(await headers()).get('x-site-locale')==='en-CA'?'en-CA':'fr-CA';return <html lang={locale}><body spellCheck={true}>{children}<CookieConsent/></body></html>}
import './atelier.css';

import './modules.css';
import './workspace-glass.css';
