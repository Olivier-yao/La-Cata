// accents.js — Accents/contraintes imposées pour "Accent Surprise"
// et textes neutres à lire (l'accent crée le comique, pas le texte).

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const ACCENTS = [
  'Accent belge',
  'Accent marseillais',
  'Accent robot',
  'Voix de bébé',
  'Accent aristocrate anglais',
  'Voix de présentateur météo trop enthousiaste',
  'Accent québécois',
  'Voix de commentateur sportif',
  'Chuchoté comme un secret',
  'Voix de super-héros fatigué',
  'Accent nouchi bien corsé',
  'Voix de vieux du village qui raconte un souvenir',
];

export const TEXTES_NEUTRES = [
  "Aujourd'hui, je suis allé acheter du pain et j'ai croisé mon voisin, qui m'a raconté en détail comment son chat avait renversé toute sa collection de plantes vertes pour la troisième fois du mois.",
  "Il fait beau ce matin, j'ai décidé de sortir marcher un peu dans le quartier, et je suis tombé sur un vide-grenier improvisé où quelqu'un vendait des lampes en forme de fruits pour un prix totalement injustifié.",
  "Je crois que j'ai oublié mes clés chez ma tante encore une fois, ce qui veut dire que je vais devoir sonner chez le voisin du dessous pour récupérer le double qu'il garde depuis l'incident de l'été dernier.",
  "Ce plat est délicieux, tu devrais vraiment goûter la sauce, même si je soupçonne fortement qu'il y a un ingrédient secret que personne dans cette famille n'a jamais voulu révéler à qui que ce soit.",
  "Demain je dois me lever tôt pour aller chercher le colis à la poste, celui qui contient soi-disant un cadeau pour ma cousine, mais qui traîne depuis si longtemps que j'ai complètement oublié ce que c'était.",
  "Mon téléphone est tombé dans l'eau et maintenant il ne s'allume plus, ce qui explique pourquoi je n'ai répondu à aucun message depuis trois jours et pourquoi je découvre cette histoire seulement maintenant.",
  "La réunion de ce matin a duré deux heures de plus que prévu, principalement parce que quelqu'un a insisté pour débattre du choix des gobelets réutilisables pendant un quart d'heure entier sans raison apparente.",
  "En rentrant du travail, j'ai vu un homme qui promenait trois furets en laisse comme si c'était la chose la plus normale du monde, et personne autour de moi ne semblait trouver ça particulièrement étrange.",
  "Le livreur a sonné trois fois de suite avant de laisser le colis chez le voisin, qui l'a ouvert par erreur en pensant que c'était le sien, avant de découvrir avec surprise qu'il contenait des chaussettes.",
  "Ma grand-mère m'a encore raconté l'histoire du jour où elle a rencontré mon grand-père, mais cette fois la version comportait un chien, un accordéon et une averse qui n'existaient pas dans les précédentes.",
  'Je crois que j\'ai encore oublié mes clés chez ma tante, c\'est la troisième fois ce mois-ci.',
  'Ce plat est vraiment délicieux, tu devrais goûter la sauce avant qu\'il n\'en reste plus.',
  'Mon téléphone est tombé dans l\'eau hier soir et maintenant il ne s\'allume plus du tout.',
  'On m\'a proposé un nouveau poste au bureau, je dois donner ma réponse avant vendredi.',
  'Le bus était en retard ce matin, du coup je suis arrivé en retard à mon rendez-vous.',
  'J\'ai planté des tomates dans le jardin cette année, on verra bien ce que ça donne.',
  'Ma sœur organise une fête pour son anniversaire samedi prochain, tout le monde est invité.',
  'Le film qu\'on a regardé hier était plutôt long, mais la fin valait le coup.',
  'Je cherche un nouvel appartement plus proche du centre-ville depuis quelques semaines.',
  'Le café du coin a changé de propriétaire, l\'ambiance n\'est plus vraiment la même.',
  'J\'ai commencé un nouveau livre hier soir, je n\'ai pas réussi à le lâcher avant minuit.',
  'Mon chat a encore renversé un pot de fleurs, c\'est la deuxième fois cette semaine.',
  'On a mangé au nouveau restaurant du quartier, la note était plus salée que prévu.',
  'Je dois réparer le robinet de la salle de bain, il fuit depuis quelques jours.',
  'Le trajet en train était agréable, j\'ai pu lire tranquillement pendant deux heures.',
  'J\'ai retrouvé une vieille photo de classe en rangeant mon grenier ce week-end.',
  'Mon collègue m\'a proposé de covoiturer ensemble pour aller au travail désormais.',
  'Le marché du dimanche matin est toujours plein de monde à cette période de l\'année.',
  'J\'ai essayé une nouvelle recette hier, le résultat était plutôt correct finalement.',
  'Les prévisions annoncent de la pluie pour ce week-end, tant pis pour le pique-nique.',
  'J\'ai croisé un ancien camarade de lycée que je n\'avais pas vu depuis des années.',
  'Le vétérinaire a dit que mon chien devait perdre un peu de poids cette année.',
];

export const accentAleatoire = creerPickerAleatoire(ACCENTS);
export const texteNeutreAleatoire = creerPickerAleatoire(TEXTES_NEUTRES);
