import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// games.js — Registre des mini-jeux disponibles.
// `voteType` détermine quel écran de vote suit la manche :
// - 'graduee'    : trois cartes de points (1 / 3 / 6)
// - 'binaire'    : deux issues (Sans Rire)
// - 'vraifaux'   : verdict vrai/bidon (Le Menteur)
// - 'aucun'      : pas d'écran de vote après — le jeu calcule lui-même ses
//   points (Calcul Éclair) ou n'en distribue pas (Statue Surprise gère son
//   élimination en interne, manche après manche)
// `groupe: true` marque les mini-jeux qui font jouer plusieurs joueurs à la
// fois (Statue Surprise, Conversation) : contrairement aux autres, ils ne
// tournent pas joueur par joueur — une seule manche suffit avant de changer
// de mini-jeu.
// `manette: true` marque les mini-jeux "Manette Party" qui se jouent
// exclusivement depuis les téléphones connectés (voir src/manette/) —
// RoundScreen bloque leur lancement s'il y a moins de deux téléphones.
// `regles` s'affiche sur l'écran d'explication avant de lancer le jeu.

export const GAMES = [
  {
    id: 'virelangue-express',
    nom: 'Virelangue Express',
    voteType: 'graduee',
    regles: "Un virelangue défile à l'écran, du bas vers le haut, à vitesse régulière. Le joueur le lit à voix haute sans s'emmêler la langue. Une fois fini, la table note la performance de 1 à 6 points.",
  },
  {
    id: 'accent-surprise',
    nom: 'Accent Surprise',
    voteType: 'graduee',
    regles: "Un accent est tiré au sort (belge, robot, aristocrate anglais...). Le joueur doit lire un texte neutre qui défile en tenant cet accent du début à la fin. La table note ensuite si l'accent a tenu ou s'est effondré en route.",
  },
  {
    id: 'sans-rire',
    nom: 'Sans Rire',
    voteType: 'binaire',
    regles: "Le joueur lit un texte volontairement absurde en gardant un sérieux total, pendant que les autres tentent de le faire craquer (sans le toucher). La table tranche ensuite en un clic : tenu jusqu'au bout, ou craqué.",
  },
  {
    id: 'defi-chrono-absurde',
    nom: 'Défi Chrono Absurde',
    voteType: 'graduee',
    regles: "Une consigne ridicule s'affiche (mimer, déclarer sa flamme à un objet...) avec un compte à rebours qui ne pardonne pas. Le joueur doit l'exécuter avant la fin du chrono. La table note ensuite la prestation.",
  },
  {
    id: 'doublage-sauvage',
    nom: 'Doublage Sauvage',
    voteType: 'graduee',
    regles: "Une scène muette tourne en boucle. Le joueur invente à voix haute ce que les personnages sont en train de dire, en improvisant à chaque passage. La table note l'improvisation à la fin.",
  },
  {
    id: 'devine-le-bruit',
    nom: 'Devine le Bruit',
    voteType: 'graduee',
    regles: "Une consigne secrète s'affiche pour un seul joueur (les autres détournent le regard). Il doit reproduire le bruit demandé avec la bouche uniquement, sans mots ni mimes, pendant que la table essaie de deviner. La table note la performance.",
  },
  {
    id: 'chant-impose',
    nom: 'Chant Imposé',
    voteType: 'graduee',
    regles: "Un style musical est tiré au sort (opéra, rap, comptine, coupé-décalé...). Des paroles inventées défilent façon karaoké, et le joueur doit les chanter dans ce style précis. La table note ensuite la performance.",
  },
  {
    id: 'dessine-a-laveugle',
    nom: "Dessine à l'Aveugle",
    voteType: 'graduee',
    regles: "Une consigne de dessin s'affiche. Le joueur doit la dessiner sans jamais lever le stylo et sans regarder sa feuille, avant la fin du chrono. À la fin, tout le monde découvre le dessin et la table note.",
  },
  {
    id: 'le-menteur',
    nom: 'Le Menteur',
    voteType: 'vraifaux',
    regles: "Une affirmation s'affiche, vue du joueur seul, qui peut être vraie ou fausse au hasard. Le joueur plaide sa cause devant la table, qui répond aux questions puis vote à main levée si c'est vrai ou du bidon. La vérité est ensuite révélée.",
  },
  {
    id: 'memoire-flash',
    nom: 'Mémoire Flash',
    voteType: 'graduee',
    regles: "Un texte précis (chiffres, noms, détails) s'affiche quelques secondes, puis devient flou. Le joueur doit le réciter exactement de mémoire dans le temps imparti. Le texte réapparaît ensuite pour que la table juge la fidélité de la restitution.",
  },
  {
    id: 'texte-corse',
    nom: 'Texte Corsé',
    voteType: 'graduee',
    regles: "Un texte complet truffé de mots complexes ou rares s'affiche. Le joueur doit le lire en entier, à voix haute et sans s'arrêter, avant la fin du chrono. La table note ensuite la fluidité de la lecture.",
  },
  {
    id: 'calcul-eclair',
    nom: 'Calcul Éclair',
    voteType: 'aucun',
    regles: "Une opération (addition, soustraction, multiplication ou division) s'affiche. Le joueur annonce à voix haute une réponse approximative avant la fin du chrono — dès qu'il sonne, plus aucune réponse n'est acceptée. Plus l'estimation est proche du résultat exact, plus elle rapporte de points.",
  },
  {
    id: 'statue-surprise',
    nom: 'Statue Surprise',
    voteType: 'aucun',
    groupe: true,
    regles: "Tout le monde prend la pose imposée et reste figé. Le dernier à bouger sort du jeu. On enchaîne les manches avec des poses de plus en plus inconfortables jusqu'à ce qu'il ne reste qu'un seul joueur, qui remporte le duel.",
  },
  {
    id: 'conversation',
    nom: 'Conversation',
    voteType: 'graduee',
    groupe: true,
    regles: "Un scénario à plusieurs rôles est tiré au sort et distribué à des joueurs choisis au hasard. Chacun lit sa réplique à voix haute quand c'est son tour, comme un vrai dialogue qui s'enchaîne tout seul. La table note ensuite la performance collective.",
  },
  {
    id: 'improvisation',
    nom: 'Improvisation',
    voteType: 'graduee',
    groupe: true,
    regles: "Un thème de départ s'affiche et deux ou trois joueurs tirés au sort doivent construire une vraie conversation autour, sans aucun texte écrit à l'avance. Au bout du chrono, la table note la performance collective.",
  },
  {
    id: 'mot-surprise',
    nom: 'Mot Surprise',
    voteType: 'graduee',
    groupe: true,
    regles: "Plusieurs joueurs tirés au sort passent chacun leur tour, avec un mot différent à placer dans une phrase à voix haute, dès qu'il apparaît. Quelques secondes à peine avant de passer automatiquement au suivant. La table note ensuite la performance collective.",
  },
  {
    id: 'improvisation-titre',
    nom: 'Improvisation Titre',
    voteType: 'graduee',
    regles: "Un titre de film ou de série absurde s'affiche. Le joueur doit le pitcher en 30 secondes comme s'il vendait vraiment ce film à un producteur. La table note ensuite la performance.",
  },
  {
    id: 'alphabet-express',
    nom: 'Alphabet Express',
    voteType: 'graduee',
    regles: "Un thème est tiré au sort. Une lettre s'affiche, le joueur doit sortir un mot qui commence par cette lettre sur ce thème, avant la fin du temps imparti — qui se réduit à chaque tour. Ça continue jusqu'au blocage. La table note la performance selon le nombre de lettres enchaînées.",
  },
  {
    id: 'memoire-groupe',
    nom: 'Mémoire de Groupe',
    voteType: 'aucun',
    groupe: true,
    regles: "Une liste de mots s'allonge à chaque tour. Chaque joueur doit réciter toute la liste dans l'ordre avant d'ajouter son propre mot. Le premier qui se trompe fait perdre la manche à tout le monde — sauf à lui-même, qui repart à zéro.",
  },
  {
    id: 'sondage-predictif',
    nom: 'Sondage Prédictif',
    voteType: 'aucun',
    groupe: true,
    regles: "Une question s'affiche sur le groupe. Chacun vote en secret, à tour de rôle, pour la personne qui lui semble correspondre. Les résultats sont ensuite révélés avec les pourcentages à l'écran.",
  },
  {
    id: 'le-detective',
    nom: 'Le Détective',
    voteType: 'aucun',
    groupe: true,
    regles: "Un crime fictif est tiré au sort, avec un indice secret distribué à chaque joueur impliqué — un seul pointe vraiment vers le coupable. Après une enquête à voix haute, la table accuse quelqu'un. La vérité est ensuite révélée.",
  },
  {
    id: 'categories-chrono',
    nom: 'Catégories Chrono',
    voteType: 'aucun',
    groupe: true,
    regles: "Une catégorie et une lettre s'affichent. Tout le monde doit crier une réponse valide avant la fin du chrono. Les doublons ou réponses invalides sont écartés avant de valider les points.",
  },
  {
    id: 'association-chaine',
    nom: "Association d'Idées en Chaîne",
    voteType: 'aucun',
    groupe: true,
    regles: "Un mot de départ est tiré au sort. Chaque joueur, à son tour, doit dire un mot lié au précédent avant la fin d'un temps qui se réduit à chaque passage. Le premier qui hésite ou répète fait perdre la chaîne.",
  },
  {
    id: 'histoire-plusieurs-voix',
    nom: 'Histoire à Plusieurs Voix',
    voteType: 'graduee',
    groupe: true,
    regles: "Le début d'une histoire s'affiche. Des joueurs tirés au sort ajoutent chacun une phrase à leur tour, avec une contrainte différente à respecter à chaque fois. La table note ensuite la contribution de chacun à l'histoire collective.",
  },
  {
    id: 'speed-dating-improbable',
    nom: 'Speed Dating Improbable',
    voteType: 'graduee',
    groupe: true,
    regles: "Deux joueurs tirés au sort incarnent chacun un personnage absurde pour une mini scène de rencontre chronométrée. La table vote ensuite la meilleure alchimie — le même verdict compte pour les deux.",
  },
  {
    id: 'proces-fictif',
    nom: 'Procès Fictif',
    voteType: 'binaire',
    groupe: true,
    regles: "Un joueur est accusé d'un fait absurde tiré au sort, deux autres joueurs plaident comme avocats. Après les plaidoiries, la table rend son verdict : coupable ou non coupable.",
  },
  {
    id: 'emission-tele-achat',
    nom: 'Émission de Télé-Achat',
    voteType: 'graduee',
    regles: "Un objet inutile s'affiche à l'écran. Le joueur a 30 secondes pour le vendre comme le meilleur produit du siècle. La table note ensuite le pitch.",
  },
  {
    id: 'declaration',
    nom: 'Déclaration',
    voteType: 'graduee',
    regles: "Un type de déclaration est tiré au sort (amour, guerre, rupture, aveu...) et un autre joueur est désigné pour la recevoir. Le joueur a 30 secondes pour la lui faire, le plus sérieusement ou le plus théâtralement possible. La table note ensuite la performance.",
  },
  {
    id: 'texto-sous-pression',
    nom: 'Texto Sous Pression',
    voteType: 'aucun',
    regles: "Un message absurde et long s'affiche. Le joueur doit le retaper mot pour mot, le plus vite et le plus précisément possible, avant la fin du chrono. Plus la retranscription est fidèle, plus elle rapporte de points.",
  },
  {
    id: 'evasion-express',
    nom: 'Évasion Express',
    voteType: 'aucun',
    groupe: true,
    regles: "Une mini énigme collective s'affiche, avec des indices qui se débloquent progressivement. Toute l'équipe cherche la solution ensemble avant de la proposer.",
  },

  // --- Manette Party : les 20 mini-jeux qui se jouent depuis les
  // téléphones connectés (voir `manette: true` et src/manette/). Chacun a
  // besoin d'au moins deux téléphones dans la salle, sauf Croquis en
  // Direct qui suit le flux normal "un joueur à la fois".
  {
    id: 'duel-buzzer',
    nom: 'Le Duel du Buzzer',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Sans aucune question ni consigne : dès que l'hôte ouvre les buzzers, le premier qui appuie sur son téléphone gagne la manche. Pur réflexe.",
  },
  {
    id: 'vision-floue',
    nom: 'Vision Floue',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Un émoji flouté s'affiche à l'écran et se précise petit à petit. Le premier qui devine ce que c'est et buzz sur son téléphone gagne.",
  },
  {
    id: 'question-eclair',
    nom: 'Question Éclair',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "L'hôte lit une question de culture générale à voix haute. Premier qui buzz sur son téléphone répond, la table juge si c'est bon.",
  },
  {
    id: 'compte-est-bon-express',
    nom: 'Le Compte est Bon Express',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Une opération s'affiche à l'écran. Premier qui buzz sur son téléphone annonce son résultat à voix haute, la table juge si c'est bon.",
  },
  {
    id: 'tir-a-la-corde',
    nom: 'Tir à la Corde',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Les téléphones connectés sont répartis en deux équipes. Chacun martèle son bouton pour tirer la corde de son côté — l'équipe qui tire le plus fort gagne.",
  },
  {
    id: 'le-trone',
    nom: 'Le Trône',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Chacun martèle son bouton sur son téléphone pendant le chrono. Celui qui cumule le plus d'appuis monte sur le trône.",
  },
  {
    id: 'surchauffe',
    nom: 'Surchauffe',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Un défi coopératif : tout le monde tape en même temps sur son téléphone pour atteindre ensemble un objectif d'appuis avant la fin du chrono.",
  },
  {
    id: 'marathon-des-doigts',
    nom: 'Marathon des Doigts',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Dix secondes chrono, chacun tape le plus vite possible sur son téléphone. Classement individuel au nombre d'appuis.",
  },
  {
    id: 'sondage-choc',
    nom: 'Sondage Choc',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Une question à choix multiples s'affiche. Chacun vote en secret sur son téléphone, les résultats tombent en direct — ceux qui votent avec la majorité marquent des points.",
  },
  {
    id: 'qui-ferait-ca',
    nom: 'Qui Ferait Ça ?',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Une situation façon \"qui serait le plus susceptible de...\" s'affiche. Chacun vote pour la personne présente qui colle le mieux — la plus désignée remporte le titre.",
  },
  {
    id: 'plus-ou-moins',
    nom: 'Plus ou Moins',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Deux valeurs s'affichent, il faut deviner laquelle est la plus grande. Chacun répond sur son téléphone, bonne réponse égale points.",
  },
  {
    id: 'juste-prix-express',
    nom: 'Le Juste Prix Express',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Un objet et quatre fourchettes de prix s'affichent. Chacun estime le bon prix sur son téléphone.",
  },
  {
    id: 'vote-de-la-honte',
    nom: 'Vote de la Honte',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Une situation gênante s'affiche avec plusieurs réactions possibles. Chacun vote sa vraie réaction sur son téléphone, les résultats révèlent qui pense comme qui.",
  },
  {
    id: 'simon-dit-numerique',
    nom: 'Simon Dit Numérique',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Une séquence de couleurs s'affiche une seule fois sur l'écran. Chacun doit la retaper dans l'ordre sur les 4 boutons de son téléphone — classement au plus long préfixe correct.",
  },
  {
    id: 'memoire-flash-collective',
    nom: 'Mémoire Flash Collective',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Même principe que Simon, avec une séquence d'émojis à mémoriser puis reproduire sur son téléphone.",
  },
  {
    id: 'cadavre-exquis-numerique',
    nom: 'Cadavre Exquis Numérique',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Chacun dessine à son tour sur son téléphone, en direct sur un dessin collectif qui n'est jamais effacé entre deux tours. Personne ne sait ce que le résultat final donnera.",
  },
  {
    id: 'le-traitre',
    nom: 'Le Traître',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Un rôle secret est envoyé sur chaque téléphone : un traître, et le reste loyal. Discussion à voix haute, puis vote téléphone pour démasquer le traître.",
  },
  {
    id: 'espion-parmi-nous',
    nom: 'Espion Parmi Nous',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "Tout le monde reçoit le même lieu secret sur son téléphone, sauf un espion tiré au sort qui ne le connaît pas. Questions à voix haute sans jamais nommer le lieu, puis vote pour démasquer l'espion.",
  },
  {
    id: 'roue-du-destin',
    nom: 'La Roue du Destin',
    voteType: 'aucun',
    groupe: true,
    manette: true,
    regles: "La roue tourne en continu sur l'écran. Chacun a un bouton STOP sur son téléphone — celui qui l'arrête sur la meilleure case gagne.",
  },
  {
    id: 'croquis-en-direct',
    nom: 'Croquis en Direct',
    voteType: 'graduee',
    regles: "Une consigne de dessin est envoyée sur le téléphone du joueur actif, qui dessine directement dessus — le trait apparaît en direct sur l'écran principal. La table note le résultat.",
  },
];

export const jeuAleatoire = creerPickerAleatoire(GAMES);
