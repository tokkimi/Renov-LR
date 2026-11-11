import PublicSite from '@/components/home-site';
import {configured,db} from '@/lib/supabase';
import {defaults} from '@/lib/model';
export const dynamic='force-dynamic';
const publicContactPhone = '+33666771864';

async function settings() {
 const fallback = {...defaults, phone: publicContactPhone};
 if (!configured()) return fallback;
 const {data} = await db().from('records').select('data').eq('kind','settings').limit(1).maybeSingle();
 const saved = data?.data;
 return {...fallback, ...saved, phone: String(saved?.phone || '').trim() || publicContactPhone};
}
export async function generateMetadata(){const s=await settings();return {title:s.seo_title,description:s.seo_description,alternates:{canonical:'/'}};}
export default async function Home(){const s=await settings();return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'HomeAndConstructionBusiness',name:s.name,telephone:s.phone,email:s.email,url:process.env.NEXT_PUBLIC_SITE_URL||'https://renov-lr.example'}).replace(/</g,'\\u003c')}}/><PublicSite settings={s}/></>}

