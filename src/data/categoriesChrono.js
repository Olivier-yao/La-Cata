import { creerPickerAleatoire } from '../lib/randomSansRepeat.js';
import { genererCategoriesChrono } from './generators.js';

// categoriesChrono.js — paires catégorie + lettre pour Catégories Chrono,
// générées par combinatoire (voir generators.js) pour couvrir 250 tirages
// distincts sans jamais réécrire une paire à la main.

export const CATEGORIES_CHRONO = genererCategoriesChrono(250);

export const categorieChronoAleatoire = creerPickerAleatoire(CATEGORIES_CHRONO);
