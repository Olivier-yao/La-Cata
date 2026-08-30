import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// personnagesSpeedDating.js — personnages absurdes incarnés en duo pour
// Speed Dating Improbable. L'app forme les paires au hasard.

export const PERSONNAGES_SPEED_DATING = [
  'Astronaute au chômage',
  'Diseuse de bonne aventure sceptique d\'elle-même',
  'Ex-champion de danse qui a arrêté de danser',
  'Vendeur de crédit qui n\'y croit plus',
  'Chauffeur de gbaka philosophe',
  'Influenceuse qui déteste les réseaux sociaux',
  'Ancien roi déchu d\'un pays qui n\'existe plus',
  'Chasseur de fantômes au chômage technique',
  'Coach de vie qui n\'arrive pas à gérer sa propre vie',
  'Cuisinier qui ne mange que froid',
  'Pêcheur qui a le mal de mer',
  'Détective qui a perdu ses lunettes',
  'Ex-pirate reconverti en comptable',
  'Chasseur de fantômes qui a peur du noir',
  'Chef étoilé qui ne sait faire que des pâtes',
  'Détective privé qui perd toujours ses affaires',
  'Super-héros à la retraite anticipée',
  'Vendeur de glaces en plein hiver',
  'Ancien roi déchu d\'un pays imaginaire',
  'Dresseur de dragons allergique aux écailles',
  'Voyant qui n\'a jamais rien prédit correctement',
  'Cascadeur qui a peur des hauteurs',
  'Chanteur d\'opéra enroué depuis dix ans',
  'Espion qui oublie toujours sa couverture',
  'Inventeur dont toutes les inventions explosent',
  'Guide touristique qui se perd tout le temps',
  'Cuisinier végétarien obsédé par la viande',
  'Champion de boxe qui déteste la violence',
  'Magicien dont les tours ne fonctionnent jamais',
  'Pompier qui a le vertige',
];

export const personnageSpeedDatingAleatoire = creerPickerAleatoire(PERSONNAGES_SPEED_DATING);
