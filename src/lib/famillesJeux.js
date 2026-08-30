import {
  IconChrono,
  IconGroupe as IconGroupeFamille,
  IconDetective,
  IconStatue,
} from '../components/icons.jsx';

// famillesJeux.js — regroupe les 28 mini-jeux en 4 familles pour l'écran
// "Choisis le mini-jeu" : la seule question que se pose l'hôte à 23h,
// c'est combien de personnes se lèvent et pour combien de temps.

export const FAMILLES = [
  { id: 'chrono-solo', nom: 'Chrono solo', sousTitre: 'un joueur à la fois', Icone: IconChrono, couleur: 'var(--accent-lime)' },
  { id: 'en-groupe', nom: 'En groupe', sousTitre: 'plusieurs joueurs à la fois', Icone: IconGroupeFamille, couleur: 'var(--accent-violet)' },
  { id: 'deduction-vote', nom: 'Déduction & vote', sousTitre: 'deviner, voter, trancher', Icone: IconDetective, couleur: 'var(--accent-magenta)' },
  { id: 'corps-mouvement', nom: 'Corps & mouvement', sousTitre: 'ça se lève, ça bouge', Icone: IconStatue, couleur: 'var(--accent-cyan)' },
];

export const FAMILLE_PAR_JEU = {
  'virelangue-express': 'chrono-solo',
  'accent-surprise': 'chrono-solo',
  'defi-chrono-absurde': 'chrono-solo',
  'calcul-eclair': 'chrono-solo',
  'alphabet-express': 'chrono-solo',
  'emission-tele-achat': 'chrono-solo',
  'chant-impose': 'chrono-solo',
  'memoire-flash': 'chrono-solo',
  'texte-corse': 'chrono-solo',
  'improvisation-titre': 'chrono-solo',
  'declaration': 'chrono-solo',
  'texto-sous-pression': 'chrono-solo',

  'conversation': 'en-groupe',
  'improvisation': 'en-groupe',
  'histoire-plusieurs-voix': 'en-groupe',
  'proces-fictif': 'en-groupe',
  'speed-dating-improbable': 'en-groupe',
  'mot-surprise': 'en-groupe',
  'memoire-groupe': 'en-groupe',
  'categories-chrono': 'en-groupe',
  'association-chaine': 'en-groupe',

  'le-menteur': 'deduction-vote',
  'sondage-predictif': 'deduction-vote',
  'le-detective': 'deduction-vote',
  'evasion-express': 'deduction-vote',
  'sans-rire': 'deduction-vote',

  'statue-surprise': 'corps-mouvement',
  'dessine-a-laveugle': 'corps-mouvement',
  'devine-le-bruit': 'corps-mouvement',
  'doublage-sauvage': 'corps-mouvement',
};

// Pastille "N+" affichée sur la carte des jeux en groupe qui imposent un
// minimum au-delà des 2 joueurs déjà exigés partout ailleurs, ou un
// nombre exact (Speed Dating ne fait jamais jouer que 2 personnes, même
// à 8 autour de la table). Absent de cette liste = pas de pastille, juste
// le pictogramme "groupe".
export const BADGE_JOUEURS = {
  'conversation': '2+',
  'improvisation': '3+',
  'histoire-plusieurs-voix': '3+',
  'proces-fictif': '3+',
  'speed-dating-improbable': '2',
  'mot-surprise': '2+',
  'memoire-groupe': '2+',
  'le-detective': '3+',
};

export function familleDuJeu(jeuId) {
  const id = FAMILLE_PAR_JEU[jeuId] || 'chrono-solo';
  return FAMILLES.find((f) => f.id === id);
}
