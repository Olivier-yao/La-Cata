import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// objetsTeleAchat.js — objets inutiles à vendre en 30 secondes pour
// Émission de Télé-Achat.

export const OBJETS_TELE_ACHAT = [
  'Une pince à linge qui ne pince plus rien',
  'Un parapluie sans toile',
  'Une télécommande sans piles ni télé',
  'Un miroir qui grossit tout sauf le visage',
  'Une chaussure droite sans sa paire',
  'Un chargeur qui ne charge que les vieux téléphones à touches',
  'Un réveil qui sonne toujours une heure en retard',
  'Un savon qui ne mousse jamais',
  'Une casserole trouée mais très jolie',
  'Un porte-clés sans anneau',
  'Un stylo qui n\'écrit qu\'en majuscules',
  'Une valise à roulettes sans roulettes',
];

export const objetTeleAchatAleatoire = creerPickerAleatoire(OBJETS_TELE_ACHAT);
