// sansRire.js — Textes volontairement absurdes ou gênants à lire avec un
// sérieux imperturbable pour "Sans Rire". Des paragraphes complets : plus
// c'est long à tenir sans craquer, plus la manche est cruelle.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const TEXTES_SANS_RIRE = [
  "Je suis un canard élégant et personne ne peut m'arrêter. Mon plus grand rêve est de devenir une chaise pliante respectée, reconnue dans tout le quartier pour son maintien irréprochable en toutes circonstances.",
  "Hier, j'ai eu une conversation profonde avec une pomme de terre, et honnêtement, elle avait des arguments plus solides que la plupart des gens que je croise habituellement lors des réunions de famille.",
  "Je pense sincèrement que les pigeons dirigent le monde en secret depuis un abri anti-atomique situé sous une célèbre place publique, et qu'ils communiquent leurs décisions par un système de roucoulements codés.",
  "Mon horoscope du jour dit que je vais épouser une imprimante, ce qui explique enfin pourquoi celle du bureau refuse systématiquement de fonctionner quand quelqu'un d'autre que moi essaie de l'utiliser.",
  "Je m'entraîne tous les matins à négocier avec des écureuils, principalement parce qu'un jour ils prendront le pouvoir dans ce parc, et je préfère être en bons termes avec eux avant que ça n'arrive officiellement.",
  "Le fromage me parle parfois, et honnêtement, il a de bons conseils, bien meilleurs que ceux de mon psychologue, qui lui n'a jamais suggéré de laisser reposer les problèmes importants pendant plusieurs mois.",
  "Je suis convaincu que mon reflet dans le miroir vit une meilleure vie que moi, avec un travail plus intéressant, des amis plus drôles, et probablement un appartement mieux rangé de l'autre côté du verre.",
  "Un jour, je deviendrai le roi officiel de tous les ronds-points de la région, et j'instaurerai enfin des règles de priorité claires que tout le monde respectera, contrairement à la situation actuelle, chaotique et injuste.",
  "Mes chaussettes ont une opinion politique et elles ne sont pas d'accord entre elles, ce qui rend chaque matin particulièrement tendu au moment de choisir laquelle porter en premier sans déclencher un incident diplomatique.",
  "Je collectionne secrètement les miettes de pain tombées sous la table du salon, dans l'espoir de constituer un jour une réserve suffisante pour survivre à un hiver particulièrement rigoureux et mal anticipé.",
  "Chaque nuit, je m'entraîne en secret à devenir le meilleur ami d'un lampadaire de mon quartier, qui m'écoute sans jamais me couper la parole, ce qui, il faut l'admettre, en fait déjà un meilleur confident que la plupart.",
  "Je suis certain que les nuages se déplacent en fonction de mon humeur du jour, et je porte cette responsabilité avec le sérieux qu'elle mérite, refusant même de sortir les jours où je me sens particulièrement orageux.",
  "Anitché, je vous jure que mon poisson-chat vit dans le caniveau du quartier depuis trois ans, qu'il me reconnaît, et qu'il refuse absolument de parler à qui que ce soit d'autre que moi.",
  "Eh tchai, moi je dis que le jour où je vais couler pour de vrai, ce sera à cause d'un pari stupide avec mon petit frère, pas à cause d'un vrai problème d'argent, et ça c'est officiel.",
  "Je te bognan sérieusement, mon vieux, mais je dois te dire que ton perroquet m'a insulté deux fois cette semaine, et je commence à croire qu'il le fait exprès rien que pour moi.",
  'Mon plus grand rêve est de devenir une chaise pliante respectée. J\'ai déjà commencé ma formation en restant immobile plusieurs heures par jour. Mes amis ne comprennent pas encore ma vocation.',
  'Je collectionne les miettes de pain perdues sous mon canapé depuis trois ans. Ma collection compte aujourd\'hui plus de deux mille spécimens uniques. Un musée m\'a déjà contacté, mais je refuse de m\'en séparer.',
  'Mon aspirateur et moi avons une relation compliquée depuis quelques mois. Il refuse d\'avaler certaines de mes idées les plus brillantes. On essaie une thérapie de couple ce week-end.',
  'Je suis persuadé que les nuages se moquent de moi personnellement. Chaque fois que je sors sans parapluie, ils s\'organisent en secret. Je commence à envisager de déménager sous terre.',
  'Ma plante verte me juge silencieusement depuis le salon depuis des semaines. Je sens son regard chaque fois que je mange devant la télévision. Un jour, elle craquera et me dira ce qu\'elle pense vraiment.',
  'J\'ai décidé de devenir ambassadeur officieux des ronds de serviette. Personne ne défend leurs intérêts et c\'est une injustice. Mon discours inaugural est prévu pour le prochain dîner de famille.',
  'Je suis certain que mon four a une vie sociale plus active que la mienne. Il reçoit du monde tous les soirs et moi je regarde de loin. On devrait peut-être partager nos contacts.',
  'Ma théorie personnelle, c\'est que les chaussettes disparaissent pour fonder une nouvelle civilisation. Elles se retrouvent quelque part sous le lave-linge pour organiser leur société. Un jour, elles reviendront nous demander des comptes.',
  'Mon frigo garde des secrets que je ne suis pas encore prêt à entendre. Chaque nuit, j\'entends des bruits suspects venant de l\'intérieur. Je pense qu\'il complote quelque chose avec le congélateur.',
  'Je suis convaincu d\'avoir déjà rencontré mon double dans une autre vie de yaourt. On se ressemblait beaucoup, question texture et question regard. Depuis, je mange mes yaourts avec un profond respect.',
  'Ma théorie, c\'est que les ascenseurs ont une mémoire émotionnelle très développée. Celui de mon immeuble se souvient de toutes mes mauvaises journées. Je lui fais confiance plus qu\'à certains humains.',
  'Je suis en froid avec mon parapluie depuis qu\'il m\'a lâché en pleine tempête. On ne s\'est pas reparlé depuis, même si on habite toujours ensemble. Ça rend les sorties pluvieuses très tendues.',
  'Mon plus grand exploit sportif reste d\'avoir couru après un bus pendant douze secondes exactement. Toute ma famille en parle encore aujourd\'hui avec une immense fierté. Je pense sérieusement à en faire mon métier.',
  'Je suis certain que les feux de circulation choisissent personnellement de me faire attendre. On a une histoire compliquée depuis mon permis. J\'ai fini par accepter que c\'est peut-être moi, le problème.',
  'Mon plus grand talent caché est de deviner l\'heure sans montre, sauf que je me trompe toujours. Mes proches trouvent ça fascinant malgré tout. Je continue à m\'entraîner sans relâche.',
  'Je suis persuadé que mon ombre me suit parce qu\'elle m\'admire secrètement. On ne se sépare jamais, sauf la nuit, ce qui reste un mystère. Je respecte son besoin d\'indépendance.',
];

export const texteSansRireAleatoire = creerPickerAleatoire(TEXTES_SANS_RIRE);
