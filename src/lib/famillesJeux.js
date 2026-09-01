import {
  IconChrono,
  IconGroupe as IconGroupeFamille,
  IconDetective,
  IconManetteFamille,
} from '../components/icons.jsx';

// famillesJeux.js — regroupe les mini-jeux en familles pour l'écran
// "Choisis le mini-jeu" : la seule question que se pose l'hôte à 23h,
// c'est combien de personnes se lèvent et pour combien de temps — sauf
// Manette Party, où la question est plutôt "combien de téléphones sont
// connectés".

export const FAMILLES = [
  { id: 'chrono-solo', nom: 'Chrono solo', sousTitre: 'un joueur à la fois', Icone: IconChrono, couleur: 'var(--accent-lime)' },
  { id: 'en-groupe', nom: 'En groupe', sousTitre: 'plusieurs joueurs à la fois', Icone: IconGroupeFamille, couleur: 'var(--accent-violet)' },
  { id: 'deduction-vote', nom: 'Déduction & vote', sousTitre: 'deviner, voter, trancher', Icone: IconDetective, couleur: 'var(--accent-magenta)' },
  { id: 'manette-party', nom: 'Manette Party', sousTitre: 'avec les téléphones connectés', Icone: IconManetteFamille, couleur: 'var(--accent-cyan)' },
];

export const FAMILLE_PAR_JEU = {
  'virelangue-express': 'chrono-solo',
  'calcul-eclair': 'chrono-solo',
  'memoire-flash': 'chrono-solo',
  'texte-corse': 'chrono-solo',
  'improvisation-titre': 'chrono-solo',
  'declaration': 'chrono-solo',
  'texto-sous-pression': 'chrono-solo',

  'conversation': 'en-groupe',
  'histoire-plusieurs-voix': 'en-groupe',
  'speed-dating-improbable': 'en-groupe',
  'mot-surprise': 'en-groupe',
  'categories-chrono': 'en-groupe',

  'evasion-express': 'deduction-vote',

  'duel-buzzer': 'manette-party',
  'vision-floue': 'manette-party',
  'question-eclair': 'manette-party',
  'compte-est-bon-express': 'manette-party',
  'tir-a-la-corde': 'manette-party',
  'le-trone': 'manette-party',
  'surchauffe': 'manette-party',
  'marathon-des-doigts': 'manette-party',
  'sondage-choc': 'manette-party',
  'qui-ferait-ca': 'manette-party',
  'plus-ou-moins': 'manette-party',
  'juste-prix-express': 'manette-party',
  'vote-de-la-honte': 'manette-party',
  'simon-dit-numerique': 'manette-party',
  'memoire-flash-collective': 'manette-party',
  'cadavre-exquis-numerique': 'manette-party',
  'le-traitre': 'manette-party',
  'espion-parmi-nous': 'manette-party',
  'roue-du-destin': 'manette-party',
  'proces-fictif': 'manette-party',
  'emission-tele-achat': 'manette-party',
  'coffre-fort': 'manette-party',
  'chrono-aveugle': 'manette-party',
  'chaise-musicale-numerique': 'manette-party',
  'marche-noir': 'manette-party',
  'dessine-et-devine': 'manette-party',
  'chaud-froid': 'manette-party',
  'croquis-en-direct': 'chrono-solo',
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
  'proces-fictif': '4+',
  'speed-dating-improbable': '2',
  'mot-surprise': '2+',
};

export function familleDuJeu(jeuId) {
  const id = FAMILLE_PAR_JEU[jeuId] || 'chrono-solo';
  return FAMILLES.find((f) => f.id === id);
}
