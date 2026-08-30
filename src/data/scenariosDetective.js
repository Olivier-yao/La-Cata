import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// scenariosDetective.js — chaque scénario a un crime fictif, une série
// d'indices secrets distribués un par joueur (un seul pointe vraiment
// vers le coupable), et l'index du coupable dans le cast tiré au sort.

export const SCENARIOS_DETECTIVE = [
  {
    crime: 'Quelqu\'un a mangé toutes les brochettes avant l\'arrivée des invités.',
    coupableIndex: 0,
    indices: [
      'Tu avais les mains qui sentaient l\'épice juste avant que tout le monde arrive.',
      'Tu étais dans le jardin tout ce temps, tu n\'as rien vu.',
      'Tu es arrivé après la découverte du vol, tu es hors de cause.',
      'Tu as vu quelqu\'un traîner près du grill mais tu n\'es pas sûr de qui.',
      'Tu dormais dans la voiture, tu n\'as aucune idée de ce qui s\'est passé.',
      'Tu as entendu du bruit dans la cuisine mais tu pensais que c\'était le chat.',
    ],
  },
  {
    crime: 'Le haut-parleur bluetooth a mystérieusement disparu du salon.',
    coupableIndex: 1,
    indices: [
      'Tu étais aux toilettes pendant l\'heure du vol, témoin fiable.',
      'Tu avais besoin d\'un peu de silence et tu sais très bien où il est passé.',
      'Tu as vu une ombre passer près de la fenêtre du salon.',
      'Tu étais en train de charger ton téléphone à l\'autre bout de la maison.',
      'Tu discutais avec quelqu\'un dehors, tu n\'as rien remarqué.',
    ],
  },
  {
    crime: 'Le gâteau d\'anniversaire a une part manquante, personne ne veut avouer.',
    coupableIndex: 0,
    indices: [
      'Tu as du glaçage séché sur la manche depuis une heure.',
      'Tu es arrivé pile au moment de couper le gâteau, alibi en béton.',
      'Tu détestes le chocolat, ça t\'étonnerait que ce soit toi.',
      'Tu as vu quelqu\'un s\'éclipser vers la cuisine discrètement.',
      'Tu surveillais la porte d\'entrée toute la soirée.',
      'Tu étais en train de prendre des photos, tu as peut-être capturé le coupable sans le savoir.',
    ],
  },
  {
    crime: 'Quelqu\'un a changé la sonnerie du téléphone de l\'hôte pendant la soirée.',
    coupableIndex: 2,
    indices: [
      'Tu n\'as jamais touché à un téléphone qui n\'est pas le tien, principe sacré.',
      'Tu étais occupé à raconter une histoire à tout le monde, bon alibi.',
      'Tu connais le code du téléphone de l\'hôte depuis longtemps.',
      'Tu as remarqué que le téléphone avait changé de place sur la table.',
      'Tu étais dehors à prendre l\'air au moment des faits.',
    ],
  },
  {
    crime: 'La playlist de la soirée a basculé sans prévenir sur une compilation de comptines.',
    coupableIndex: 1,
    indices: [
      'Tu adores faire une bonne blague et tu avais le contrôle de l\'enceinte.',
      'Tu étais en pleine conversation sérieuse, loin de tout appareil.',
      'Tu as vu quelqu\'un s\'approcher discrètement du téléphone connecté.',
      'Tu détestes ce genre de blague, ce n\'est clairement pas ton style.',
      'Tu venais d\'arriver dans la pièce quand la musique a changé.',
      'Tu étais en train de servir à boire, les mains occupées.',
    ],
  },
];

export const scenarioDetectiveAleatoire = creerPickerAleatoire(SCENARIOS_DETECTIVE);
