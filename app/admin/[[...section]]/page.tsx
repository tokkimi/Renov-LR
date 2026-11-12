import type {Metadata,Viewport} from 'next';
import {redirect} from 'next/navigation';
import {identity} from '@/lib/supabase';
import Workspace from '@/components/workspace';
export const metadata:Metadata={title:'Espace de gestion',robots:{index:false,follow:false},manifest:'/app/manifest.webmanifest',appleWebApp:{capable:true,title:'LR Réseaux',statusBarStyle:'default'},icons:{icon:'/app/lr-mark-48.png',apple:'/app/lr-mark-180.png'}};
export const viewport:Viewport={themeColor:'#ffffff',viewportFit:'cover'};
export const dynamic='force-dynamic';
export default async function Page(){const user=await identity();if(!user)redirect('/connexion');return <Workspace demo={false} initialUser={user}/>}
