// conversations.js — Scénarios pour le mini-jeu "Conversation". Chaque
// scène a des rôles abstraits ('A', 'B', 'C'...) attribués à de vrais
// joueurs au lancement de la manche. `lignes` est l'ordre de passage :
// chaque réplique est lue par le joueur qui incarne ce rôle, à tour de
// rôle, comme un scénario qu'on découvre au fur et à mesure.

export const SCENARIOS = [
  {
    genre: 'drôle',
    titre: 'Le retour du colis',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Aïe mon frère, le colis est arrivé pour toi, mais y'a foto : c'est déjà ouvert, et dedans y'a... un flamant rose gonflable, tu vois le truc-là." },
      { role: 'B', texte: "Non non non, moi j'ai jamais commandé ça hein. Ni gonflé, ni dégonflé, ni dans cette vie ni dans l'autre, c'est clair comme ça." },
      { role: 'A', texte: "Y'a une carte avec. Ça dit : « Pour notre grand du karaoké de samedi, on t'oubliera jamais. » Tu vois le délire, toi ?" },
      { role: 'B', texte: "Le karaoké-là, moi je connais pas ça oh. Ni samedi, ni un autre jour, je suis sérieux comme ça, foi de Dieu." },
      { role: 'A', texte: "Donc soit y'a un sosie à toi qui vit sa vie mieux que toi quelque part, soit toi tu me caches un gros dossier là, mon frère." },
      { role: 'B', texte: "Bon on va dire c'est le sosie, hein. Mais le flamant je garde, on refuse pas un cadeau du bon Dieu même si l'adresse est ratée, tu vois." },
    ],
  },
  {
    genre: 'drôle',
    titre: 'Embrouille au maquis',
    roles: ['A', 'B', 'C'],
    lignes: [
      { role: 'A', texte: "Bon les gars on est ensemble, mais avant qu'on commence, faut qu'on sache qui a mangé mon attiéké-poisson dans le frigo, parce que moi je vais pas dodo tranquille ce soir." },
      { role: 'B', texte: "Ça c'était pas prévu dans le programme du jour ça, mais puisqu'on est dedans, moi je dis qu'il faut interroger tout le monde, sans exception, pas de chouchou ici." },
      { role: 'C', texte: "Moi je réponds pas à ça sans mon avocat ici présent. Mais je dis quand même que l'attiéké-là avait l'air trop grave, à ce qu'on m'a raconté, hein." },
      { role: 'A', texte: "« À ce qu'on t'a raconté » ? Personne t'a raconté oh, toi seul tu étais dans la cuisine à midi pile, y'a foto même de ça." },
      { role: 'B', texte: "C'est exact ça. J'ai la vidéo de la caméra installée après l'histoire du yaourt de l'autre fois, on n'allait pas se laisser faire deux fois de suite." },
      { role: 'C', texte: "Bon ça va, ça va, c'est moi. Mais je dis quand même que c'était trop bon, et ça doit compter pour quelque chose dans cette histoire, non ?" },
    ],
  },
  {
    genre: 'drôle',
    titre: 'Embrouille au gbaka',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Eh grand, tu es sur mon pied depuis Adjamé jusqu'ici oh. Tu vas descendre où exactement avec ce poids-là, dis-moi." },
      { role: 'B', texte: "Moi mon pied ? C'est plutôt ton sac qui a pris toute la place depuis le départ, faut pas inverser les rôles ici, hein, doucement." },
      { role: 'A', texte: "Le sac-là c'est pas lourd du tout oh, c'est juste un peu d'attiéké pour ma go. Tu vas pas me faire ce sketch pour ça, quand même." },
      { role: 'B', texte: "Ta go va manger l'attiéké écrasé alors, parce qu'avec la façon dont le chauffeur roule, tout va être en bouillie avant Cocody, je te jure." },
      { role: 'A', texte: "Bon ok, on est ensemble. Chacun tire son truc et on n'en parle plus, sinon on va rater notre arrêt à force de discuter comme ça." },
      { role: 'B', texte: "Ça c'est parlé ça, grand. Allez, chap-chap, on descend, avant que ce chauffeur nous emmène jusqu'à Bassam pour rien du tout." },
    ],
  },
  {
    genre: 'drôle',
    titre: "Trop enjaillé",
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Eh petit, tu as vu comment je suis chaud aujourd'hui ? Je suis trop enjaillé, la forme est intacte, rien ne peut m'arrêter." },
      { role: 'B', texte: "Bon, c'est bien pour toi ça, mais tu peux baisser d'un cran s'il te plaît, parce que moi je suis fatigué, c'est pas la même énergie du tout." },
      { role: 'A', texte: "Aïe non, pas possible, la fatigue n'a pas sa place ici oh. Lève-toi, on va s'enjailler un coup ensemble, la vie est trop courte pour dodo." },
      { role: 'B', texte: "Toi-même tu sais que je suis pas dans le mood aujourd'hui. Arrête de me chercher comme ça s'il te plaît, laisse-moi tranquille un instant, hein." },
      { role: 'A', texte: "Ah bon, monsieur est fâché aujourd'hui, c'est grave ça dis donc. Bon petit, je te laisse avec ta mauvaise humeur, moi je vais m'enjailler ailleurs." },
      { role: 'B', texte: "Enfin une bonne nouvelle depuis ce matin, ça c'est vrai. Vas-y tranquille, et reviens seulement quand l'énergie sera un peu redescendue." },
    ],
  },
  {
    genre: 'épique',
    titre: 'Le dernier rempart',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Ils arrivent par le nord, par centaines. Nous ne sommes que deux à garder ce pont, et pourtant je n'ai jamais eu aussi peu peur de toute mon existence." },
      { role: 'B', texte: "Deux suffisent, si ces deux-là ont décidé que ce pont ne tomberait pas tant qu'il leur resterait un souffle pour le défendre." },
      { role: 'A', texte: "Si je tombe aujourd'hui, dis à mon village que j'ai tenu ma promesse jusqu'au bout, et que le blé sera moissonné sans crainte l'année prochaine." },
      { role: 'B', texte: "Tu le leur diras toi-même, car je ne compte pas te laisser tomber avant d'avoir vu cette moisson de mes propres yeux, à tes côtés." },
      { role: 'A', texte: "Alors levons nos armes une dernière fois, non pas comme des soldats qui craignent la fin, mais comme des gardiens qui en écrivent le début." },
      { role: 'B', texte: "Pour le pont. Pour le village. Et pour tous ceux qui ne sauront jamais nos noms mais dormiront ce soir grâce à ce que nous allons faire ici." },
    ],
  },
  {
    genre: 'épique',
    titre: 'Le conseil des trois royaumes',
    roles: ['A', 'B', 'C'],
    lignes: [
      { role: 'A', texte: "Trois royaumes, une seule couronne, et aucun de nous n'acceptera de plier le genou devant les deux autres. C'est ainsi que commencent les guerres qui durent cent ans." },
      { role: 'B', texte: "Ou c'est ainsi que commence la paix, si l'un de nous a enfin le courage de proposer autre chose qu'une couronne à se partager entre trois têtes fières." },
      { role: 'C', texte: "Je propose que la couronne ne repose sur aucune tête, mais qu'elle soit fondue et redistribuée à ceux qui n'ont jamais eu voix dans cette salle." },
      { role: 'A', texte: "Voilà une idée qui pourrait bien nous coûter nos trois trônes en une seule phrase, et pourtant je ne trouve rien à y redire ce soir." },
      { role: 'B', texte: "Alors qu'il en soit ainsi. Que l'histoire retienne que trois royaumes ont choisi, une fois, de perdre leur couronne plutôt que leur peuple." },
      { role: 'C', texte: "Que les forgerons préparent leurs feux. Ce soir, nous ne signons pas un traité entre rois, nous signons la fin des rois eux-mêmes." },
    ],
  },
  {
    genre: 'amour',
    titre: 'La drague au maquis',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Eh, tu m'as vu comment je te regarde depuis tantôt là ? On peut faire connaissance un peu, ou c'est compliqué pour toi ce soir ?" },
      { role: 'B', texte: "Hmm, cette phrase-là tu l'as déjà sortie à ma cousine la semaine passée, hein. Faut changer de disque un peu, sérieux." },
      { role: 'A', texte: "Aïe non, c'est pas vrai ça, tu me confonds avec un autre grand. Moi je suis unique dans mon genre, y'a pas de copie ici." },
      { role: 'B', texte: "Unique, unique, on va voir ça hein. Dis-moi ton nom d'abord, avant que je décide si je perds mon temps avec toi ou pas." },
      { role: 'A', texte: "Moi on m'appelle la légende du quartier, mais toi tu peux juste dire mon prénom, on n'est pas encore à un mariage." },
      { role: 'B', texte: "L'ego est haut placé dis donc. Bon, assieds-toi, on va voir si derrière l'ego y'a quelque chose d'intéressant, mais je promets rien du tout." },
    ],
  },
  {
    genre: 'amour',
    titre: 'Le crush qui tourne mal',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Bon, ça fait trois mois que je veux te dire ça, donc je me lance : tu me plais grave, et je crois même que c'est du sérieux là." },
      { role: 'B', texte: "Aïe la honte, toi tu choisis maintenant, devant tout le monde au maquis, pour me sortir ça ? Tu n'avais pas un autre moment ?" },
      { role: 'A', texte: "Il n'y a jamais eu de bon moment avec toi, donc je me suis dit, autant lâcher le morceau maintenant, tant pis pour la honte." },
      { role: 'B', texte: "Bon d'accord. Mais sache que si tu me fais ça et après tu disparais comme l'autre-là, je raconte cette histoire à tout le quartier, attention." },
      { role: 'A', texte: "Moi, disparaître ? Jamais de la vie, je suis sérieux comme un pasteur un dimanche. On est ensemble à partir d'aujourd'hui, point final." },
      { role: 'B', texte: "Bon, on va dire qu'on essaie. Mais au premier gbairai, c'est fini hein, je préviens direct pour qu'on soit clairs tous les deux." },
    ],
  },
  {
    genre: 'drame',
    titre: 'Gbairai au mariage',
    roles: ['A', 'B'],
    lignes: [
      { role: 'A', texte: "Faut qu'on parle de ce qui s'est passé au mariage de samedi, parce que moi je n'ai pas dormi depuis, et je crois que je suis pas seul dans ce cas." },
      { role: 'B', texte: "Il ne s'est rien passé au mariage que nous deux on ne savait pas déjà depuis des mois, sans jamais avoir le courage de le dire à voix haute." },
      { role: 'A', texte: "Alors pourquoi tu as attendu que toute la famille soit là, devant le griot et tout le monde, pour finalement le sortir sans me prévenir avant ?" },
      { role: 'B', texte: "Parce que seule devant toi, j'ai déjà essayé cent fois, et cent fois j'ai reculé. Il me fallait des témoins pour ne plus pouvoir reculer encore une fois." },
      { role: 'A', texte: "Tu aurais pu me le dire n'importe où ailleurs, dans notre cour, pas devant tout ce gbairai que je ne vais plus jamais oublier, sérieux." },
      { role: 'B', texte: "Tu as raison, je suis désolée pour la manière. Mais je ne regrette pas ce que j'ai dit, c'était la première fois en des années que j'étais vraie." },
    ],
  },
  {
    genre: 'drame',
    titre: "Le problème de l'héritage",
    roles: ['A', 'B', 'C'],
    lignes: [
      { role: 'A', texte: "Le notaire a été clair : la maison-là revient à un seul de nous trois, et papa n'a laissé aucune explication sur son choix, rien du tout." },
      { role: 'B', texte: "Pas besoin d'explication. On sait tous très bien pourquoi c'est moi qui dois hériter de cette maison, et je pense qu'il faut le dire clairement ici même." },
      { role: 'C', texte: "Parce que toi tu es resté à côté de lui pendant que nous on construisait notre vie ailleurs ? C'est ça ta version des faits, devant nous deux là ?" },
      { role: 'A', texte: "Arrêtez tous les deux, s'il vous plaît. On est en train de se faire un gbairai pour des murs, alors que la seule chose qui compte c'est qu'il n'est plus là pour nous voir comme ça." },
      { role: 'B', texte: "Justement. C'est peut-être la dernière chose qu'il nous a laissée : voir si on peut encore rester dans la même pièce sans se déchirer entre nous." },
      { role: 'C', texte: "Alors gardons la maison ensemble, comme avant, et essayons pour une fois de mériter ce qu'il pensait vraiment de nous trois, sans jamais nous l'avoir dit." },
    ],
  },
];

let dernierTitre = null;

export function scenarioAleatoirePourRoles(nombreDeJoueurs) {
  const possibles = SCENARIOS.filter((s) => s.roles.length <= nombreDeJoueurs);
  const pool = possibles.length > 0 ? possibles : SCENARIOS.filter((s) => s.roles.length === 2);
  let scenario;
  do {
    scenario = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && scenario.titre === dernierTitre);
  dernierTitre = scenario.titre;
  return scenario;
}
