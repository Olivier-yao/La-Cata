// lieuxEspion.js — lieux secrets pour "Espion Parmi Nous" : tout le monde
// reçoit le même lieu sur son téléphone SAUF l'espion, qui doit deviner de
// quoi parlent les autres sans se faire démasquer par ses questions.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const LIEUX_ESPION = [
  'Un maquis un vendredi soir',
  'Un mariage traditionnel',
  'Un salon de coiffure',
  'Un marché aux légumes',
  'Un aéroport un jour de retard',
  'Une salle de sport',
  'Un examen d\'école',
  'Un hôpital aux urgences',
  'Un studio de tournage',
  'Un terrain de football amateur',
  'Un bureau un lundi matin',
  'Une église un dimanche',
  'Un taxi collectif (wôrô-wôrô)',
  'Un anniversaire d\'enfant',
  'Un commissariat de police',
  'Un buffet de mariage',

  'Une salle d\'attente chez le médecin',
  'Un bus scolaire',
  'Une plage un dimanche',
  'Un supermarché la veille des fêtes',
  'Une station-service',
  'Un centre commercial un samedi',
  'Un atelier de couture',
  'Un garage de mécanique',
  'Une piscine publique',
  'Un studio de danse',
  'Un cybercafé',
  'Une pharmacie',
  'Un chantier de construction',
  'Une salle de classe un jour d\'examen',
  'Un marché de nuit',
  'Une gare routière',
  'Un stade un jour de match',
  'Un salon de beauté',
  'Une boîte de nuit',
  'Un atelier de mécanique auto',
  'Une bibliothèque',
  'Un camp de vacances',
  'Un bureau de vote',
  'Une cérémonie de remise de diplômes',
];

export const lieuEspionAleatoire = creerPickerAleatoire(LIEUX_ESPION);
