import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// enigmes.js — mini énigmes collectives pour Évasion Express. Chaque
// indice se débloque progressivement ; l'équipe propose une solution
// avant la fin du chrono.

export const ENIGMES = [
  {
    titre: 'La boîte fermée',
    indices: [
      'Je n\'ai ni serrure ni clé, pourtant je garde un secret.',
      'Plus on me remplit, plus je deviens légère.',
      'On me trouve souvent sur une lettre avant qu\'elle ne parte.',
    ],
    solution: 'Une enveloppe',
  },
  {
    titre: 'Le voyageur muet',
    indices: [
      'Je traverse les frontières sans jamais montrer de passeport.',
      'On me tamponne parfois, mais je ne ressens rien.',
      'Sans moi, ta lettre resterait bloquée au bureau de poste.',
    ],
    solution: 'Un timbre',
  },
  {
    titre: 'Toujours devant, jamais derrière',
    indices: [
      'Je précède toujours ce qui va suivre.',
      'On me consulte avant de commencer un long trajet.',
      'Sans moi, difficile de savoir combien de kilomètres il reste.',
    ],
    solution: 'Un panneau',
  },
  {
    titre: 'Le gardien silencieux',
    indices: [
      'Je reste debout toute la nuit sans jamais dormir.',
      'On m\'allume quand la nuit tombe, on m\'oublie le jour.',
      'Les papillons de nuit m\'adorent.',
    ],
    solution: 'Un lampadaire',
  },
  {
    titre: 'Le double invisible',
    indices: [
      'Je te suis partout, mais je disparais dans le noir.',
      'Je change de taille selon l\'heure du jour.',
      'Le soir, je deviens immense et fin comme un fil.',
    ],
    solution: 'Une ombre',
  },
  {
    titre: 'Le messager plié',
    indices: [
      'On m\'écrit dessus avant de me faire voyager.',
      'Je porte souvent un nom et une adresse.',
      'On me colle un timbre avant de m\'envoyer.',
    ],
    solution: 'Une lettre',
  },
  {
    titre: 'Le voleur de secondes',
    indices: [
      'Je tourne sans jamais m\'arrêter, sauf si on m\'oublie.',
      'On me regarde souvent en étant en retard.',
      'J\'ai des aiguilles mais je ne couds jamais.',
    ],
    solution: 'Une horloge',
  },
  {
    titre: 'La maison qui voyage',
    indices: [
      'Je transporte des gens sans jamais me fatiguer.',
      'On me trouve sur des rails ou sur la route.',
      'Je m\'arrête à des endroits précis pour laisser descendre.',
    ],
    solution: 'Un bus',
  },
  {
    titre: 'Le petit soleil de poche',
    indices: [
      'Je nais d\'une étincelle et je meurs dans l\'eau.',
      'On me souffle pour m\'éteindre sur un gâteau.',
      'Sans moi, la cuisine resterait dans le noir.',
    ],
    solution: 'Une bougie',
  },
  {
    titre: 'Le géant qui dort debout',
    indices: [
      'Mes bras sont des branches, mes pieds des racines.',
      'Les oiseaux font leur nid dans mes cheveux.',
      'On me coupe parfois pour faire du papier.',
    ],
    solution: 'Un arbre',
  },
  {
    titre: 'Le miroir d\'eau',
    indices: [
      'Je reflète le ciel sans jamais bouger.',
      'Les poissons vivent dans mon ventre.',
      'On me trouve entre deux rives.',
    ],
    solution: 'Une rivière',
  },
  {
    titre: 'Le silencieux bavard',
    indices: [
      'J\'ai des pages mais je ne parle jamais à voix haute.',
      'On me tourne pour connaître la suite de l\'histoire.',
      'On me range sur une étagère quand j\'ai fini de raconter.',
    ],
    solution: 'Un livre',
  },
  {
    titre: 'Le voleur de sommeil',
    indices: [
      'Je sonne fort pour te réveiller le matin.',
      'On me règle la veille pour ne pas être en retard.',
      'On me déteste surtout le lundi.',
    ],
    solution: 'Un réveil',
  },
  {
    titre: 'Le passager clandestin',
    indices: [
      'Je me glisse sous les portes sans qu\'on me voie venir.',
      'Je fais trembler les rideaux sans jamais les toucher.',
      'On me sent surtout en automne.',
    ],
    solution: 'Le vent',
  },
];

export const enigmeAleatoire = creerPickerAleatoire(ENIGMES);
