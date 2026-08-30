import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// questionsSondage.js — questions du Sondage Prédictif : chacun vote en
// secret pour un membre du groupe.

export const QUESTIONS_SONDAGE = [
  'Qui va se marier en premier ?',
  'Qui va s\'endormir en premier ce soir ?',
  'Qui est le plus susceptible d\'être en retard à son propre mariage ?',
  'Qui craquerait en premier dans un jeu de Sans Rire ?',
  'Qui a le plus de chances de devenir riche ?',
  'Qui va renverser un verre avant la fin de la soirée ?',
  'Qui est le plus susceptible de partir sans dire au revoir ?',
  'Qui gagnerait un combat de coq entre tous les joueurs ?',
  'Qui est le plus susceptible d\'être ghosté demain ?',
  'Qui survivrait le plus longtemps dans un film de zombies ?',
  'Qui va le plus enjailler ce soir ?',
  'Qui est le plus susceptible d\'oublier son téléphone quelque part ?',
  'Qui deviendrait président si tout le monde ici devait voter ?',
  'Qui est le plus susceptible de pleurer devant un film Disney ?',
  'Qui va se marier en premier parmi le groupe ?',
  'Qui serait le pire pilote d\'avion ?',
  'Qui a le plus de chances de devenir célèbre un jour ?',
  'Qui oublierait son propre anniversaire ?',
  'Qui survivrait le plus longtemps seul dans la nature ?',
  'Qui serait capable de manger un piment entier sans grimacer ?',
  'Qui deviendrait le meilleur menteur professionnel ?',
  'Qui perdrait ses clés le plus souvent ?',
  'Qui serait le patron le plus strict du groupe ?',
  'Qui craquerait en premier dans un jeu du silence ?',
  'Qui serait capable de vivre sans téléphone une semaine complète ?',
  'Qui deviendrait riche en premier ?',
  'Qui serait le plus susceptible de pleurer devant un film ?',
  'Qui arriverait en retard à son propre mariage ?',
  'Qui serait le meilleur pour garder un secret ?',
  'Qui deviendrait végétarien du jour au lendemain ?',
  'Qui serait capable de danser devant tout le monde sans complexe ?',
  'Qui aurait le plus d\'enfants un jour ?',
  'Qui serait le premier à abandonner en cas de randonnée difficile ?',
];

export const questionSondageAleatoire = creerPickerAleatoire(QUESTIONS_SONDAGE);
