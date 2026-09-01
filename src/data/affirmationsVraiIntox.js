import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// affirmationsVraiIntox.js — affirmations à trancher pour "Vrai ou
// Intox" : vote simultané sur téléphone, contrairement à Question Éclair
// (buzzer puis QCM individuel) ou Le Menteur (juger si un joueur ment).

export const AFFIRMATIONS_VRAI_INTOX = [
  { affirmation: 'Un jour sur Vénus dure plus longtemps qu\'une année sur Vénus.', vrai: true },
  { affirmation: 'Les autruches enfouissent leur tête dans le sable quand elles ont peur.', vrai: false },
  { affirmation: 'Le miel ne se périme jamais.', vrai: true },
  { affirmation: 'Les humains n\'utilisent que 10% de leur cerveau.', vrai: false },
  { affirmation: 'Les bananes sont classées comme des baies, botaniquement.', vrai: true },
  { affirmation: 'La Grande Muraille de Chine est visible à l\'œil nu depuis la Lune.', vrai: false },
  { affirmation: 'Les requins existaient déjà avant les arbres.', vrai: true },
  { affirmation: 'On avale en moyenne huit araignées par an en dormant.', vrai: false },
  { affirmation: 'Un escargot peut dormir pendant trois ans.', vrai: true },
  { affirmation: 'Les poules ont plus de dents que les vaches.', vrai: false },
  { affirmation: 'Le cœur d\'une crevette se trouve dans sa tête.', vrai: true },
  { affirmation: 'Les flamants roses naissent avec leurs plumes déjà roses.', vrai: false },
  { affirmation: 'Il pleut des diamants sur Neptune et Uranus.', vrai: true },
  { affirmation: 'Napoléon Bonaparte était anormalement petit pour son époque.', vrai: false },
  { affirmation: 'Les pieuvres ont trois cœurs.', vrai: true },
  { affirmation: 'Le Sahara a déjà été une forêt tropicale humide.', vrai: true },
  { affirmation: 'Les chats domestiques dorment moins de la moitié de leur vie.', vrai: false },
  { affirmation: 'Le miel de certaines régions peut être légèrement hallucinogène.', vrai: true },
  { affirmation: 'La tour Eiffel grandit un peu l\'été à cause de la chaleur.', vrai: true },
  { affirmation: 'Les dauphins dorment avec un seul œil ouvert et la moitié du cerveau éveillée.', vrai: true },
];

export const affirmationVraiIntoxAleatoire = creerPickerAleatoire(AFFIRMATIONS_VRAI_INTOX);
