type Work = {title: string; text: string};
export type RenovationService = {
  title: string;
  quoteType: string;
  description: string;
  image: string;
  secondImage?: {src: string; alt: string; preparation?: boolean};
  imageAlt: string;
  intro: string;
  works: Work[];
  steps: Work[];
  duration: string;
  timing: string;
};

export const services: readonly RenovationService[] = [
  {
    title: 'Cuisine',
    quoteType: 'Cuisine',
    description: 'Implantation, plans de travail, crédence, électricité et finitions.',
    image: '/images/prestation-cuisine.jpg',
    imageAlt: 'Cuisine avec îlot et rangements sur mesure',
    secondImage: {src: '/images/accueil-cuisine.webp', alt: 'Cuisine ouverte avec îlot en chêne et meubles anthracite'},
    intro: 'Un plan de travail à remplacer, des rangements à repenser ou une cuisine à refaire entièrement. Le projet part de vos usages, de l’espace disponible et de ce que vous souhaitez garder.',
    works: [
      {title: 'Rafraîchir ou remplacer', text: 'Plan de travail, crédence, façades ou meubles, selon l’état de l’existant.'},
      {title: 'Repenser l’implantation', text: 'Cuisine linéaire, en L ou avec îlot. On tient compte des passages, des ouvertures et de la place nécessaire à l’électroménager.'},
      {title: 'Préparer et raccorder', text: 'Dépose, adaptation des arrivées d’eau et des prises si le plan change, pose et finitions.'},
    ],
    steps: [
      {title: 'Conception', text: 'Relevé des mesures, choix de l’implantation, des rangements et des matériaux.'},
      {title: 'Préparation', text: 'Dépose des éléments concernés et préparation des supports et raccordements.'},
      {title: 'Pose et finitions', text: 'Pose des meubles, du plan de travail et de la crédence, puis vérification des raccordements.'},
    ],
    duration: 'De quelques jours pour une intervention ciblée à plusieurs semaines pour une reprise complète.',
    timing: 'Le déplacement des réseaux et la disponibilité des meubles ou d’un plan sur mesure influencent le calendrier.',
  },
  {
    title: 'Salle de bain',
    quoteType: 'Salle de bain',
    description: 'Douche à l’italienne, faïence, plomberie et étanchéité.',
    image: '/images/prestation-salle-de-bain.jpg',
    imageAlt: 'Salle de bain avec meuble vasque en bois, miroir rond et paroi de douche',
    secondImage: {src: '/images/salle-de-bain-preparation.webp', alt: 'Préparation de l’étanchéité et pose du carrelage de la douche', preparation: true},
    intro: 'Remplacer une baignoire, remettre en état les revêtements ou reprendre la pièce entière. La visite permet de vérifier ce qui peut être conservé et comment adapter la salle de bain à vos usages.',
    works: [
      {title: 'Remplacer des équipements', text: 'Douche, receveur, meuble vasque et accessoires, avec vérification des raccordements existants.'},
      {title: 'Refaire les surfaces', text: 'Carrelage, faïence et préparation des supports, avec traitement de l’étanchéité dans les zones exposées à l’eau.'},
      {title: 'Rénover la pièce', text: 'Dépose, adaptation de la plomberie et remise en place des équipements selon la configuration retenue.'},
    ],
    steps: [
      {title: 'Conception', text: 'On vérifie les évacuations, l’accès et les dimensions avant de choisir les équipements.'},
      {title: 'Préparation et travaux', text: 'Dépose, préparation de la plomberie et des supports, étanchéité et pose des revêtements.'},
      {title: 'Installation et vérification', text: 'Pose de la douche et du mobilier, contrôles d’écoulement et finitions.'},
    ],
    duration: 'Quelques jours pour un remplacement ciblé. Une réfection complète se compte généralement en semaines.',
    timing: 'La plomberie, le temps de séchage et l’état des supports pèsent sur la durée.',
  },
  {
    title: 'Sols & parquet',
    quoteType: 'Sols et parquet',
    description: 'Parquet, carrelage, vinyle : dépose, préparation et pose.',
    image: '/images/prestation-pose-parquet.jpg',
    imageAlt: 'Pose de lames de parquet dans une pièce lumineuse',
    secondImage: {src: '/images/parquet-apres.jpg', alt: 'Exemple de parquet après la pose'},
    intro: 'Réparer ou rénover un sol que vous aimez, ou repartir sur un nouveau revêtement. Le choix dépend de l’état du support, du passage et de l’usage de la pièce.',
    works: [
      {title: 'Rénover l’existant', text: 'Reprise localisée ou remise en état du parquet lorsque son état et son épaisseur le permettent.'},
      {title: 'Changer le revêtement', text: 'Pose de parquet, carrelage ou vinyle selon la pièce et les contraintes du support.'},
      {title: 'Soigner les raccords', text: 'Préparation du sol, traitement des différences de niveau, plinthes et seuils.'},
    ],
    steps: [
      {title: 'Diagnostic', text: 'Contrôle du sol, de sa planéité et des raccords aux autres pièces.'},
      {title: 'Préparation', text: 'Dépose ou remise en état du support selon le revêtement choisi.'},
      {title: 'Pose et finitions', text: 'Pose, ajustement des découpes, plinthes et seuils.'},
    ],
    duration: 'Souvent quelques jours pour une pièce, selon la surface et la préparation nécessaire.',
    timing: 'Une dépose importante ou une remise à niveau du support peut allonger l’intervention.',
  },
  {
    title: 'Peinture & murs',
    quoteType: 'Peinture et murs',
    description: 'Préparation des supports, enduits, peinture et revêtements.',
    image: '/images/prestation-peinture.jpg',
    imageAlt: 'Application de peinture au rouleau sur un mur intérieur',
    secondImage: {src: '/images/reparation-enduit.webp', alt: 'Préparation du mur à l’enduit avant peinture', preparation: true},
    intro: 'Un mur à remettre en état, une pièce à rafraîchir ou plusieurs espaces à repeindre. On commence par regarder le support et la finition recherchée.',
    works: [
      {title: 'Reprendre les supports', text: 'Dépose du papier peint si nécessaire, rebouchage des trous et reprise des fissures superficielles.'},
      {title: 'Peindre murs et plafonds', text: 'Choix des teintes et des finitions adaptées à la lumière et à l’usage de la pièce.'},
      {title: 'Changer de finition', text: 'Enduit ou revêtement mural selon l’état du support et l’effet recherché.'},
    ],
    steps: [
      {title: 'Choix et repérage', text: 'État des murs, surfaces à traiter et choix de finition.'},
      {title: 'Préparation', text: 'Protection des lieux, réparations superficielles, ponçage et sous-couche selon le support.'},
      {title: 'Application et contrôle', text: 'Application des couches, temps de séchage et retouches finales.'},
    ],
    duration: 'Souvent quelques jours pour une pièce. Plusieurs pièces ou des supports très abîmés demandent davantage de temps.',
    timing: 'La préparation et le séchage entre les couches font partie du planning.',
  },
  {
    title: 'Aménagement',
    quoteType: 'Aménagement et cloisons',
    description: 'Cloisons, doublages, portes et rangements sur mesure.',
    image: '/images/amenagement-rangements.webp',
    imageAlt: 'Bibliothèque et placards intégrés en chêne',
    secondImage: {src: '/images/amenagement-pose.webp', alt: 'Ajustement des placards pendant la pose', preparation: true},
    intro: 'Redistribuer une pièce, mieux utiliser un renfoncement ou intégrer du rangement. Le projet se dessine à partir des dimensions, des circulations et de ce que vous utilisez au quotidien.',
    works: [
      {title: 'Redistribuer l’espace', text: 'Création de cloisons ou de doublages, selon la configuration et la nature des murs.'},
      {title: 'Intégrer du rangement', text: 'Placards, dressing et rangements ajustés aux dimensions disponibles.'},
      {title: 'Reprendre les accès', text: 'Portes intérieures et finitions au raccord des cloisons, murs et sols.'},
    ],
    steps: [
      {title: 'Conception', text: 'Relevé des dimensions, définition des volumes et repérage des contraintes.'},
      {title: 'Préparation et pose', text: 'Préparation des supports, puis montage des cloisons ou éléments prévus.'},
      {title: 'Ajustements', text: 'Réglage des portes, raccords et vérification du fonctionnement.'},
    ],
    duration: 'De quelques jours pour une pose simple à plusieurs semaines si la distribution est revue.',
    timing: 'Le nombre de pièces et les délais des éléments sur mesure sont à prévoir en amont.',
  },
  {
    title: 'Rénovation complète',
    quoteType: 'Rénovation complète',
    description: 'Un seul interlocuteur pour coordonner tous les corps de métier.',
    image: '/images/prestation-renovation-complete.jpg',
    imageAlt: 'Pièce de vie lumineuse avec parquet et mobilier clair',
    secondImage: {src: '/images/salon-apres-travaux.webp', alt: 'Exemple d’aménagement de salon avec parquet et canapé crème'},
    intro: 'Quand plusieurs pièces ou plusieurs métiers se croisent, on définit les priorités et l’ordre du chantier dès la visite. Vous savez quels postes sont repris et lesquels sont conservés.',
    works: [
      {title: 'Repenser les pièces', text: 'Distribution, cuisine, salle de bain et aménagements selon le projet.'},
      {title: 'Coordonner les postes', text: 'Dépose, cloisons, plomberie et électricité selon le périmètre du devis.'},
      {title: 'Harmoniser les finitions', text: 'Choix des sols, des murs et des menuiseries pour garder une cohérence entre les pièces.'},
    ],
    steps: [
      {title: 'Conception et chiffrage', text: 'Visite, choix de ce qui est conservé, devis poste par poste et ordre des travaux.'},
      {title: 'Travaux coordonnés', text: 'Préparation, reprise des réseaux et des cloisons, puis pose des équipements et revêtements.'},
      {title: 'Finitions et réception', text: 'Derniers raccords, nettoyage et vérification ensemble des travaux prévus.'},
    ],
    duration: 'De plusieurs semaines à plusieurs mois selon la surface et les postes concernés.',
    timing: 'Le calendrier se précise après la visite, selon l’état du logement, l’ampleur du chantier et les fournitures.',
  },
  {
    title: 'Réparation',
    quoteType: 'Réparation',
    description: 'Reprises de murs, réglages de portes et petites réparations intérieures.',
    image: '/images/reparation-charniere.webp',
    imageAlt: 'Réglage d’une charnière de placard en chêne',
    secondImage: {src: '/images/reparation-enduit.webp', alt: 'Reprise localisée à l’enduit sur un mur intérieur'},
    intro: 'Une porte de placard qui ferme mal, un mur abîmé ou une finition à reprendre ? Décrivez le problème et joignez une photo pour préparer l’intervention.',
    works: [
      {title: 'Menuiserie intérieure', text: 'Réglage d’une porte, remplacement d’une poignée ou remise en état d’une charnière.'},
      {title: 'Murs et finitions', text: 'Rebouchage d’un trou, reprise d’un éclat et préparation pour une retouche.'},
      {title: 'Petites reprises de sol', text: 'Réfection d’une plinthe ou d’un seuil, et remplacement localisé lorsque le matériau le permet.'},
    ],
    steps: [
      {title: 'Diagnostic', text: 'Identification de la cause et des éléments à conserver ou remplacer.'},
      {title: 'Intervention', text: 'Protection de la zone et réparation selon le support et les pièces disponibles.'},
      {title: 'Vérification', text: 'Contrôle du fonctionnement et des finitions avec vous.'},
    ],
    duration: 'Une intervention simple peut prendre quelques heures.',
    timing: 'Une pièce à commander ou un temps de séchage peut nécessiter un second passage.',
  },
];
