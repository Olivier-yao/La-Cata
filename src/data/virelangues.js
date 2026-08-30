// virelangues.js — Textes pour "Virelangue Express". Des paragraphes
// complets (plusieurs virelangues enchaînés), pas des phrases isolées :
// le défilement doit laisser le temps de bafouiller plusieurs fois avant
// la fin, pas s'arrêter après trois mots.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const VIRELANGUES = [
  "Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches ? Six chaises sèchent chez ces charmantes sœurs suisses, pendant que trois gros rats gris grattent trois gros tapis gras dans le couloir d'à côté, sans jamais se soucier du bruit qu'ils font ni de l'heure qu'il est.",
  "Un chasseur sachant chasser doit savoir chasser sans son chien, mais ce chasseur-ci, sachant chasser sans son chien, sait aussi chasser sans son fusil, ce qui rend la chasse nettement plus philosophique que prévu, et nettement moins efficace pour ramener quoi que ce soit à la maison ce soir.",
  "Ces cerises sont si sûres qu'on ne sait pas si c'en sont, disait Didon en dînant du dos d'un dodu dindon, avant d'exiger d'exquises excuses au cuisinier pour ce mystère fruitier non résolu, qui allait, selon lui, gâcher le reste de la soirée à tout le village réuni.",
  "Le ver vert va vers le verre vert en traversant le pré, croise un pruneau cru qui discute avec un pruneau cuit, et tous deux se demandent lequel des deux finira dans le même verre vert que le ver, pendant que la chèvre du berger d'à côté les regarde sans comprendre un mot de cette histoire.",
  "Natacha n'attacha pas son chat Pacha qui s'échappa aussitôt vers le jardin, où il croisa trois gros rats gris grattant trois gros tapis gras, ce qui n'améliora ni la situation du chat ni celle des tapis, et encore moins celle de Natacha qui devait maintenant tout ranger avant le retour de sa tante.",
  "Je veux et j'exige d'exquises excuses de la part de l'archiduchesse dont les chaussettes archi-sèches ont, semble-t-il, effrayé six chaises qui séchaient tranquillement chez ces charmantes sœurs suisses, lesquelles n'avaient rien demandé à personne et comptaient bien le faire savoir à qui voulait l'entendre.",
  "Le chasseur sachant chasser croisa un ver vert allant vers un verre vert, s'arrêta net, se demanda s'il devait le chasser aussi, puis se souvint qu'un ver n'est ni un gibier ni un pruneau, cru ou cuit, et reprit donc sa route en direction du bois, un peu vexé d'avoir perdu autant de temps pour rien.",
  "Didon dîna, dit-on, du dos d'un dodu dindon offert par trois gros rats gris qui, faute de mieux, avaient décidé que gratter des tapis gras ne suffisait plus à remplir leurs soirées de rongeurs ambitieux, et qu'il leur fallait désormais viser plus haut, quitte à déranger tout un dîner de duchesse.",
  "Si six scies scient six cyprès, six cent six scies scieront six cent six cyprès, ce qui pose un sérieux problème de rangement pour quiconque possède autant de cyprès que de scies dans son jardin, sans compter le bruit que ça va faire chez les voisins dès les premières heures du matin.",
  "Piano ou piano, sage ou pas sage, la chèvre broute au bois sans que le brave berger sache si le berger est plus brave que la chèvre n'est sage, et personne dans le village n'a jamais tranché la question, malgré des décennies de débats animés autour de ce mystère pastoral non résolu.",
  "Douze douches douces dans l'ombre d'un chêne, ça douche doucement, disait la duchesse, avant de croiser trois gros rats gris qui préféraient de loin gratter des tapis gras à prendre une douche douce, ce qui, selon elle, en disait long sur les priorités de ces rongeurs mal élevés.",
  'Les chaussettes de l\'archiduchesse sont-elles sèches, archi-sèches ? Un chasseur sachant chasser doit savoir chasser sans son chien.',
  'Six chaises sèchent chez ces charmantes sœurs suisses. Trois gros rats gris grattent trois gros tapis gras.',
  'Didon dîna, dit-on, du dos d\'un dodu dindon. Le ver vert va vers le verre vert.',
  'Je veux et j\'exige d\'exquises excuses. Ces cerises sont si sûres qu\'on ne sait pas si c\'en sont.',
  'Natacha n\'attacha pas son chat Pacha qui s\'échappa. Pruneau cru, pruneau cuit, pruneau cuit, pruneau cru.',
  'Cinq chiens chassent six chats. Suis-je bien chez ce cher Serge ?',
  'Ta Katie t\'a quitté, tata t\'a-t-elle quitté aussi ? Rat vit riz, rat mit patte à ras, rat mit patte à riz.',
  'Fruits frais, fruits frits, fruits cuits, fruits crus. Zazie causait avec sa cousine en cousant.',
  'Une jeune juge jauge un joli jujube jaune. Combien de sous sont ces six saucissons-ci ?',
  'Sachez, mon cher Sacha, que Natacha n\'attacha pas son chat. Chouette chose chuchotée dans le creux d\'une oreille.',
  'Poisson sans bosson, ni son ni bruisson. Douze douches douces dans une douzaine de douves.',
  'Le loup glouton engloutit un mouton tout rond. Ce sont seize jacinthes sèches dans seize sachets siciliens.',
  'Papa peigne son chien avec un peigne fin sans se plaindre.',
];

export const virelangueAleatoire = creerPickerAleatoire(VIRELANGUES);
