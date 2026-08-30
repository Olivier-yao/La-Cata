import { genererPosesStatueSurprise } from './generators.js';

// poses.js — Poses imposées pour "Statue Surprise". `niveau` monte avec la
// difficulté : 1 = facile/drôle (début du tournoi), 2 = ça tire déjà un
// peu, 3 = inconfortable, réservé aux dernières manches quand il ne reste
// presque plus personne.
//
// Les poses nommées ci-dessous sont écrites à la main (une identité, une
// blague) ; elles sont complétées par 250 poses générées par combinatoire
// (voir generators.js) pour ne jamais retomber sur la même consigne deux
// soirées de suite.

const POSES_NOMMEES_1 = [
  { titre: 'Le Penseur', description: 'assis, poing sous le menton, regard grave' },
  { titre: "L'Aigle Royal", description: 'bras écartés, un pied levé, fier' },
  { titre: 'Le Vainqueur', description: 'poings levés, sourire figé' },
  { titre: 'La Star du Tapis Rouge', description: 'main sur la hanche, regard au loin' },
  { titre: 'Le Suspect', description: 'doigt pointé, sourcil levé' },
  { titre: 'Le Bognan', description: 'incliné respectueusement, main sur le cœur, façon salut à un vieux du quartier' },
];

const POSES_NOMMEES_2 = [
  { titre: 'Le Surfeur', description: 'genoux pliés, bras tendus comme sur une planche' },
  { titre: "Le Chat qui S'étire", description: 'dos rond, bras tendus vers le sol' },
  { titre: 'Le Flamant Rose', description: 'sur une jambe, l\'autre repliée, bras en équilibre' },
  { titre: 'La Planche Inclinée', description: 'penché en avant à 45°, bras tendus devant' },
  { titre: 'Le Gardien de But', description: 'accroupi, bras écartés, prêt à plonger' },
];

const POSES_NOMMEES_3 = [
  { titre: 'Le Silence Total', description: 'bouche grande ouverte, sans émettre un seul son, même si ça chatouille' },
  { titre: "L'Équilibriste du Vide", description: 'sur une jambe, les yeux fermés, bras en croix, pas un pouce de mouvement' },
  { titre: 'Le Fakir Fatigué', description: 'accroupi le plus bas possible, un doigt sur le nez, sans vaciller' },
  { titre: 'La Statue Grimaçante', description: 'la pire grimace possible tenue sans un cillement' },
  { titre: 'Le Funambule Immobile', description: 'un pied devant l\'autre parfaitement aligné, bras en balancier, ne pas tomber' },
];

const posesGenerees = genererPosesStatueSurprise(250);
const genereesParNiveau = { 1: [], 2: [], 3: [] };
posesGenerees.forEach((p) => {
  genereesParNiveau[p.niveau].push({ titre: p.texte, description: '' });
});

export const POSES_NIVEAU_1 = [...POSES_NOMMEES_1, ...genereesParNiveau[1]];
export const POSES_NIVEAU_2 = [...POSES_NOMMEES_2, ...genereesParNiveau[2]];
export const POSES_NIVEAU_3 = [...POSES_NOMMEES_3, ...genereesParNiveau[3]];

const NIVEAUX = { 1: POSES_NIVEAU_1, 2: POSES_NIVEAU_2, 3: POSES_NIVEAU_3 };

export function poseParNiveau(niveau) {
  const liste = NIVEAUX[niveau] || POSES_NIVEAU_1;
  return liste[Math.floor(Math.random() * liste.length)];
}
