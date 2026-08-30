import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// motsMemoireGroupe.js — mots ajoutés un par un à la liste collective de
// Mémoire de Groupe.

export const MOTS_MEMOIRE_GROUPE = [
  'Ananas', 'Gbaka', 'Parapluie', 'Attiéké', 'Girafe', 'Maquis',
  'Trottinette', 'Bognan', 'Casquette', 'Enjaillement', 'Tambour',
  'Coulé', 'Fourchette', 'Gbairai', 'Sandale', 'Poivron', 'Guitare',
  'Nouchi', 'Bicyclette', 'Igname', 'Serpent', 'Lunettes', 'Plantain',
  'Aloko', 'Chaussette', 'Perroquet', 'Motocross', 'Attaké',
  'Parasol', 'Panier',
];

export const motMemoireAleatoire = creerPickerAleatoire(MOTS_MEMOIRE_GROUPE);
