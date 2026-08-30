import { genererMotsSurprise } from './generators.js';

// mots.js — Banque de mots pour "Mot Surprise". Mélange de mots concrets,
// abstraits et quelques touches nouchi (voir generators.js), choisis pour
// être faciles à placer dans une phrase improvisée sans trop réfléchir.

export const MOTS = genererMotsSurprise(250);
