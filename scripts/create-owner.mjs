import {createClient} from '@supabase/supabase-js';
import fs from 'node:fs';
import crypto from 'node:crypto';
process.loadEnvFile('.env.local');
const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const {data:existing}=await s.from('profiles').select('id').eq('role','admin').limit(1);
if(existing?.length){console.log('Owner already exists');process.exit(0)}
const password=crypto.randomBytes(24).toString('base64url');
const email='info@renov-lr.example';
const {data,error}=await s.auth.admin.createUser({email,password,email_confirm:true});if(error)throw error;
const p=await s.from('profiles').insert({id:data.user.id,name:'Léo Renaud',email,role:'admin',active:true});if(p.error)throw p.error;
fs.writeFileSync('.owner-access.txt',`Accès dirigeant Rénov LR\nhttps://renov-lr.example/connexion\nCourriel : ${email}\nMot de passe : ${password}\n\nChangez ce mot de passe après connexion via /compte.\n`);
console.log('Owner created. Credentials saved in ignored local .owner-access.txt');
