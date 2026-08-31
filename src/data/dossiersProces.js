import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// dossiersProces.js — dossiers complets pour Procès Fictif (version
// Manette Party) : une accusation, une preuve publique de chaque côté
// (affichées d'entrée), et trois preuves privées que l'avocat de la
// défense peut révéler à tout moment pendant la plaidoirie (irréversible).

export const DOSSIERS_PROCES = [
  {
    accusation: 'A mangé la dernière part de pizza en cachette et a menti à ce sujet pendant six mois.',
    preuveAccusation: 'Des miettes retrouvées sur son pull.',
    preuveDefense: 'Il/elle est allergique au fromage.',
    preuvesDefensePrivees: [
      'Il/elle dormait à 22h, sa mère confirme.',
      'La caméra du frigo était débranchée ce soir-là.',
      'Un autre invité avait déjà avoué la veille.',
    ],
  },
  {
    accusation: 'A pris le dernier gbaka en poussant une mamie du coude.',
    preuveAccusation: 'Trois témoins l\'ont vu·e courir vers l\'arrêt.',
    preuveDefense: 'Il/elle est arrivé·e cinq minutes après le gbaka.',
    preuvesDefensePrivees: [
      'La mamie en question dit ne se souvenir de rien.',
      'Il/elle a un genou fragile, courir lui est impossible.',
      'La vidéo de l\'arrêt montre quelqu\'un d\'autre.',
    ],
  },
  {
    accusation: 'A liké une story vieille de deux ans par erreur et a paniqué pendant trois jours.',
    preuveAccusation: 'Le like est daté et horodaté, impossible à nier.',
    preuveDefense: 'Son téléphone a un bug de likes fantômes connu.',
    preuvesDefensePrivees: [
      'Trois autres personnes ont eu le même bug ce mois-ci.',
      'Il/elle n\'a même pas Internet ce jour-là.',
      'Le compte a été piraté la semaine d\'avant.',
    ],
  },
  {
    accusation: 'A fait semblant de ne pas voir un ami dans la rue pour éviter de discuter.',
    preuveAccusation: 'L\'ami affirme avoir croisé son regard.',
    preuveDefense: 'Il/elle ne voit rien sans ses lunettes, oubliées ce jour-là.',
    preuvesDefensePrivees: [
      'Un opticien confirme sa mauvaise vue.',
      'Il/elle était au téléphone en urgence.',
      'La rue était bondée, difficile de reconnaître qui que ce soit.',
    ],
  },
  {
    accusation: 'A renvoyé un cadeau reçu en le déguisant en cadeau pour quelqu\'un d\'autre.',
    preuveAccusation: 'L\'emballage d\'origine a été retrouvé, mal recollé.',
    preuveDefense: 'Le cadeau était en double, un malentendu du magasin.',
    preuvesDefensePrivees: [
      'Le ticket de caisse prouve un achat en double.',
      'La personne visée avait déjà ce même objet.',
      'Il/elle avait prévenu le donneur original à l\'avance.',
    ],
  },
  {
    accusation: 'A gardé la monnaie du taxi sans le dire aux autres passagers.',
    preuveAccusation: 'Le chauffeur confirme avoir rendu la monnaie à lui/elle seul·e.',
    preuveDefense: 'Il/elle a payé plus que sa part au départ.',
    preuvesDefensePrivees: [
      'Un reçu montre qu\'il/elle a payé pour deux.',
      'Les autres passagers n\'ont jamais rien demandé.',
      'La monnaie a été reversée en boissons pour tout le monde.',
    ],
  },
  {
    accusation: 'A fait croire à toute la famille qu\'il/elle parlait couramment l\'anglais.',
    preuveAccusation: 'Une vidéo le/la montre dire "how do you do" en boucle.',
    preuveDefense: 'Il/elle a un certificat de niveau intermédiaire, pas menteur total.',
    preuvesDefensePrivees: [
      'Le certificat date d\'il y a dix ans, jamais mis à jour.',
      'Il/elle a suivi trois mois de cours en ligne.',
      'La vidéo était clairement une blague entre amis.',
    ],
  },
  {
    accusation: 'A pris la dernière bière en laissant croire que c\'était un jus.',
    preuveAccusation: 'La canette vide a été retrouvée cachée sous le canapé.',
    preuveDefense: 'Il/elle ne boit jamais d\'alcool, incohérent avec l\'accusation.',
    preuvesDefensePrivees: [
      'Trois témoins confirment qu\'il/elle est non-buveur·se.',
      'La canette appartient à quelqu\'un d\'autre, empreintes différentes.',
      'Il/elle était introuvable au moment des faits.',
    ],
  },
  {
    accusation: 'A dormi pendant tout un film puis a donné son avis dessus.',
    preuveAccusation: 'Des ronflements ont été enregistrés pendant la séance.',
    preuveDefense: 'Il/elle a résumé la fin du film sans se tromper.',
    preuvesDefensePrivees: [
      'Il/elle avait déjà vu le film la semaine d\'avant.',
      'Les ronflements venaient du chien, pas de lui/elle.',
      'Il/elle fermait juste les yeux pour "mieux ressentir" le film.',
    ],
  },
  {
    accusation: 'A dragué au maquis en se faisant passer pour quelqu\'un d\'autre.',
    preuveAccusation: 'Un message envoyé sous un faux prénom a été retrouvé.',
    preuveDefense: 'C\'était son surnom d\'enfance, pas une fausse identité.',
    preuvesDefensePrivees: [
      'Toute la famille confirme utiliser ce surnom depuis toujours.',
      'La personne draguée connaissait déjà son vrai prénom.',
      'Le message était une blague entre amis, pas sérieux.',
    ],
  },
];

export const dossierProcesAleatoire = creerPickerAleatoire(DOSSIERS_PROCES);
