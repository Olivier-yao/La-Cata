import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// motsADessiner.js — mots simples et concrets pour "Dessine et Devine" :
// contrairement à Dessine à l'Aveugle (phrases absurdes, une seule
// ligne), il faut ici des mots devinables vite, à voix haute, en
// regardant un trait se dessiner en direct.

export const MOTS_A_DESSINER = [
  'Un parapluie', 'Une pizza', 'Un vélo', 'Un chapeau', 'Un poisson',
  'Une guitare', 'Un ananas', 'Un serpent', 'Une échelle', 'Un cactus',
  'Un dauphin', 'Une valise', 'Un papillon', 'Une fusée', 'Un escargot',
  'Une chaussure', 'Un moulin à vent', 'Un cadenas', 'Une pieuvre', 'Un tambour',
  'Un flamant rose', 'Une tasse de café', 'Un hamac', 'Une lanterne', 'Un tournevis',
  'Un hippopotame', 'Une trottinette', 'Un parasol', 'Un sablier', 'Une baleine',
];

export const motADessinerAleatoire = creerPickerAleatoire(MOTS_A_DESSINER);
