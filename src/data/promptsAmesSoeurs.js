import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';

// promptsAmesSoeurs.js — questions neutres pour Âmes Sœurs : le but n'est
// jamais d'avoir "raison", juste de tomber sur la même réponse que son
// âme sœur secrète sans se concerter.

export const PROMPTS_AMES_SOEURS = [
  { question: 'Choisis un chiffre.', options: ['Un', 'Deux', 'Trois', 'Quatre'] },
  { question: 'Choisis une couleur.', options: ['Rouge', 'Bleu', 'Vert', 'Jaune'] },
  { question: 'Choisis une saison.', options: ['Printemps', 'Été', 'Automne', 'Hiver'] },
  { question: 'Choisis un animal.', options: ['Lion', 'Éléphant', 'Chat', 'Perroquet'] },
  { question: 'Choisis un repas.', options: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Goûter'] },
  { question: 'Choisis un jour.', options: ['Lundi', 'Vendredi', 'Samedi', 'Dimanche'] },
];

export const promptAmesSoeursAleatoire = creerPickerAleatoire(PROMPTS_AMES_SOEURS);
