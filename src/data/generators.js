import { melanger } from '../lib/melanger.js';

// generators.js — Génération procédurale de contenu "mécanique" pour La Cata.
//
// Ces deux catégories se construisent par combinaison plutôt que par
// écriture manuelle élément par élément :
// - Catégories Chrono  = catégorie × lettre
// - Mots Surprise      = banques de mots thématiques mélangées
//
// Les catégories qui demandent une vraie créativité (virelangues, textes
// corsés, scénarios de conversation...) restent écrites à la main dans
// virelangues.js, textesCorses.js, conversations.js, etc. — la
// combinatoire ne peut pas remplacer l'humour ou la construction d'une
// énigme.

// ---------------------------------------------------------------------
// Générateur 1 : Catégories Chrono
// ---------------------------------------------------------------------

const CATEGORIES_BASE = [
  'Animaux', 'Métiers', 'Objets de cuisine', 'Nourriture ivoirienne', 'Prénoms',
  'Pays', 'Fruits', 'Marques', 'Villes', 'Objets scolaires', 'Sports',
  'Instruments de musique', 'Couleurs', 'Moyens de transport', 'Insectes',
  'Films', 'Vêtements', 'Boissons', "Objets qu'on trouve au maquis",
  'Métiers manuels', 'Légumes', 'Réseaux sociaux', 'Célébrités',
  'Objets électroniques', 'Plats du monde', 'Objets de salle de bain',
  'Jeux vidéo', 'Desserts', 'Fleurs', 'Poissons', 'Oiseaux', 'Objets de bureau',
  'Marques de voiture', 'Séries télé', 'Chanteurs',
];

// Lettres volontairement limitées à celles qui restent jouables pour
// n'importe quelle catégorie ci-dessus (on évite K, Q, W, X, Y, Z qui
// bloquent trop souvent en français).
const LETTRES_UTILISABLES = 'ABCDEFGHIJLMNOPRSTV'.split('');

export function genererCategoriesChrono(n = 250) {
  const combos = [];
  for (const categorie of CATEGORIES_BASE) {
    for (const lettre of LETTRES_UTILISABLES) {
      combos.push({ categorie, lettre });
    }
  }
  return melanger(combos).slice(0, n);
}

// ---------------------------------------------------------------------
// Générateur 2 : Mots Surprise
// ---------------------------------------------------------------------

const MOTS_QUOTIDIEN = [
  'café', 'thé', 'parapluie', 'télécommande', 'réveil', 'chaussure', 'valise',
  'escalier', 'ascenseur', 'fenêtre', 'rideau', 'tapis', 'coussin', 'matelas',
  'oreiller', 'serviette', 'savon', 'brosse', 'peigne', 'miroir', 'balai',
  'seau', 'éponge', 'poubelle', 'cintre', 'tiroir', 'placard', 'étagère',
  'horloge', 'calendrier', 'stylo', 'cahier', 'gomme', 'règle', 'agrafeuse',
  'classeur', 'clavier', 'souris', 'écran', 'chargeur', 'batterie', 'ampoule',
  'interrupteur', 'prise', 'câble', 'antenne', 'télévision', 'radio',
  'haut-parleur', 'micro',
];

const MOTS_ABSTRAITS = [
  'nostalgie', 'curiosité', 'patience', 'générosité', 'tendresse',
  'mélancolie', 'espièglerie', 'étincelle', 'silence', 'équilibre',
  'solitude', 'aventure', 'souvenir', 'frisson', 'bousculade', 'chatouille',
  'gratitude', 'sincérité', 'audace', 'humilité', 'fierté', 'jalousie',
  'tristesse', 'joie', 'colère', 'surprise', 'confiance', 'doute', 'espoir',
  'courage', 'paresse', 'discipline', 'liberté', 'justice', 'vérité',
  'mensonge', 'secret', 'mystère', 'destin', 'hasard', 'chance', 'malchance',
  'réussite', 'échec', 'ambition', 'humour', 'sagesse', 'folie', 'timidité',
  'assurance',
];

const MOTS_NOUCHI = [
  'gbaka', 'maquis', 'enjaillé', 'coulé', 'gbairai', 'bognan', 'go', 'môgô',
  'chap-chap', 'wôrô-wôrô', 'choco', 'deba', 'gnata', 'kpakpato', 'tchapalo',
  'faforo', 'senseur', 'base', 'teuteu', 'blocus', 'sotra', 'wari', 'article',
  'atalaku', 'foule', 'môgô-là',
];

const MOTS_ANIMAUX = [
  'éléphant', 'girafe', 'hippopotame', 'crocodile', 'perroquet', 'tortue',
  'singe', 'lion', 'zèbre', 'antilope', 'hyène', 'chacal', 'mangouste',
  'varan', 'caméléon', 'mille-pattes', 'scorpion', 'termite', 'criquet',
  'libellule', 'papillon', 'escargot', 'hérisson', 'chauve-souris',
  'pangolin', 'phacochère', 'buffle', 'gazelle', 'vautour', 'calao',
  'pintade', 'canard', 'dindon', 'mouton', 'chèvre', 'âne', 'cheval',
  'poule', 'coq', 'pigeon',
];

const MOTS_NOURRITURE = [
  'attiéké', 'garba', 'alloco', 'kedjenou', 'foutou', 'riz', 'igname',
  'banane plantain', 'manioc', 'arachide', 'piment', 'gombo', 'aubergine',
  'tomate', 'oignon', 'ail', 'gingembre', 'citron', 'mangue', 'papaye',
  'ananas', 'orange', 'pastèque', 'avocat', 'noix de coco', 'cacahuète',
  'maïs', 'haricot', 'poisson braisé', 'poulet braisé', 'brochette',
  'beignet', 'gâteau', 'chocolat', 'glace', 'yaourt', 'fromage', 'pain',
  'confiture', 'miel',
];

const MOTS_NATURE = [
  'soleil', 'lune', 'étoile', 'nuage', 'pluie', 'orage', 'vent',
  'arc-en-ciel', 'rivière', 'océan', 'montagne', 'forêt', 'désert',
  'savane', 'lagune', 'cascade', 'volcan', 'île', 'plage', 'sable',
  'rocher', 'caillou', 'feuille', 'branche', 'racine', 'fleur', 'herbe',
  'brousse', 'aube', 'crépuscule',
];

const MOTS_DIVERS = [
  'trombone', 'agenda', 'boussole', 'lanterne', 'hamac', 'tabouret',
  'ventilateur', 'cadenas', 'robinet', 'tondeuse', 'échelle', 'balançoire',
  'brouette', 'cerf-volant', 'toboggan',
];

export function genererMotsSurprise(n = 250) {
  const banque = [
    ...MOTS_QUOTIDIEN, ...MOTS_ABSTRAITS, ...MOTS_NOUCHI,
    ...MOTS_ANIMAUX, ...MOTS_NOURRITURE, ...MOTS_NATURE, ...MOTS_DIVERS,
  ];
  const banqueUnique = [...new Set(banque)];
  return melanger(banqueUnique).slice(0, n);
}

export default {
  genererCategoriesChrono,
  genererMotsSurprise,
};
