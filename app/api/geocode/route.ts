import {NextResponse} from 'next/server';
import {identity} from '@/lib/supabase';
import {banPoint} from '@/lib/geo';

/** Server-side geocoding of a project address (Base Adresse Nationale, Géoplateforme, no key). Admin only. */
export async function GET(req:Request){
 const user=await identity();
 if(!user)return NextResponse.json({error:'Connexion requise.'},{status:401});
 if(user.role!=='admin')return NextResponse.json({error:'Accès refusé.'},{status:403});
 const q=(new URL(req.url).searchParams.get('q')||'').trim();
 if(q.length<4||q.length>180)return NextResponse.json({error:'Adresse trop courte ou trop longue.'},{status:400});
 try{
  const res=await fetch(`https://data.geopf.fr/geocodage/search?limit=1&q=${encodeURIComponent(q)}`,{signal:AbortSignal.timeout(6000),cache:'no-store',headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error();
  const point=banPoint(await res.json());
  if(!point)return NextResponse.json({error:'Adresse introuvable. Précisez la ville ou le code postal.'},{status:404});
  return NextResponse.json({point},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Service de géolocalisation indisponible. Réessayez plus tard.'},{status:503})}
}
