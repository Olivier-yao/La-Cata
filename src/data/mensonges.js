// mensonges.js — Affirmations pour "Le Menteur". `vrai` est tiré au hasard
// à l'usage (voir menteurAleatoire) : la table ne doit jamais deviner
// l'affirmation elle-même, seulement si le joueur ment ou pas.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const AFFIRMATIONS = [
  "J'ai déjà dormi une nuit entière dans un supermarché.",
  "J'ai un jour gagné un concours de sosie sans le faire exprès.",
  "J'ai mangé un insecte en pensant que c'était une frite.",
  "J'ai été payé pour porter un costume de mascotte pendant un mariage.",
  "Je me suis perdu dans ma propre ville pendant trois heures.",
  "J'ai reçu une lettre d'amour destinée à quelqu'un d'autre et j'ai répondu.",
  "J'ai fait tomber mon téléphone dans les toilettes d'un avion.",
  "J'ai un jour parlé à une célébrité sans savoir qui elle était.",
  "J'ai gagné un trophée de danse alors que je n'avais jamais pris de cours.",
  "J'ai passé une nuit entière coincé dans un ascenseur avec un inconnu.",
  "J'ai déjà couché dehors une nuit parce que j'avais trop coulé pour rentrer en taxi.",
  "Un chauffeur de gbaka m'a laissé conduire cinq minutes parce qu'il était fatigué.",
  "J'ai déjà bognan un vieux du quartier pour un conseil, et ça m'a vraiment sauvé.",
  "J'ai gagné un pari en mangeant de l'attiéké au piment fort sans boire une goutte d'eau.",
];

const affirmationAleatoire = creerPickerAleatoire(AFFIRMATIONS);

export function menteurAleatoire() {
  const affirmation = affirmationAleatoire();
  const vrai = Math.random() < 0.5;
  return { affirmation, vrai };
}
