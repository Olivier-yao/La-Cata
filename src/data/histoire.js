import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// histoire.js — débuts d'histoire et contraintes pour Histoire à
// Plusieurs Voix.

export const DEBUTS_HISTOIRE = [
  'Ce soir-là, personne n\'avait remarqué que le gbaka roulait sans chauffeur...',
  'Tout a commencé quand la mariée a éclaté de rire pendant les vœux...',
  'Au marché, une vieille dame vendait quelque chose qu\'aucun livre n\'expliquait...',
  'Le jour où le wifi du quartier est tombé, tout le monde a paniqué...',
  'Kouassi n\'aurait jamais dû ouvrir cette valise trouvée au maquis...',
  'La panne d\'électricité a duré si longtemps que les voisins ont fini par se marier...',
];

export const CONTRAINTES_HISTOIRE = [
  'ta phrase doit contenir le mot "banane"',
  'ta phrase doit rimer avec la précédente',
  'ta phrase doit être un mensonge évident',
  'ta phrase doit contenir un chiffre',
  'ta phrase doit contenir le mot "gbaka"',
  'ta phrase doit finir par un point d\'interrogation',
  'ta phrase doit contenir le nom d\'un aliment',
  'ta phrase doit être chuchotée',
  'ta phrase doit contenir le mot "maquis"',
  'ta phrase doit sonner comme une menace ridicule',
  'ta phrase doit contenir une couleur',
  'ta phrase doit être dite avec emphase, comme une pub',
];

export const debutHistoireAleatoire = creerPickerAleatoire(DEBUTS_HISTOIRE);
export const contrainteHistoireAleatoire = creerPickerAleatoire(CONTRAINTES_HISTOIRE);
