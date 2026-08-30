import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// themesAlphabet.js — thèmes pour Alphabet Express : un mot par lettre
// sur ce thème, jusqu'au blocage.

export const THEMES_ALPHABET = [
  'Animaux',
  'Métiers',
  'Objets de cuisine',
  'Trucs qu\'on trouve au maquis',
  'Prénoms',
  'Pays',
  'Marques',
  'Nourriture',
  'Films',
  'Villes de Côte d\'Ivoire',
  'Insultes gentilles',
  'Objets qui font du bruit',
  'Choses qu\'on trouve dans un sac à main',
  'Sports',
  'Trucs qui piquent',
  'Fruits',
  'Marques de téléphone',
  'Objets qu\'on perd souvent',
  'Plats africains',
  'Instruments de musique',
  'Couleurs',
  'Moyens de transport',
  'Insectes',
  'Objets scolaires',
  'Vêtements',
  'Boissons',
];

export const themeAlphabetAleatoire = creerPickerAleatoire(THEMES_ALPHABET);

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const lettreAleatoire = creerPickerAleatoire(ALPHABET);
