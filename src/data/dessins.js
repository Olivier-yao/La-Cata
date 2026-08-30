// dessins.js — Consignes pour "Dessine à l'Aveugle" (une seule ligne,
// sans lever le stylo, sans regarder la feuille).

import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

export const DESSINS = [
  'Un cheval qui fait ses courses',
  'Un poisson qui conduit une voiture',
  'Un dragon qui boit un café',
  'Une pieuvre en réunion de travail',
  'Un fantôme qui fait du vélo',
  'Un extraterrestre qui promène son chien',
  'Un ours en costume de banquier',
  'Une girafe qui fait du yoga',
  'Un pingouin en entretien d\'embauche',
  'Un chauffeur de gbaka qui klaxonne un client',
  'Une vendeuse d\'attiéké qui court après un client qui a coulé',
  'Un hippopotame qui fait du yoga.',
  'Une girafe qui essaie de faire du vélo.',
  'Un chat DJ dans une boîte de nuit.',
  'Un extraterrestre qui commande un café.',
  'Une pieuvre qui joue de plusieurs instruments à la fois.',
  'Un mouton qui fait ses courses au supermarché.',
  'Un dinosaure qui prend le bus pour aller au travail.',
  'Un fantôme qui essaie de se faire discret à une fête.',
  'Un ours en pyjama qui regarde la télé.',
  'Une tortue qui participe à une course de Formule 1.',
  'Un pingouin qui essaie de bronzer à la plage.',
  'Un robot qui plante des fleurs dans un jardin.',
  'Un lion qui fait la queue à la boulangerie.',
  'Un poulpe en pleine séance de manucure sur ses huit tentacules.',
  'Une souris qui pilote un avion.',
  'Un crocodile qui donne un cours de danse classique.',
  'Un escargot qui participe à un marathon.',
  'Un chameau qui fait du surf.',
  'Un panda qui répare une voiture.',
  'Une chauve-souris qui lit un livre à l\'envers.',
  'Un kangourou qui fait ses courses avec un caddie.',
  'Un serpent qui essaie de faire du hula hoop.',
  'Un éléphant qui joue du piano avec sa trompe.',
  'Une chèvre qui donne une conférence devant un public.',
];

export const dessinAleatoire = creerPickerAleatoire(DESSINS);
