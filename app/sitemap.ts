import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{
 const base=process.env.NEXT_PUBLIC_SITE_URL||'https://renov-lr.example';
 return ['/','/confidentialite'].map(path=>({url:base+path,changeFrequency:'monthly',priority:path==='/'?1:.3}));
}
