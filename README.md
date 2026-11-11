# Rénov LR

Site public et espace de gestion de Rénov LR (Next.js, Supabase, PDF, courriel Resend). La base reprend l’application MG Pro, adaptée à l’identité Rénov LR : fond blanc, texte noir, mot-symbole en attendant le logo.

## Démarrer

```
npm install
npm run dev        # http://localhost:3000
npm test           # tests unitaires
npm run build      # build de production
```

Sans variables d’environnement, le site public et `/demo` (données fictives en mémoire) fonctionnent. `/admin` exige Supabase.

## Configuration

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` : base de données et comptes. Migrations : `node scripts/migrate.mjs`. Premier dirigeant : `node scripts/create-owner.mjs`.
- `NEXT_PUBLIC_SITE_URL` : domaine public (sitemap, liens des courriels).
- `RESEND_API_KEY`, `MAIL_FROM` : envoi des courriels (facultatif).
- `ANTHROPIC_API_KEY` : analyse des notes de visite par IA (facultatif ; une analyse locale prend le relais).

## Ce qui est propre à Rénov LR

- **En-tête du site** : barre flottante arrondie, translucide à 50 %, logo à gauche et menu hamburger à droite sur tous les écrans (`components/brand.tsx`, `app/renov-lr.css`).
- **Espace de gestion sur téléphone** : barre flottante en bas avec Accueil, Messages, le bouton « + » central qui lance une visite, Factures et Menu (`components/mobile-tabbar.tsx`).
- **Visite en 4 étapes** : client et besoins → mesures, notes vocales et photos → plan 2D → chiffrage. À la fin, « Valider et créer le devis » ou « Valider et créer la facture » reprend les lignes chiffrées.
- **Paramètres › Tarifs et prix au mètre** : chaque poste (parquet, peinture, carrelage…) a un prix matériaux + main-d’œuvre par unité, des paliers dégressifs facultatifs et un simulateur (`lib/tariffs.ts`, `components/tariff-settings.tsx`). Ces tarifs alimentent le chiffrage des visites.

## À personnaliser avant la mise en ligne

- Coordonnées de l’entreprise (téléphone, courriel, adresse, licence, numéros de taxes) : Paramètres de l’espace de gestion. Le courriel par défaut `contact@renov-lr.example` est un exemple.
- Textes des pages (`content/*.json`, `components/atelier-site.tsx`) : ils viennent du site MG Pro et citent encore Laval, Montréal et ses services.
- Photos (`public/images/`) : ce sont celles de MG Pro, à remplacer par les réalisations de Rénov LR.
- Taxes : TPS/TVQ et dollars canadiens par défaut, taux modifiables dans les paramètres.
- Logo : remplacer le mot-symbole dans `components/brand.tsx` et les icônes de `public/app/`.
