import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// declarations.js — types de déclarations pour "Déclaration". `{cible}`
// est remplacé par le nom du joueur désigné pour la recevoir.

export const DECLARATIONS = [
  { type: 'Déclaration d\'amour', consigne: 'Déclare ta flamme à {cible} comme si c\'était le grand amour de ta vie.' },
  { type: 'Déclaration de guerre', consigne: 'Déclare la guerre à {cible} pour une raison totalement absurde.' },
  { type: 'Déclaration de rupture', consigne: 'Annonce à {cible} que c\'est fini entre vous, le plus dramatiquement possible.' },
  { type: 'Aveu solennel', consigne: 'Avoue à {cible} un secret inventé, le plus embarrassant possible.' },
  { type: 'Déclaration de candidature', consigne: 'Explique à {cible} pourquoi tu devrais être élu·e président·e du groupe.' },
  { type: 'Discours d\'adieu', consigne: 'Fais tes adieux à {cible} comme si tu partais à l\'autre bout du monde pour toujours.' },
  { type: 'Déclaration sous serment', consigne: 'Jure à {cible}, la main sur le cœur, quelque chose de totalement improbable.' },
  { type: 'Déclaration de dette', consigne: 'Explique à {cible} pourquoi tu lui dois de l\'argent depuis une histoire inventée.' },
  { type: 'Déclaration officielle', consigne: 'Annonce à {cible}, ton comme un communiqué de presse, une nouvelle qui va bouleverser sa vie.' },
  { type: 'Déclaration de jalousie', consigne: 'Avoue à {cible} à quel point tu es jaloux·se de sa vie, avec le plus de mauvaise foi possible.' },
  { type: 'Déclaration de fan', consigne: 'Déclare à {cible} que tu es son plus grand fan depuis toujours et explique pourquoi.' },
  { type: 'Déclaration de pardon', consigne: 'Demande pardon à {cible} pour quelque chose que tu viens d\'inventer sur le moment.' },
  { type: 'Déclaration de défi', consigne: 'Défie {cible} en duel pour une raison d\'honneur totalement inventée.' },
  { type: 'Déclaration testamentaire', consigne: 'Annonce à {cible} ce que tu comptes lui léguer dans ton testament, et pourquoi.' },
];

export const declarationAleatoire = creerPickerAleatoire(DECLARATIONS);
