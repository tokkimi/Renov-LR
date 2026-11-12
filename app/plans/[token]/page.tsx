import SharedPlan from '@/components/shared-plan';
export const metadata={title:'Votre projet | LR Réseaux',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({params}:{params:Promise<{token:string}>}){return <SharedPlan token={(await params).token}/>;}
