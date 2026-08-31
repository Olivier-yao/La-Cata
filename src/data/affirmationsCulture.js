// affirmationsCulture.js — vrai/faux de culture générale pour "Vrai ou
// Bidon Express" (buzzer). Contrairement au Menteur, ce ne sont pas des
// anecdotes personnelles : le fait est objectivement vrai ou faux, fixé
// une fois pour toutes.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const AFFIRMATIONS_CULTURE = [
  { texte: 'Le miel ne se périme jamais.', vrai: true },
  { texte: "Une autruche enfouit sa tête dans le sable quand elle a peur.", vrai: false },
  { texte: 'Les poules peuvent voler sur de courtes distances.', vrai: true },
  { texte: "On n'utilise que 10% de notre cerveau.", vrai: false },
  { texte: 'Le cœur humain bat plus de 100 000 fois par jour.', vrai: true },
  { texte: 'Les chauves-souris sont aveugles.', vrai: false },
  { texte: "Un escargot peut dormir jusqu'à trois ans.", vrai: true },
  { texte: 'Les humains et les girafes ont le même nombre de vertèbres dans le cou.', vrai: true },
  { texte: 'La foudre ne frappe jamais deux fois au même endroit.', vrai: false },
  { texte: 'Le Sahara était une région verte et fertile il y a quelques milliers d\'années.', vrai: true },
  { texte: "L'eau chaude gèle toujours plus lentement que l'eau froide.", vrai: false },
  { texte: 'Les requins existaient déjà avant les arbres.', vrai: true },
  { texte: 'On avale en moyenne huit araignées par an en dormant.', vrai: false },
  { texte: 'Il existe plus d\'étoiles dans l\'univers observable que de grains de sable sur toutes les plages de la Terre.', vrai: true },
  { texte: 'Napoléon était anormalement petit pour son époque.', vrai: false },
  { texte: "Les dauphins ont chacun un nom propre, un sifflement unique.", vrai: true },
  { texte: 'Il pleut des diamants sur certaines planètes du système solaire.', vrai: true },
  { texte: 'Les flamants roses naissent roses.', vrai: false },
];

export const affirmationCultureAleatoire = creerPickerAleatoire(AFFIRMATIONS_CULTURE);
