// themes.js — Amorces de conversation pour "Improvisation". Contrairement
// à "Conversation" (répliques écrites d'avance), ici rien n'est scripté :
// le thème donne juste le point de départ, tout le reste s'invente en
// direct.

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const THEMES = [
  "Vous êtes coincés ensemble dans un ascenseur en panne depuis vingt minutes, et l'un de vous vient d'avouer un secret gênant.",
  "Le sujet du jour : qui devrait payer la course de gbaka, sachant qu'un de vous a complètement coulé ce mois-ci.",
  "Vous débattez pour savoir si l'attiéké est meilleur avec du poisson ou avec du poulet, et personne ne veut céder d'un centimètre.",
  "L'un de vous vient d'annoncer qu'il quitte le pays demain matin, sans avoir prévenu personne avant aujourd'hui.",
  "Vous organisez en secret la fête surprise de quelqu'un qui, par un malheureux hasard, se trouve être présent dans la pièce.",
  "Le sujet : lequel de vous deux ferait le meilleur chef de quartier, et pourquoi c'est évidemment l'autre qui a tort.",
  "Vous réalisez que vous portez exactement la même tenue ce soir, au même événement, devant les mêmes personnes.",
  "L'un de vous doit annoncer à l'autre qu'il a accidentellement effacé un souvenir numérique auquel il tenait énormément.",
  "Vous discutez pour savoir qui va garder le chien pendant les vacances, et chacun sort une excuse plus solide que l'autre.",
  "Le dernier gbairai du quartier est sur toutes les lèvres, et chacun de vous en a une version des faits très différente.",
  "Vous venez de gagner ensemble à la loterie, mais aucun de vous ne veut dire à voix haute combien exactement.",
  "L'un de vous a emprunté quelque chose d'important à l'autre il y a longtemps et ne l'a toujours pas rendu.",
  'Convainquez le groupe que les gbaka sont plus fiables que le métro parisien.',
  'Débattez pour savoir si l\'ananas a sa place sur une pizza.',
  'Expliquez pourquoi les chats devraient avoir le droit de vote.',
  'Défendez l\'idée que dormir est un sport à part entière.',
  'Convainquez le groupe que le café du matin est une drogue légale.',
  'Débattez : faut-il interdire les lundis par décret ?',
  'Défendez l\'idée que les escaliers sont sous-estimés dans la société moderne.',
  'Expliquez pourquoi votre plat préféré devrait être classé patrimoine mondial.',
  'Convainquez le groupe que parler tout seul est un signe d\'intelligence supérieure.',
  'Débattez pour savoir si les nuages ont une conscience.',
  'Défendez l\'idée qu\'on devrait pouvoir mettre les vieilles chaussettes au musée.',
  'Expliquez pourquoi il faudrait un jour férié pour célébrer la sieste.',
  'Convainquez le groupe que les pigeons sont sous-estimés.',
  'Débattez : le riz ou l\'attiéké, lequel devrait dominer le monde ?',
  'Défendez l\'idée que les embouteillages sont en fait un moment de méditation.',
  'Expliquez pourquoi on devrait tous avoir droit à un deuxième petit-déjeuner officiel.',
  'Convainquez le groupe que les ronds-points sont l\'invention la plus sous-estimée de l\'histoire.',
  'Débattez : faut-il bannir les réveils du quotidien humain ?',
  'Défendez l\'idée que les maquis devraient être classés au patrimoine culturel.',
  'Expliquez pourquoi porter des chaussettes avec des sandales devrait redevenir tendance.',
];

export const themeAleatoire = creerPickerAleatoire(THEMES);
