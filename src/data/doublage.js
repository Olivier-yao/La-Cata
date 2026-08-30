// doublage.js — Clips "muets" pour "Doublage Sauvage". Aucune vraie vidéo
// dans ce MVP (comme dans le kit de design) : on affiche une description
// de scène en emplacement vidéo, avec des pistes si le groupe sèche.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const CLIPS = [
  {
    description: 'Deux pingouins se regardent',
    pistes: ['Ils se disputent la dernière part.', "C'est un entretien d'embauche."],
  },
  {
    description: 'Un chat fixe une imprimante',
    pistes: ["Il négocie sa liberté.", "C'est un duel silencieux depuis 20 minutes."],
  },
  {
    description: 'Deux robots se serrent la main',
    pistes: ['Fusion d\'entreprise.', 'Ils viennent de se marier.'],
  },
  {
    description: 'Un poisson rouge fixe la caméra',
    pistes: ['Il vient de tout comprendre.', "C'est son dernier jour au travail."],
  },
  {
    description: 'Un chauffeur de gbaka regarde son compteur vide',
    pistes: ['"Anitché, y\'a drap ce soir."', '"Mon dernier client a coulé sur le prix."'],
  },
];

export const clipAleatoire = creerPickerAleatoire(CLIPS);
