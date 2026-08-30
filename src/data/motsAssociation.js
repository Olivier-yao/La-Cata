import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// motsAssociation.js — mots de départ pour Association d'Idées en
// Chaîne (chaque joueur dit un mot lié au précédent).

export const MOTS_ASSOCIATION = [
  'Soleil', 'Gbaka', 'Café', 'Téléphone', 'Maquis', 'Musique',
  'Plage', 'Feu', 'Amour', 'Voiture', 'Pluie', 'Danse', 'Argent',
  'Attiéké', 'Nuit', 'Football', 'École', 'Marché', 'Enjaillement',
  'Fête', 'Voyage', 'Chaussure', 'Réseau', 'Bognan',
  'Livre', 'Montagne', 'Chocolat', 'Jardin', 'Ordinateur', 'Cuisine',
  'Océan', 'Vélo', 'Photo', 'Chien', 'Rêve',
];

export const motAssociationAleatoire = creerPickerAleatoire(MOTS_ASSOCIATION);
