import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// accusationsProces.js — faits absurdes dont un joueur est "accusé"
// pour Procès Fictif.

export const ACCUSATIONS_PROCES = [
  'A mangé la dernière part de pizza en cachette et a menti à ce sujet pendant six mois.',
  'A pris le dernier gbaka en poussant une mamie du coude.',
  'A liké une story vieille de deux ans par erreur et a paniqué pendant trois jours.',
  'A fait semblant de ne pas voir un ami dans la rue pour éviter de discuter.',
  'A renvoyé un cadeau reçu en le déguisant en cadeau pour quelqu\'un d\'autre.',
  'A gardé la monnaie du taxi sans le dire aux autres passagers.',
  'A fait croire à toute la famille qu\'il/elle parlait couramment l\'anglais.',
  'A pris la dernière bière en laissant croire que c\'était un jus.',
  'A dormi pendant tout un film puis a donné son avis dessus.',
  'A dragué au maquis en se faisant passer pour quelqu\'un d\'autre.',
];

export const accusationProcesAleatoire = creerPickerAleatoire(ACCUSATIONS_PROCES);
